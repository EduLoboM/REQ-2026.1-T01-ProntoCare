const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const { gerarToken } = require('../src/middleware/auth');

jest.mock('../src/db');

const tokenAdmin = gerarToken({ id: 0, role: 'admin', usuario: 'admin' });
const tokenMedico = gerarToken({ id: 1, role: 'medico', nome: 'Dr' });
const tokenPaciente = gerarToken({ id: 10, role: 'paciente', nome: 'P' });

describe('Medicos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('401', async () => {
    const res = await request(app).get('/api/medicos');
    expect(res.status).toBe(401);
  });

  it('403 medico', async () => {
    const res = await request(app).get('/api/medicos').set('Authorization', `Bearer ${tokenMedico}`);
    expect(res.status).toBe(403);
  });

  it('200 admin get', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, crm: '123' }] });
    const res = await request(app).get('/api/medicos').set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
  });

  it('500 admin get error', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app).get('/api/medicos').set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(500);
  });

  describe('buscarPorId', () => {
    it('200 success', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const res = await request(app).get('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
    });

    it('404 not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).get('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(404);
    });

    it('500 internal error', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).get('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(500);
    });
  });

  describe('criar', () => {
    it('201 post', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 2, nome: 'Dr' }] });
      const res = await request(app).post('/api/medicos').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Dr', crm: '1', email: 'e', senha: '1' });
      expect(res.status).toBe(201);
    });

    it('400 missing fields', async () => {
      const res = await request(app).post('/api/medicos').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Dr' });
      expect(res.status).toBe(400);
    });

    it('409 already exists', async () => {
      const error = new Error();
      error.code = '23505';
      pool.query.mockRejectedValueOnce(error);
      const res = await request(app).post('/api/medicos').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Dr', crm: '1', email: 'e', senha: '1' });
      expect(res.status).toBe(409);
    });

    it('500 error', async () => {
      pool.query.mockRejectedValueOnce(new Error('error'));
      const res = await request(app).post('/api/medicos').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Dr', crm: '1', email: 'e', senha: '1' });
      expect(res.status).toBe(500);
    });
  });

  describe('atualizar', () => {
    it('200 put with senha', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }).mockResolvedValueOnce({ rows: [{ id: 1, nome: 'Dr' }] });
      const res = await request(app).put('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Dr', senha: 'new' });
      expect(res.status).toBe(200);
    });

    it('404 not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).put('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Dr' });
      expect(res.status).toBe(404);
    });

    it('400 empty body', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const res = await request(app).put('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`).send({});
      expect(res.status).toBe(400);
    });

    it('409 conflict', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const error = new Error();
      error.code = '23505';
      pool.query.mockRejectedValueOnce(error);
      const res = await request(app).put('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Dr' });
      expect(res.status).toBe(409);
    });

    it('500 internal error', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      pool.query.mockRejectedValueOnce(new Error('error'));
      const res = await request(app).put('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Dr' });
      expect(res.status).toBe(500);
    });
  });

  describe('excluir', () => {
    it('200 delete', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ativo: false }] });
      const res = await request(app).delete('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
    });

    it('404 delete not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).delete('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(404);
    });

    it('500 delete internal error', async () => {
      pool.query.mockRejectedValueOnce(new Error('error'));
      const res = await request(app).delete('/api/medicos/1').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(500);
    });
  });

  describe('excluirPermanente', () => {
    it('200 delete permanent success when documents are empty/old', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      pool.query.mockResolvedValueOnce({ rows: [] });
      pool.query.mockResolvedValueOnce({ rows: [] });
      pool.query.mockResolvedValueOnce({ rows: [] });
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).delete('/api/medicos/1/permanente').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body.mensagem).toContain('excluídos permanentemente');
    });

    it('403 delete permanent blocked when has recent documents', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      pool.query.mockResolvedValueOnce({ rows: [{ id: 100 }] });

      const res = await request(app).delete('/api/medicos/1/permanente').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(403);
      expect(res.body.erro).toContain('menos de 20 anos');
    });

    it('404 not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).delete('/api/medicos/1/permanente').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(404);
    });

    it('500 internal error', async () => {
      pool.query.mockRejectedValueOnce(new Error('error'));
      const res = await request(app).delete('/api/medicos/1/permanente').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(500);
    });
  });

  describe('buscarDetalhes', () => {
    it('200 success', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, nome: 'Dr' }] });
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, nome: 'P' }] });
      pool.query.mockResolvedValueOnce({ rows: [{ total_pacientes: 1, total_atendimentos: 2, total_anamneses: 3 }] });

      const res = await request(app).get('/api/medicos/1/detalhes').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body.medico.nome).toBe('Dr');
      expect(res.body.pacientes[0].nome).toBe('P');
      expect(res.body.stats.total_pacientes).toBe(1);
    });

    it('404 not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).get('/api/medicos/1/detalhes').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(404);
    });

    it('500 internal error', async () => {
      pool.query.mockRejectedValueOnce(new Error('error'));
      const res = await request(app).get('/api/medicos/1/detalhes').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(500);
    });
  });
});