const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const { gerarToken } = require('../src/middleware/auth');

jest.mock('../src/db');

const tokenAdmin = gerarToken({ id: 0, role: 'admin', usuario: 'admin' });
const tokenMedico1 = gerarToken({ id: 1, role: 'medico', nome: 'Dr1' });
const tokenMedico2 = gerarToken({ id: 2, role: 'medico', nome: 'Dr2' });
const tokenPaciente = gerarToken({ id: 10, role: 'paciente', nome: 'P' });

describe('Logs de Alterações', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('401 when not authenticated', async () => {
    const res = await request(app).get('/api/logs/paciente/10');
    expect(res.status).toBe(401);
  });

  it('200 medico gets logs for own patient', async () => {
    // 1st query: check patient exists and belongs to doctor
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
    // 2nd query: select logs
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 1, paciente_id: 10, entidade: 'paciente', acao: 'criacao' }] 
    });

    const res = await request(app)
      .get('/api/logs/paciente/10')
      .set('Authorization', `Bearer ${tokenMedico1}`);

    expect(res.status).toBe(200);
    expect(res.body[0].entidade).toBe('paciente');
  });

  it('403 medico requesting logs for another doctor\'s patient', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] });

    const res = await request(app)
      .get('/api/logs/paciente/10')
      .set('Authorization', `Bearer ${tokenMedico1}`); // Dr1 requesting Dr2's patient logs

    expect(res.status).toBe(403);
  });

  it('200 patient gets own logs', async () => {
    // Since role is patient and req.user.id is 10, fetching for pacienteId 10 is allowed.
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 1, paciente_id: 10, entidade: 'paciente', acao: 'criacao' }] 
    });

    const res = await request(app)
      .get('/api/logs/paciente/10')
      .set('Authorization', `Bearer ${tokenPaciente}`);

    expect(res.status).toBe(200);
  });

  it('403 patient requesting another patient\'s logs', async () => {
    const res = await request(app)
      .get('/api/logs/paciente/11') // patient 10 requesting logs for patient 11
      .set('Authorization', `Bearer ${tokenPaciente}`);

    expect(res.status).toBe(403);
  });

  it('200 admin gets any patient\'s logs', async () => {
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 1, paciente_id: 10, entidade: 'paciente', acao: 'criacao', ip: '127.0.0.1', user_agent: 'Mozilla/5.0' }] 
    });

    const res = await request(app)
      .get('/api/logs/paciente/10')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body[0].ip).toBe('127.0.0.1');
    expect(res.body[0].user_agent).toBe('Mozilla/5.0');
  });
});
