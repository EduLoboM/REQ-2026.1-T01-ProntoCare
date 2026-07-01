const request = require('supertest');
const app = require('../app');
const pool = require('../src/db');
const { gerarToken } = require('../src/middleware/auth');

jest.mock('../src/db');

const tokenAdmin = gerarToken({ id: 0, role: 'admin', usuario: 'admin' });
const tokenMedico1 = gerarToken({ id: 1, role: 'medico', nome: 'Dr1' });
const tokenMedico2 = gerarToken({ id: 2, role: 'medico', nome: 'Dr2' });
const tokenPaciente = gerarToken({ id: 10, role: 'paciente', nome: 'P' });

describe('Atendimentos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('401 when not authenticated', async () => {
    const res = await request(app).get('/api/atendimentos');
    expect(res.status).toBe(401);
  });

  it('200 medico lists own atendimentos', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 100, subjetivo: 'Tosse' }] });
    const res = await request(app).get('/api/atendimentos').set('Authorization', `Bearer ${tokenMedico1}`);
    expect(res.status).toBe(200);
    expect(res.body[0].subjetivo).toBe('Tosse');
  });

  it('201 post creates atendimento and calculates IMC', async () => {
    // 1st query: check patient exists and belongs to doctor
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
    // 2nd query: insert and return new atendimento
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 100, paciente_id: 10, medico_id: 1, peso: 80, altura: 2.0, imc: 20 }] 
    });
    // 3rd query: log_alteracoes insert
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post('/api/atendimentos')
      .set('Authorization', `Bearer ${tokenMedico1}`)
      .send({
        paciente_id: 10,
        peso: 80,
        altura: 2.0,
        subjetivo: 'Paciente com febre e tosse.'
      });

    expect(res.status).toBe(201);
    expect(res.body.imc).toBe(20);
  });

  it('400 post when all clinical fields are blank', async () => {
    const res = await request(app)
      .post('/api/atendimentos')
      .set('Authorization', `Bearer ${tokenMedico1}`)
      .send({
        paciente_id: 10,
        peso: 80,
        altura: 2.0
      });

    expect(res.status).toBe(400);
  });

  it('200 get specific atendimento by id', async () => {
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 100, paciente_id: 10, medico_id: 1, subjetivo: 'Tosse' }] 
    });

    const res = await request(app)
      .get('/api/atendimentos/100')
      .set('Authorization', `Bearer ${tokenMedico1}`);

    expect(res.status).toBe(200);
    expect(res.body.subjetivo).toBe('Tosse');
  });

  it('403 get another doctor\'s atendimento', async () => {
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 100, paciente_id: 10, medico_id: 2, subjetivo: 'Tosse' }] 
    });

    const res = await request(app)
      .get('/api/atendimentos/100')
      .set('Authorization', `Bearer ${tokenMedico1}`); // Dr1 requesting Dr2's record

    expect(res.status).toBe(403);
  });

  it('200 put updates and logs changes', async () => {
    // 1st query: select snapshot before update
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 100, paciente_id: 10, medico_id: 1, subjetivo: 'Febre' }] 
    });
    // 2nd query: update
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 100, paciente_id: 10, medico_id: 1, subjetivo: 'Febre e Tosse' }] 
    });
    // 3rd query: log_alteracoes insert
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .put('/api/atendimentos/100')
      .set('Authorization', `Bearer ${tokenMedico1}`)
      .send({ subjetivo: 'Febre e Tosse' });

    expect(res.status).toBe(200);
    expect(res.body.subjetivo).toBe('Febre e Tosse');
  });

  it('200 delete deletes and logs exclusion when older than 20 years', async () => {
    // 1st query: select snapshot to verify
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 100, paciente_id: 10, medico_id: 1, criado_em: new Date('2000-01-01') }] 
    });
    // 2nd query: log_alteracoes insert
    pool.query.mockResolvedValueOnce({ rows: [] });
    // 3rd query: delete
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .delete('/api/atendimentos/100')
      .set('Authorization', `Bearer ${tokenMedico1}`);

    expect(res.status).toBe(200);
  });

  it('403 delete blocked when less than 20 years old', async () => {
    // 1st query: select snapshot to verify
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 100, paciente_id: 10, medico_id: 1, criado_em: new Date() }] 
    });

    const res = await request(app)
      .delete('/api/atendimentos/100')
      .set('Authorization', `Bearer ${tokenMedico1}`);

    expect(res.status).toBe(403);
    expect(res.body.erro).toContain('20 anos');
  });

  it('200 get patient history of atendimentos', async () => {
    // 1st query: check patient belongs to doctor
    pool.query.mockResolvedValueOnce({ rows: [{ id: 10, medico_id: 1 }] });
    // 2nd query: select history
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 100, subjetivo: 'Tosse', medico_nome: 'Dr1' }] 
    });

    const res = await request(app)
      .get('/api/atendimentos/paciente/10')
      .set('Authorization', `Bearer ${tokenMedico1}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].subjetivo).toBe('Tosse');
  });
});
