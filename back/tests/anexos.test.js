const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const { gerarToken } = require('../src/middleware/auth');

jest.mock('../src/db');

const tokenAdmin = gerarToken({ id: 0, role: 'admin', usuario: 'admin' });
const tokenMedico1 = gerarToken({ id: 1, role: 'medico', nome: 'Dr1' });
const tokenMedico2 = gerarToken({ id: 2, role: 'medico', nome: 'Dr2' });
const tokenPaciente = gerarToken({ id: 10, role: 'paciente', nome: 'P' });

describe('Anexos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/anexos', () => {
    it('401 when not authenticated', async () => {
      const res = await request(app).post('/api/anexos');
      expect(res.status).toBe(401);
    });

    it('403 for non-medico role (e.g. paciente)', async () => {
      const res = await request(app)
        .post('/api/anexos')
        .set('Authorization', `Bearer ${tokenPaciente}`)
        .send({ paciente_id: 10, nome_arquivo: 'e.pdf', mime_type: 'app/pdf', dados_base64: 'abc' });
      expect(res.status).toBe(403);
    });

    it('400 when missing mandatory fields', async () => {
      const res = await request(app)
        .post('/api/anexos')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ paciente_id: 10 }); // Missing other fields
      expect(res.status).toBe(400);
    });

    it('201 creates anexo successfully', async () => {
      // 1. Verify patient exists and belongs to doctor
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
      // 2. Insert attachment
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 5,
          paciente_id: 10,
          atendimento_id: null,
          medico_id: 1,
          nome_arquivo: 'exame.pdf',
          mime_type: 'application/pdf',
          tamanho_bytes: 120,
          criado_em: new Date().toISOString()
        }]
      });
      // 3. Log auditoria query
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/anexos')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({
          paciente_id: 10,
          nome_arquivo: 'exame.pdf',
          mime_type: 'application/pdf',
          tamanho_bytes: 120,
          dados_base64: 'SGVsbG8gV29ybGQ='
        });

      expect(res.status).toBe(201);
      expect(res.body.nome_arquivo).toBe('exame.pdf');
      expect(res.body.id).toBe(5);
    });

    it('403 when posting to patient of another doctor', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] }); // Patient of medico 2

      const res = await request(app)
        .post('/api/anexos')
        .set('Authorization', `Bearer ${tokenMedico1}`) // medico 1 is requesting
        .send({
          paciente_id: 10,
          nome_arquivo: 'exame.pdf',
          mime_type: 'application/pdf',
          tamanho_bytes: 120,
          dados_base64: 'SGVsbG8gV29ybGQ='
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/anexos/paciente/:pacienteId', () => {
    it('200 retrieves list of patient attachments', async () => {
      // 1. Check patient access permissions (for medico)
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
      // 2. Select attachments (excluding base64)
      pool.query.mockResolvedValueOnce({
        rows: [
          { id: 1, nome_arquivo: 'a.png', mime_type: 'image/png', tamanho_bytes: 50, criado_em: new Date(), medico_nome: 'Dr1' }
        ]
      });

      const res = await request(app)
        .get('/api/anexos/paciente/10')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].nome_arquivo).toBe('a.png');
      expect(res.body[0].dados_base64).toBeUndefined(); // Should exclude base64 in listing
    });

    it('403 when medico lists attachments of another doctor\'s patient', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] }); // Patient of medico 2

      const res = await request(app)
        .get('/api/anexos/paciente/10')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/anexos/:id', () => {
    it('200 retrieves specific attachment details with base64 data', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 5,
          paciente_id: 10,
          atendimento_id: null,
          medico_id: 1,
          nome_arquivo: 'exame.pdf',
          mime_type: 'application/pdf',
          tamanho_bytes: 120,
          dados_base64: 'SGVsbG8gV29ybGQ=',
          criado_em: new Date(),
          medico_nome: 'Dr1',
          paciente_medico_id: 1
        }]
      });

      const res = await request(app)
        .get('/api/anexos/5')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(200);
      expect(res.body.nome_arquivo).toBe('exame.pdf');
      expect(res.body.dados_base64).toBe('SGVsbG8gV29ybGQ=');
    });
  });

  describe('DELETE /api/anexos/:id', () => {
    it('403 blocked when less than 20 years old', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 5,
          paciente_id: 10,
          medico_id: 1,
          criado_em: new Date().toISOString(), // recent
          paciente_medico_id: 1
        }]
      });

      const res = await request(app)
        .delete('/api/anexos/5')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(403);
      expect(res.body.erro).toContain('20 anos');
    });

    it('200 deletes successfully when older than 20 years', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 5,
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
        .delete('/api/anexos/5')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(200);
      expect(res.body.mensagem).toContain('sucesso');
    });
  });
});
