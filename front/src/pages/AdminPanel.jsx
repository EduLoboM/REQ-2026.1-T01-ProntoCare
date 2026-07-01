import { useState, useEffect } from 'react';
import { api } from '../api';
import './Panel.css';

export default function AdminPanel({ onLogout }) {
  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState({ nome:'', crm:'', especialidade:'', email:'', senha:'' });
  const [editando, setEditando] = useState(null);
  const [editForm, setEditForm] = useState({ nome:'', crm:'', email:'', senha:'' });
  const [detalhesMedico, setDetalhesMedico] = useState(null);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      const data = await api.get('/medicos');
      setMedicos(data);
    } catch (e) { alert(e.message); }
  }

  async function verMedico(medicoId) {
    setEditando(null);
    try {
      const data = await api.get(`/medicos/${medicoId}/detalhes`);
      setDetalhesMedico(data);
    } catch (e) {
      alert('Erro ao carregar detalhes do médico: ' + e.message);
    }
  }

  function exportarMedico(m) {
    const blob = new Blob([JSON.stringify(m, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medico_${m.id}_${m.crm}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportarTodosMedicos() {
    const blob = new Blob([JSON.stringify(medicos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicos_exportacao.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function salvar(e) {
    e.preventDefault();
    try {
      await api.post('/medicos', form);
      setForm({ nome:'', crm:'', especialidade:'', email:'', senha:'' });
      carregar();
      alert('Médico cadastrado com sucesso!');
    } catch (e) { alert(e.message); }
  }

  function iniciarEdicao(m) {
    setDetalhesMedico(null);
    setEditando(m);
    setEditForm({ nome: m.nome, crm: m.crm, email: m.email, senha: '' });
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    try {
      const payload = { ...editForm };
      if (!payload.senha) {
        delete payload.senha;
      }
      await api.put(`/medicos/${editando.id}`, payload);
      setEditando(null);
      carregar();
      alert('Médico atualizado com sucesso!');
    } catch (e) { alert(e.message); }
  }

  async function desativar(id) {
    try {
      await api.delete(`/medicos/${id}`);
      carregar();
    } catch (e) { alert(e.message); }
  }

  async function reativar(id) {
    try {
      await api.put(`/medicos/${id}`, { ativo: true });
      carregar();
    } catch (e) { alert(e.message); }
  }

  async function excluirPermanente(id) {
    const confirmar = window.confirm(
      'ATENÇÃO: Deseja realmente excluir este médico permanentemente?\n\nEsta ação apagará o médico e todos os seus pacientes associados (desde que todos os registros clínicos tenham mais de 20 anos e não haja impedimento legal). Esta ação não pode ser desfeita.'
    );
    if (!confirmar) return;

    try {
      await api.delete(`/medicos/${id}/permanente`);
      carregar();
      alert('Médico e seus registros associados foram excluídos permanentemente.');
    } catch (e) {
      alert(e.response?.data?.erro || e.message);
    }
  }

  return (
    <div className="panel-container">
      <div className="panel-card">
        <header className="panel-header">
          <h2>Painel do Administrador</h2>
          <div className="panel-actions">
            <button className="btn-secundario" onClick={exportarTodosMedicos}>Exportar Todos</button>
            <button className="btn-danger" onClick={onLogout}>Sair</button>
          </div>
        </header>

        <div className="panel-form">
          <h3>Novo Médico</h3>
          <form onSubmit={salvar}>
            <div className="row-2">
              <div className="input-group">
                <label>Nome Completo</label>
                <input placeholder="Ex: Dr. João Silva" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>CRM</label>
                <input placeholder="Ex: 123456-SP" value={form.crm} onChange={e => setForm({...form, crm: e.target.value})} required />
              </div>
            </div>
            <div className="row-2">
              <div className="input-group">
                <label>E-mail</label>
                <input placeholder="Ex: medico@prontocare.com" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Senha Provisória</label>
                <input placeholder="Senha" type="password" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn-primario" style={{ marginTop: '1rem', width: 'auto' }}>Cadastrar Médico</button>
          </form>
        </div>

        {editando && (
          <div className="panel-form">
            <h3>Editar Médico: {editando.nome}</h3>
            <form onSubmit={salvarEdicao}>
              <div className="row-2">
                <div className="input-group">
                  <label>Nome Completo</label>
                  <input placeholder="Ex: Dr. João Silva" value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>CRM</label>
                  <input placeholder="Ex: 123456-SP" value={editForm.crm} onChange={e => setEditForm({...editForm, crm: e.target.value})} required />
                </div>
              </div>
              <div className="row-2">
                <div className="input-group">
                  <label>E-mail</label>
                  <input placeholder="Ex: medico@prontocare.com" type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Nova Senha (Opcional)</label>
                  <input placeholder="Em branco para não alterar" type="password" value={editForm.senha} onChange={e => setEditForm({...editForm, senha: e.target.value})} autoComplete="new-password" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', alignItems: 'center' }}>
                <button type="submit" className="btn-primario" style={{ width: 'auto' }}>Salvar Alterações</button>
                <button type="button" className="btn-secundario" onClick={() => setEditando(null)} style={{ width: 'auto' }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {detalhesMedico && (
          <div className="panel-form">
            <h3>Visualizar Médico: {detalhesMedico.medico.nome}</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>Nome:</strong> {detalhesMedico.medico.nome}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>CRM:</strong> {detalhesMedico.medico.crm}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>E-mail:</strong> {detalhesMedico.medico.email}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>Status:</strong> {detalhesMedico.medico.ativo ? 'Ativo' : 'Inativo'}</p>
            </div>


            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-heading)' }}>Lista de Pacientes ({detalhesMedico.pacientes.length})</h4>
            {detalhesMedico.pacientes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Nenhum paciente vinculado a este médico.</p>
            ) : (
              <ul className="modal-patients-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                {detalhesMedico.pacientes.map(p => (
                  <li key={p.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="modal-patient-name" style={{ fontWeight: '600', color: 'var(--text-main)' }}>{p.nome}</span>
                      <div className="modal-patient-cpf" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CPF: {p.cpf}</div>
                    </div>
                    <span className={`pd-status ${p.ativo ? 'ativo' : 'inativo'}`} style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', alignItems: 'center' }}>
              <button type="button" className="btn-secundario" onClick={() => setDetalhesMedico(null)} style={{ width: 'auto' }}>Fechar Visualização</button>
            </div>
          </div>
        )}

        <div className="panel-form">
          <h3>Médicos Cadastrados</h3>
          <ul className="panel-list">
            {medicos.map(m => (
              <li key={m.id}>
                <div className="list-info">
                  <span className="list-title">{m.nome} (CRM: {m.crm})</span>
                  <span className="list-subtitle">{m.email} • Status: {m.ativo ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="list-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="btn-primario" onClick={() => verMedico(m.id)}>Ver</button>
                  <button className="btn-secundario" onClick={() => iniciarEdicao(m)}>Editar</button>
                  <button className="btn-secundario" onClick={() => exportarMedico(m)}>Exportar</button>
                  {m.ativo 
                    ? <button className="btn-danger" onClick={() => desativar(m.id)}>Desativar</button>
                    : <button className="btn-success" onClick={() => reativar(m.id)}>Reativar</button>
                  }
                  {m.pode_excluir && (
                    <button 
                      className="btn-danger" 
                      onClick={() => excluirPermanente(m.id)}
                      title="Excluir médico permanentemente (se todos os documentos dos seus pacientes tiverem > 20 anos)"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>


    </div>
  );
}