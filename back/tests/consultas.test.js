const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const { gerarToken } = require('../src/middleware/auth');

jest.mock('../src/db');

const tokenAdmin = gerarToken({ id: 0, role: 'admin', usuario: 'admin' });
const tokenMedico1 = gerarToken({ id: 1, role: 'medico', nome: 'Dr1' });
const tokenMedico2 = gerarToken({ id: 2, role: 'medico', nome: 'Dr2' });
const tokenPaciente = gerarToken({ id: 10, role: 'paciente', nome: 'P1' });

describe('Consultas API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/consultas', () => {
    it('401 when not authenticated', async () => {
      const res = await request(app).get('/api/consultas');
      expect(res.status).toBe(401);
    });

    it('200 retrieves list of consultations for medico', async () => {
      const mockConsultas = [
        { id: 1, paciente_id: 10, medico_id: 1, data_hora: new Date().toISOString(), status: 'Agendado', paciente_nome: 'P1', medico_nome: 'Dr1' }
      ];
      pool.query.mockResolvedValueOnce({ rows: mockConsultas });

      const res = await request(app)
        .get('/api/consultas')
        .set('Authorization', `Bearer ${tokenMedico1}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe(1);
    });

    it('200 retrieves list of consultations for paciente', async () => {
      const mockConsultas = [
        { id: 1, paciente_id: 10, medico_id: 1, data_hora: new Date().toISOString(), status: 'Agendado', paciente_nome: 'P1', medico_nome: 'Dr1' }
      ];
      pool.query.mockResolvedValueOnce({ rows: mockConsultas });

      const res = await request(app)
        .get('/api/consultas')
        .set('Authorization', `Bearer ${tokenPaciente}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe('POST /api/consultas', () => {
    it('401 when not authenticated', async () => {
      const res = await request(app).post('/api/consultas').send({ paciente_id: 10, data_hora: new Date().toISOString() });
      expect(res.status).toBe(401);
    });

    it('403 for non-medico/non-admin roles (e.g. paciente)', async () => {
      const res = await request(app)
        .post('/api/consultas')
        .set('Authorization', `Bearer ${tokenPaciente}`)
        .send({ paciente_id: 10, data_hora: new Date().toISOString() });
      expect(res.status).toBe(403);
    });

    it('400 when missing fields', async () => {
      const res = await request(app)
        .post('/api/consultas')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ paciente_id: 10 });
      expect(res.status).toBe(400);
      expect(res.body.erro).toContain('Campos obrigatorios');
    });

    it('400 when patient is inactive', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1, ativo: false }] });

      const res = await request(app)
        .post('/api/consultas')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ paciente_id: 10, data_hora: new Date().toISOString() });

      expect(res.status).toBe(400);
      expect(res.body.erro).toContain('inativo');
    });

    it('403 when medico schedules for patient of another doctor', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2, ativo: true }] });

      const res = await request(app)
        .post('/api/consultas')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ paciente_id: 10, data_hora: new Date().toISOString() });

      expect(res.status).toBe(403);
      expect(res.body.erro).toContain('Acesso negado');
    });

    it('201 creates consultation successfully', async () => {
      const dataHora = new Date().toISOString();
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1, ativo: true }] }); // check patient
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, paciente_id: 10, medico_id: 1, data_hora: dataHora, status: 'Agendado' }] }); // insert
      pool.query.mockResolvedValueOnce({ rows: [] }); // log_alteracoes insert

      const res = await request(app)
        .post('/api/consultas')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ paciente_id: 10, data_hora: dataHora });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('Agendado');
      expect(res.body.paciente_id).toBe(10);
    });
  });

  describe('PUT /api/consultas/:id', () => {
    it('404 when consultation does not exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/api/consultas/999')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ status: 'Em atendimento' });

      expect(res.status).toBe(404);
    });

    it('403 when updating another doctor\'s consultation', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, medico_id: 2, status: 'Agendado', data_hora: new Date().toISOString() }] });

      const res = await request(app)
        .put('/api/consultas/1')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ status: 'Em atendimento' });

      expect(res.status).toBe(403);
    });

    it('400 when status change requested and consultation is not from today', async () => {
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, medico_id: 1, status: 'Agendado', data_hora: ontem.toISOString(), paciente_id: 10 }] });

      const res = await request(app)
        .put('/api/consultas/1')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ status: 'Em atendimento' });

      expect(res.status).toBe(400);
      expect(res.body.erro).toContain('dia atual');
    });

    it('200 updates status successfully when consultation is from today', async () => {
      const hoje = new Date();
      
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, medico_id: 1, status: 'Agendado', data_hora: hoje.toISOString(), paciente_id: 10 }] }); // fetch
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, status: 'Em atendimento', data_hora: hoje.toISOString() }] }); // update
      pool.query.mockResolvedValueOnce({ rows: [] }); // log_alteracoes insert

      const res = await request(app)
        .put('/api/consultas/1')
        .set('Authorization', `Bearer ${tokenMedico1}`)
        .send({ status: 'Em atendimento' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Em atendimento');
    });
  });
});
