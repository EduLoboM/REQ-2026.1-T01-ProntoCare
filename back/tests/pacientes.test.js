const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const { gerarToken } = require('../src/middleware/auth');

jest.mock('../src/db');

const tokenAdmin = gerarToken({ id: 0, role: 'admin', usuario: 'admin' });
const tokenMedico1 = gerarToken({ id: 1, role: 'medico', nome: 'Dr1' });
const tokenMedico2 = gerarToken({ id: 2, role: 'medico', nome: 'Dr2' });
const tokenPaciente = gerarToken({ id: 10, role: 'paciente', nome: 'P' });

describe('Pacientes', () => {
  it('401', async () => {
    const res = await request(app).get('/api/pacientes');
    expect(res.status).toBe(401);
  });

  it('200 medico get', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10 }] });
    const res = await request(app).get('/api/pacientes').set('Authorization', `Bearer ${tokenMedico1}`);
    expect(res.status).toBe(200);
  });

  it('403 medico outro', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
    const res = await request(app).get('/api/pacientes/10').set('Authorization', `Bearer ${tokenMedico2}`);
    expect(res.status).toBe(403);
  });

  it('201 post', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 12 }] });
    const res = await request(app).post('/api/pacientes').set('Authorization', `Bearer ${tokenMedico1}`).send({ nome: 'P', cpf: '1', email: 'e', senha: '1' });
    expect(res.status).toBe(201);
  });

  it('200 put', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] }).mockResolvedValueOnce({ rows: [{ id: 10 }] });
    const res = await request(app).put('/api/pacientes/10').set('Authorization', `Bearer ${tokenMedico1}`).send({ nome: 'P' });
    expect(res.status).toBe(200);
  });

  it('200 delete', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] }).mockResolvedValueOnce({ rows: [{ id: 10 }] });
    const res = await request(app).delete('/api/pacientes/10').set('Authorization', `Bearer ${tokenMedico1}`);
    expect(res.status).toBe(200);
  });

  it('200 paciente me', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10 }] });
    const res = await request(app).get('/api/pacientes/me').set('Authorization', `Bearer ${tokenPaciente}`);
    expect(res.status).toBe(200);
  });

  it('200 paciente exportar', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10 }] });
    const res = await request(app).get('/api/pacientes/me/exportar').set('Authorization', `Bearer ${tokenPaciente}`);
    expect(res.status).toBe(200);
  });

  it('200 paciente delete me', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10 }] });
    const res = await request(app).delete('/api/pacientes/me').set('Authorization', `Bearer ${tokenPaciente}`);
    expect(res.status).toBe(200);
  });

  it('200 medico/admin exportar', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10 }, { id: 11 }] });
    const res = await request(app).get('/api/pacientes/exportar').set('Authorization', `Bearer ${tokenMedico1}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
  });

  it('200 admin search filters', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, nome: 'P', cpf: '123' }] });
    const res = await request(app).get('/api/pacientes?nome=P&cpf=123').set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
  });

  it('200 delete permanent success when patient has no recent documents', async () => {
    // 1st query: check patient exists and belongs to doctor
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
    // 2nd query: check atendimentos (return empty)
    pool.query.mockResolvedValueOnce({ rows: [] });
    // 3rd query: check anamneses (return empty)
    pool.query.mockResolvedValueOnce({ rows: [] });
    // 4th query: delete patient
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).delete('/api/pacientes/10/permanente').set('Authorization', `Bearer ${tokenMedico1}`);
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toContain('excluídos permanentemente');
  });

  it('403 delete permanent blocked when patient has recent documents', async () => {
    // 1st query: check patient exists and belongs to doctor
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
    // 2nd query: check atendimentos (return a recent one)
    pool.query.mockResolvedValueOnce({ rows: [{ id: 100 }] });

    const res = await request(app).delete('/api/pacientes/10/permanente').set('Authorization', `Bearer ${tokenMedico1}`);
    expect(res.status).toBe(403);
    expect(res.body.erro).toContain('menos de 20 anos');
  });
});