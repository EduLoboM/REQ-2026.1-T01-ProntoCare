const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const { gerarToken } = require('../src/middleware/auth');
const { registrarAcao } = require('../src/helpers/auditoria');

jest.mock('../src/db');
jest.mock('../src/helpers/auditoria', () => ({
  registrarAcao: jest.fn(),
}));

const tokenAdmin = gerarToken({ id: 0, role: 'admin', usuario: 'admin' });
const tokenMedico = gerarToken({ id: 1, role: 'medico', nome: 'Dr' });
const tokenMedico2 = gerarToken({ id: 2, role: 'medico', nome: 'Dr2' });
const tokenPaciente = gerarToken({ id: 10, role: 'paciente', nome: 'P' });
const tokenPaciente2 = gerarToken({ id: 11, role: 'paciente', nome: 'P2' });

describe('Blockchain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/blockchain', () => {
    it('400 missing fields', async () => {
      const res = await request(app).post('/api/blockchain').set('Authorization', `Bearer ${tokenAdmin}`).send({});
      expect(res.status).toBe(400);
      expect(res.body.erro).toContain('Campos obrigatórios');
    });

    it('404 patient not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // paciente
      const res = await request(app).post('/api/blockchain').set('Authorization', `Bearer ${tokenAdmin}`).send({
        paciente_id: 99, indice: 0, tipo: 'genesis', dados_hash: 'abc', hash_anterior: '000', hash: '123'
      });
      expect(res.status).toBe(404);
    });

    it('403 medico accessing other patient', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] }); // paciente is from medico 2
      const res = await request(app).post('/api/blockchain').set('Authorization', `Bearer ${tokenMedico}`).send({
        paciente_id: 10, indice: 0, tipo: 'genesis', dados_hash: 'abc', hash_anterior: '000', hash: '123'
      });
      expect(res.status).toBe(403);
    });

    it('409 hash_anterior conflict', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] }); // paciente ok
      pool.query.mockResolvedValueOnce({ rows: [{ hash: 'old_hash', indice: 0 }] }); // ultimoBloco
      const res = await request(app).post('/api/blockchain').set('Authorization', `Bearer ${tokenMedico}`).send({
        paciente_id: 10, indice: 1, tipo: 'anamnese', dados_hash: 'abc', hash_anterior: 'wrong_hash', hash: '123'
      });
      expect(res.status).toBe(409);
      expect(res.body.erro).toContain('Hash anterior não corresponde');
    });

    it('409 indice conflict', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] }); // paciente ok
      pool.query.mockResolvedValueOnce({ rows: [{ hash: 'old_hash', indice: 0 }] }); // ultimoBloco
      const res = await request(app).post('/api/blockchain').set('Authorization', `Bearer ${tokenMedico}`).send({
        paciente_id: 10, indice: 2, tipo: 'anamnese', dados_hash: 'abc', hash_anterior: 'old_hash', hash: '123'
      });
      expect(res.status).toBe(409);
      expect(res.body.erro).toContain('Índice esperado');
    });

    it('400 genesis rule if no blocks exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] }); // paciente ok
      pool.query.mockResolvedValueOnce({ rows: [] }); // no blocks
      const res = await request(app).post('/api/blockchain').set('Authorization', `Bearer ${tokenMedico}`).send({
        paciente_id: 10, indice: 1, tipo: 'anamnese', dados_hash: 'abc', hash_anterior: '000', hash: '123'
      });
      expect(res.status).toBe(400);
      expect(res.body.erro).toContain('Primeiro bloco deve ser o gênesis');
    });

    it('201 success insert', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] }); // paciente ok
      pool.query.mockResolvedValueOnce({ rows: [] }); // no blocks
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, hash: '123' }] }); // insert success

      const res = await request(app).post('/api/blockchain').set('Authorization', `Bearer ${tokenMedico}`).send({
        paciente_id: 10, indice: 0, tipo: 'genesis', dados_hash: 'abc', hash_anterior: '0', hash: '123'
      });
      expect(res.status).toBe(201);
      expect(res.body.id).toBe(1);
    });

    it('500 internal error', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).post('/api/blockchain').set('Authorization', `Bearer ${tokenAdmin}`).send({
        paciente_id: 10, indice: 0, tipo: 'genesis', dados_hash: 'abc', hash_anterior: '0', hash: '123'
      });
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/blockchain/paciente/:id', () => {
    it('404 paciente not found (medico)', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).get('/api/blockchain/paciente/10').set('Authorization', `Bearer ${tokenMedico}`);
      expect(res.status).toBe(404);
    });

    it('403 medico accessing other patient', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] });
      const res = await request(app).get('/api/blockchain/paciente/10').set('Authorization', `Bearer ${tokenMedico}`);
      expect(res.status).toBe(403);
    });

    it('403 paciente accessing other patient', async () => {
      const res = await request(app).get('/api/blockchain/paciente/10').set('Authorization', `Bearer ${tokenPaciente2}`);
      expect(res.status).toBe(403);
    });

    it('200 success list', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, hash: '123' }] });
      const res = await request(app).get('/api/blockchain/paciente/10').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('500 internal error', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/blockchain/paciente/10').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/blockchain/paciente/:id/ultimo', () => {
    it('404 paciente not found (medico)', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).get('/api/blockchain/paciente/10/ultimo').set('Authorization', `Bearer ${tokenMedico}`);
      expect(res.status).toBe(404);
    });

    it('403 medico accessing other patient', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] });
      const res = await request(app).get('/api/blockchain/paciente/10/ultimo').set('Authorization', `Bearer ${tokenMedico}`);
      expect(res.status).toBe(403);
    });

    it('403 paciente accessing other patient', async () => {
      const res = await request(app).get('/api/blockchain/paciente/10/ultimo').set('Authorization', `Bearer ${tokenPaciente2}`);
      expect(res.status).toBe(403);
    });

    it('200 null when no blocks', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // list is empty
      const res = await request(app).get('/api/blockchain/paciente/10/ultimo').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body).toBe(null);
    });

    it('200 success', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, hash: '123' }] });
      const res = await request(app).get('/api/blockchain/paciente/10/ultimo').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body.hash).toBe('123');
    });

    it('500 internal error', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/blockchain/paciente/10/ultimo').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/blockchain/paciente/:id/verificar', () => {
    it('404 paciente not found (medico)', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).get('/api/blockchain/paciente/10/verificar').set('Authorization', `Bearer ${tokenMedico}`);
      expect(res.status).toBe(404);
    });

    it('403 medico accessing other patient', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] });
      const res = await request(app).get('/api/blockchain/paciente/10/verificar').set('Authorization', `Bearer ${tokenMedico}`);
      expect(res.status).toBe(403);
    });

    it('403 paciente accessing other patient', async () => {
      const res = await request(app).get('/api/blockchain/paciente/10/verificar').set('Authorization', `Bearer ${tokenPaciente2}`);
      expect(res.status).toBe(403);
    });

    it('200 ok empty blockchain', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // blocks
      const res = await request(app).get('/api/blockchain/paciente/10/verificar').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body.valida).toBe(true);
      expect(res.body.blocos).toBe(0);
      expect(registrarAcao).toHaveBeenCalled();
    });

    it('200 invalid blockchain', async () => {
      pool.query.mockResolvedValueOnce({ rows: [
        { indice: 0, hash: 'h0', hash_anterior: '0' },
        { indice: 1, hash: 'h1', hash_anterior: 'wrong_h0' }
      ] });
      const res = await request(app).get('/api/blockchain/paciente/10/verificar').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body.valida).toBe(false);
      expect(res.body.blocoInvalido).toBe(1);
    });

    it('200 valid blockchain', async () => {
      pool.query.mockResolvedValueOnce({ rows: [
        { indice: 0, hash: 'h0', hash_anterior: '0' },
        { indice: 1, hash: 'h1', hash_anterior: 'h0' }
      ] });
      const res = await request(app).get('/api/blockchain/paciente/10/verificar').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body.valida).toBe(true);
    });

    it('500 internal error', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/blockchain/paciente/10/verificar').set('Authorization', `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/blockchain/:id/assinar', () => {
    it('401 when not authenticated', async () => {
      const res = await request(app).post('/api/blockchain/50/assinar');
      expect(res.status).toBe(401);
    });

    it('400 when missing signature fields', async () => {
      const res = await request(app)
        .post('/api/blockchain/50/assinar')
        .set('Authorization', `Bearer ${tokenMedico}`)
        .send({ provedor: 'vida' }); // missing cpf, pin, otp
      expect(res.status).toBe(400);
      expect(res.body.erro).toContain('obrigatórios');
    });

    it('200 signs blockchain block successfully', async () => {
      // 1. Fetch block mock
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 50, paciente_id: 10, hash: 'bloco_hash' }]
      });
      // 2. Fetch paciente mock to verify doctor owns patient
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 10, medico_id: 1 }]
      });
      // 3. Update query mock
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 50,
          paciente_id: 10,
          hash: 'bloco_hash',
          assinado: true,
          assinatura_provedor: 'vida',
          assinatura_nome: 'Dr',
          assinatura_cpf: '123.456.789-00',
          assinatura_data: new Date().toISOString()
        }]
      });
      // 4. Audit log query mock
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/blockchain/50/assinar')
        .set('Authorization', `Bearer ${tokenMedico}`)
        .send({ provedor: 'vida', cpf: '123.456.789-00', pin: '1234', otp: '999999' });

      expect(res.status).toBe(200);
      expect(res.body.assinado).toBe(true);
      expect(res.body.assinatura_provedor).toBe('vida');
    });
  });
});
