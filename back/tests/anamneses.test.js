const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const { gerarToken } = require('../src/middleware/auth');

jest.mock('../src/db');

const tokenAdmin = gerarToken({ id: 0, role: 'admin', usuario: 'admin' });
const tokenMedico1 = gerarToken({ id: 1, role: 'medico', nome: 'Dr1' });
const tokenMedico2 = gerarToken({ id: 2, role: 'medico', nome: 'Dr2' });
const tokenPaciente = gerarToken({ id: 10, role: 'paciente', nome: 'P' });

describe('Anamneses', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('401 when not authenticated', async () => {
    const res = await request(app).get('/api/anamneses');
    expect(res.status).toBe(401);
  });

  it('200 medico get all anamneses', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, conteudo: 'Test anamnese' }] });
    const res = await request(app).get('/api/anamneses').set('Authorization', `Bearer ${tokenMedico1}`);
    expect(res.status).toBe(200);
    expect(res.body[0].conteudo).toBe('Test anamnese');
  });

  it('201 post created anamnese', async () => {
    // 1st query: check patient exists and belongs to doctor
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
    // 2nd query: insert and return new anamnese
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, paciente_id: 10, medico_id: 1, conteudo: 'Queixa principal: tosse' }] });
    // 3rd query: log_alteracoes insert
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post('/api/anamneses')
      .set('Authorization', `Bearer ${tokenMedico1}`)
      .send({ paciente_id: 10, conteudo: 'Queixa principal: tosse' });

    expect(res.status).toBe(201);
    expect(res.body.conteudo).toBe('Queixa principal: tosse');
  });

  it('403 when posting to another doctor\'s patient', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 2 }] }); // Patient belongs to medico 2

    const res = await request(app)
      .post('/api/anamneses')
      .set('Authorization', `Bearer ${tokenMedico1}`) // medico 1 is requesting
      .send({ paciente_id: 10, conteudo: 'Tosse' });

    expect(res.status).toBe(403);
  });

  it('400 when posting empty content', async () => {
    const res = await request(app)
      .post('/api/anamneses')
      .set('Authorization', `Bearer ${tokenMedico1}`)
      .send({ paciente_id: 10, conteudo: '' });

    expect(res.status).toBe(400);
  });

  it('200 get specific anamnese', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, paciente_id: 10, medico_id: 1, conteudo: 'Tosse' }] });

    const res = await request(app)
      .get('/api/anamneses/5')
      .set('Authorization', `Bearer ${tokenMedico1}`);

    expect(res.status).toBe(200);
    expect(res.body.conteudo).toBe('Tosse');
  });

  it('403 when getting another doctor\'s anamnese', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, paciente_id: 10, medico_id: 2, conteudo: 'Tosse' }] });

    const res = await request(app)
      .get('/api/anamneses/5')
      .set('Authorization', `Bearer ${tokenMedico1}`); // medico 1 requests medico 2's anamnese

    expect(res.status).toBe(403);
  });

  it('200 put update anamnese', async () => {
    // 1st query: select existing anamnese
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, paciente_id: 10, medico_id: 1, conteudo: 'Antes' }] });
    // 2nd query: update anamnese
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, paciente_id: 10, medico_id: 1, conteudo: 'Depois' }] });
    // 3rd query: log_alteracoes insert
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .put('/api/anamneses/5')
      .set('Authorization', `Bearer ${tokenMedico1}`)
      .send({ conteudo: 'Depois' });

    expect(res.status).toBe(200);
    expect(res.body.conteudo).toBe('Depois');
  });

  it('200 delete anamnese when older than 20 years', async () => {
    // 1st query: select existing anamnese to verify ownership
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, paciente_id: 10, medico_id: 1, criado_em: new Date('2000-01-01') }] });
    // 2nd query: log_alteracoes insert for delete
    pool.query.mockResolvedValueOnce({ rows: [] });
    // 3rd query: delete anamnese
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .delete('/api/anamneses/5')
      .set('Authorization', `Bearer ${tokenMedico1}`);

    expect(res.status).toBe(200);
  });

  it('403 delete anamnese blocked when less than 20 years old', async () => {
    // 1st query: select existing anamnese to verify ownership
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, paciente_id: 10, medico_id: 1, criado_em: new Date() }] });

    const res = await request(app)
      .delete('/api/anamneses/5')
      .set('Authorization', `Bearer ${tokenMedico1}`);

    expect(res.status).toBe(403);
    expect(res.body.erro).toContain('20 anos');
  });

  it('200 patient history of anamneses', async () => {
    // 1st query: select patient to verify association
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
    // 2nd query: select history
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, conteudo: 'Tosse', medico_name: 'Dr1' }] });

    const res = await request(app)
      .get('/api/anamneses/paciente/10')
      .set('Authorization', `Bearer ${tokenMedico1}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].conteudo).toBe('Tosse');
  });
});
