import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './Panel.css';

export default function MedicoPanel({ onLogout }) {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState({ nome: '', cpf: '' });

  useEffect(() => { carregar(); }, [busca]);

  async function carregar() {
    try {
      const params = new URLSearchParams();
      if (busca.nome) params.append('nome', busca.nome);
      if (busca.cpf) params.append('cpf', busca.cpf);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await api.get(`/pacientes${query}`);
      setPacientes(data);
    } catch (e) { alert(e.message); }
  }

  async function desativar(id) {
    try {
      await api.delete(`/pacientes/${id}`);
      carregar();
    } catch (e) { alert(e.message); }
  }

  async function reativar(id) {
    try {
      await api.put(`/pacientes/${id}`, { ativo: true });
      carregar();
    } catch (e) { alert(e.message); }
  }

  async function excluirPermanente(id) {
    const confirmar = window.confirm(
      'ATENÇÃO: Deseja realmente excluir este paciente permanentemente?\n\nEsta ação apagará o paciente e todo o seu histórico clínico (atendimentos, anamneses e logs), desde que todos os registros tenham mais de 20 anos de armazenamento. Esta ação não pode ser desfeita.'
    );
    if (!confirmar) return;

    try {
      await api.delete(`/pacientes/${id}/permanente`);
      carregar();
      alert('Paciente e seus registros associados foram excluídos permanentemente.');
    } catch (e) {
      alert(e.response?.data?.erro || e.message);
    }
  }

  async function exportarDados() {
    try {
      const data = await api.get('/pacientes/exportar');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pacientes_exportacao.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert(e.message); }
  }

  function exportarPaciente(paciente) {
    const blob = new Blob([JSON.stringify(paciente, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paciente_${paciente.id}_${paciente.nome}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="panel-container">
      <div className="panel-card">
        <header className="panel-header">
          <h2>Painel do Médico</h2>
          <div className="panel-actions">
            <button className="btn-primario" onClick={() => navigate('/register')}>+ Novo Paciente</button>
            <button className="btn-secundario" onClick={exportarDados}>Exportar Todos</button>
            <button className="btn-danger" onClick={onLogout}>Sair</button>
          </div>
        </header>

        <div className="panel-form">
          <h3>Buscar Pacientes</h3>
          <div className="row-2">
            <div className="input-group">
              <label>Buscar por Nome</label>
              <input 
                placeholder="Ex: João da Silva" 
                value={busca.nome} 
                onChange={e => setBusca({ ...busca, nome: e.target.value })} 
              />
            </div>
            <div className="input-group">
              <label>Buscar por CPF</label>
              <input 
                placeholder="Ex: 000.000.000-00" 
                value={busca.cpf} 
                onChange={e => setBusca({ ...busca, cpf: e.target.value })} 
              />
            </div>
          </div>
        </div>

        <div className="panel-form">
          <h3>Meus Pacientes</h3>
          <ul className="panel-list">
            {pacientes.map(p => (
              <li key={p.id}>
                <div className="list-info">
                  <span className="list-title">{p.nome}</span>
                  <span className="list-subtitle">CPF: {p.cpf} • Status: {p.ativo ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="list-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="btn-primario" onClick={() => navigate(`/paciente-detalhe/${p.id}`)}>Ver</button>
                  <button className="btn-secundario" onClick={() => navigate(`/edit-paciente/${p.id}`)}>Editar</button>
                  <button className="btn-secundario" onClick={() => exportarPaciente(p)}>Exportar</button>
                  {p.ativo 
                    ? <button className="btn-danger" onClick={() => desativar(p.id)}>Desativar</button>
                    : <button className="btn-success" onClick={() => reativar(p.id)}>Reativar</button>
                  }
                  {p.pode_excluir && (
                    <button 
                      className="btn-danger" 
                      onClick={() => excluirPermanente(p.id)}
                      title="Excluir paciente permanentemente (se todos os seus documentos tiverem > 20 anos)"
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