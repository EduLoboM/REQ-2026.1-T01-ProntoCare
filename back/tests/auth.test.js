const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const bcrypt = require('bcryptjs');

jest.mock('../src/db');

describe('Auth /api/auth', () => {
  const senhaHash = bcrypt.hashSync('senha123', 10);

  describe('POST /api/auth/login', () => {
    it('200 admin', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ login: 'admin', senha: 'admin' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('admin');
    });

    it('200 medico', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, nome: 'Dr', senha_hash: senhaHash, ativo: true }],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ login: 'm@m.com', senha: 'senha123' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('medico');
    });

    it('200 paciente', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ id: 10, nome: 'P', senha_hash: senhaHash, ativo: true }],
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ login: 'p@p.com', senha: 'senha123' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('paciente');
    });

    it('401 errada', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ login: 'x', senha: 'y' });

      expect(res.status).toBe(401);
    });
  });
});