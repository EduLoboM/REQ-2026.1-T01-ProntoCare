const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const { gerarToken } = require('../src/middleware/auth');

jest.mock('../src/db');

const tokenAdmin = gerarToken({ id: 0, role: 'admin', usuario: 'admin' });
const tokenMedico1 = gerarToken({ id: 1, role: 'medico', nome: 'Dr1' });
const tokenMedico2 = gerarToken({ id: 2, role: 'medico', nome: 'Dr2' });
const tokenPaciente = gerarToken({ id: 10, role: 'paciente', nome: 'P' });

describe('Receitas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/receitas', () => {
    it('401 when not authenticated', async () => {
      const res = await request(app).post('/api/receitas');
      expect(res.status).toBe(401);
    });

    it('403 for non-medico role (e.g. paciente)', async () => {
      const res = await request(app)
        .post('/api/receitas')
        .set('Authorization', `Bearer ${tokenPaciente}`)
        .send({ paciente_id: 10, medicamentos: 'Dipirona 500mg', observacoes: 'Tomar se dor' });
      expect(res.status).toBe(403);
    });

    it('400 when missing mandatory fields', async () => {
      const res = await request(app)
        .post('/api/receitas')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ paciente_id: 10 }); // Missing medicamentos
      expect(res.status).toBe(400);
      expect(res.body.erro).toContain('medicamentos');
    });

    it('201 creates receita successfully', async () => {
      // 1. Verify patient exists and belongs to doctor
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
      // 2. Insert prescription
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 50,
          paciente_id: 10,
          medico_id: 1,
          medicamentos: 'Dipirona 500mg',
          observacoes: 'Tomar de 6 em 6 horas',
          criado_em: new Date().toISOString()
        }]
      });
      // 3. Log auditoria query
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/receitas')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({
          paciente_id: 10,
          medicamentos: 'Dipirona 500mg',
          observacoes: 'Tomar de 6 em 6 horas'
        });

      expect(res.status).toBe(201);
      expect(res.body.medicamentos).toBe('Dipirona 500mg');
      expect(res.body.id).toBe(50);
    });

    it('403 when posting to patient of another doctor', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] }); // Patient of medico 2

      const res = await request(app)
        .post('/api/receitas')
        .set('Authorization', `Bearer ${tokenMedico1}`) // medico 1 is requesting
        .send({
          paciente_id: 10,
          medicamentos: 'Paracetamol 750mg'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/receitas/paciente/:pacienteId', () => {
    it('200 retrieves list of patient prescriptions', async () => {
      // 1. Check patient access permissions (for medico)
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
      // 2. Select prescriptions
      pool.query.mockResolvedValueOnce({
        rows: [
          { id: 50, paciente_id: 10, medicamentos: 'Amoxicilina', observacoes: '', criado_em: new Date(), medico_nome: 'Dr1' }
        ]
      });

      const res = await request(app)
        .get('/api/receitas/paciente/10')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].medicamentos).toBe('Amoxicilina');
    });

    it('403 when medico lists prescriptions of another doctor\'s patient', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] }); // Patient of medico 2

      const res = await request(app)
        .get('/api/receitas/paciente/10')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/receitas/:id', () => {
    it('200 retrieves specific prescription details', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 50,
          paciente_id: 10,
          medico_id: 1,
          medicamentos: 'Ibuprofeno',
          observacoes: 'Tomar com água',
          criado_em: new Date(),
          paciente_nome: 'João Silva',
          paciente_cpf: '123.456.789-00',
          paciente_nascimento: '1990-01-01',
          paciente_sexo: 'M',
          medico_nome: 'Dr1',
          medico_crm: 'CRM/SP 123456',
          medico_especialidade: 'Cardiologia',
          paciente_medico_id: 1
        }]
      });

      const res = await request(app)
        .get('/api/receitas/50')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(200);
      expect(res.body.medicamentos).toBe('Ibuprofeno');
      expect(res.body.medico_crm).toBe('CRM/SP 123456');
    });
  });

  describe('DELETE /api/receitas/:id', () => {
    it('403 blocked when less than 20 years old', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 50,
          paciente_id: 10,
          medico_id: 1,
          criado_em: new Date().toISOString(), // recent
          paciente_medico_id: 1
        }]
      });

      const res = await request(app)
        .delete('/api/receitas/50')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(403);
      expect(res.body.erro).toContain('20 anos');
    });

    it('200 deletes successfully when older than 20 years', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 50,
          paciente_id: 10,
          medico_id: 1,
          criado_em: new Date('2001-01-01').toISOString(), // > 20 years
          paciente_medico_id: 1
        }]
      });
      // Audit log mock
      pool.query.mockResolvedValueOnce({ rows: [] });
      // Delete mock
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .delete('/api/receitas/50')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(200);
      expect(res.body.mensagem).toContain('sucesso');
    });
  });

  describe('PUT /api/receitas/:id', () => {
    it('401 when not authenticated', async () => {
      const res = await request(app).put('/api/receitas/50');
      expect(res.status).toBe(401);
    });

    it('403 for non-medico role (e.g. paciente)', async () => {
      const res = await request(app)
        .put('/api/receitas/50')
        .set('Authorization', `Bearer ${tokenPaciente}`)
        .send({ medicamentos: 'Dipirona 500mg' });
      expect(res.status).toBe(403);
    });

    it('404 when recipe not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/api/receitas/50')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ medicamentos: 'Dipirona 500mg' });

      expect(res.status).toBe(404);
    });

    it('403 when updating prescription of another doctor\'s patient', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 50, paciente_id: 10, medico_id: 2, medicamentos: 'Old' }] // belongs to Dr2 (id: 2)
      });

      const res = await request(app)
        .put('/api/receitas/50')
        .set('Authorization', `Bearer ${tokenMedico1}`) // Dr1 (id: 1) is editing
        .send({ medicamentos: 'Dipirona 500mg' });

      expect(res.status).toBe(403);
    });

    it('400 when medications field is empty', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 50, paciente_id: 10, medico_id: 1, medicamentos: 'Old' }]
      });

      const res = await request(app)
        .put('/api/receitas/50')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ medicamentos: '' });

      expect(res.status).toBe(400);
    });

    it('200 updates prescription successfully', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 50, paciente_id: 10, medico_id: 1, medicamentos: 'Old', observacoes: 'Old Obs' }]
      });
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 50, paciente_id: 10, medico_id: 1, medicamentos: 'New Med', observacoes: 'New Obs' }]
      });
      // audit log mock
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/api/receitas/50')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ medicamentos: 'New Med', observacoes: 'New Obs' });

      expect(res.status).toBe(200);
      expect(res.body.medicamentos).toBe('New Med');
      expect(res.body.observacoes).toBe('New Obs');
    });
  });

  describe('POST /api/receitas/:id/assinar', () => {
    it('401 when not authenticated', async () => {
      const res = await request(app).post('/api/receitas/50/assinar');
      expect(res.status).toBe(401);
    });

    it('400 when missing signature fields', async () => {
      const res = await request(app)
        .post('/api/receitas/50/assinar')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ provedor: 'birdid' }); // missing cpf, pin, otp
      expect(res.status).toBe(400);
      expect(res.body.erro).toContain('obrigatórios');
    });

    it('200 signs prescription successfully', async () => {
      // 1. Fetch recipe mock
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 50, paciente_id: 10, medico_id: 1, medicamentos: 'Dipirona' }]
      });
      // 2. Update query mock
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 50,
          paciente_id: 10,
          medico_id: 1,
          medicamentos: 'Dipirona',
          assinado: true,
          assinatura_provedor: 'birdid',
          assinatura_nome: 'Dr1',
          assinatura_cpf: '123.456.789-00',
          assinatura_data: new Date().toISOString()
        }]
      });
      // 3. Audit log query mock
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/receitas/50/assinar')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ provedor: 'birdid', cpf: '123.456.789-00', pin: '1234', otp: '999999' });

      expect(res.status).toBe(200);
      expect(res.body.assinado).toBe(true);
      expect(res.body.assinatura_provedor).toBe('birdid');
    });
  });
});
