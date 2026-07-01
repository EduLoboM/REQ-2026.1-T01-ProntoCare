import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './Panel.css';

export default function MedicoPanel({ onLogout }) {
  const navigate = useNavigate();
  
  // Abas do Painel: 'pacientes', 'hoje', 'calendario'
  const [abaAtiva, setAbaAtiva] = useState('pacientes');

  // Estado dos Pacientes (Aba 1)
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState({ nome: '', cpf: '' });

  // Estado das Consultas (Abas 2 e 3)
  const [consultasHoje, setConsultasHoje] = useState([]);
  const [consultasSemana, setConsultasSemana] = useState([]);
  const [dataInicioSemana, setDataInicioSemana] = useState(() => {
    const hoje = new Date();
    const dia = hoje.getDay();
    const diff = hoje.getDate() - dia + (dia === 0 ? -6 : 1);
    const segunda = new Date(hoje.setDate(diff));
    segunda.setHours(0, 0, 0, 0);
    return segunda;
  });

  // Modal de Agendamento
  const [abrirModalAgendamento, setAbrirModalAgendamento] = useState(false);
  const [todosPacientes, setTodosPacientes] = useState([]);
  const [agendamento, setAgendamento] = useState({ paciente_id: '', data: '', hora: '' });

  useEffect(() => {
    if (abaAtiva === 'pacientes') {
      carregarPacientes();
    } else if (abaAtiva === 'hoje') {
      carregarConsultasHoje();
    } else if (abaAtiva === 'calendario') {
      carregarConsultasSemana();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abaAtiva, dataInicioSemana, busca]);

  async function carregarPacientes() {
    try {
      const params = new URLSearchParams();
      if (busca.nome) params.append('nome', busca.nome);
      if (busca.cpf) params.append('cpf', busca.cpf);
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await api.get(`/pacientes${query}`);
      setPacientes(data);
    } catch (e) { alert(e.message); }
  }

  async function carregarConsultasHoje() {
    try {
      const hojeStr = new Date().toISOString().split('T')[0];
      const data = await api.get(`/consultas?data_inicio=${hojeStr}T00:00:00.000Z&data_fim=${hojeStr}T23:59:59.999Z`);
      setConsultasHoje(data);
    } catch (e) { alert('Erro ao carregar consultas de hoje: ' + e.message); }
  }

  async function carregarConsultasSemana() {
    try {
      const inicio = new Date(dataInicioSemana);
      const fim = new Date(dataInicioSemana);
      fim.setDate(fim.getDate() + 7);
      const data = await api.get(`/consultas?data_inicio=${inicio.toISOString()}&data_fim=${fim.toISOString()}`);
      setConsultasSemana(data);
    } catch (e) { alert('Erro ao carregar consultas da semana: ' + e.message); }
  }

  async function carregarTodosPacientesAtivos() {
    try {
      const data = await api.get('/pacientes');
      setTodosPacientes(data.filter(p => p.ativo));
    } catch (e) { alert('Erro ao carregar pacientes ativos: ' + e.message); }
  }

  function abrirAgendador() {
    carregarTodosPacientesAtivos();
    setAbrirModalAgendamento(true);
  }

  async function salvarAgendamento(e) {
    e.preventDefault();
    if (!agendamento.paciente_id || !agendamento.data || !agendamento.hora) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const dataHoraStr = `${agendamento.data}T${agendamento.hora}:00`;
      const dataHora = new Date(dataHoraStr).toISOString();
      await api.post('/consultas', {
        paciente_id: parseInt(agendamento.paciente_id),
        data_hora: dataHora
      });
      alert('Consulta agendada com sucesso!');
      setAbrirModalAgendamento(false);
      setAgendamento({ paciente_id: '', data: '', hora: '' });
      if (abaAtiva === 'calendario') carregarConsultasSemana();
      if (abaAtiva === 'hoje') carregarConsultasHoje();
    } catch (err) { alert(err.message || 'Erro ao agendar consulta.'); }
  }

  async function mudarStatus(consultaId, novoStatus) {
    try {
      await api.put(`/consultas/${consultaId}`, { status: novoStatus });
      await carregarConsultasHoje();
      if (novoStatus === 'Em atendimento') {
        const consulta = consultasHoje.find(c => c.id === consultaId) || consultasSemana.find(c => c.id === consultaId);
        if (consulta && window.confirm(`Deseja abrir a tela de atendimento para o(a) paciente ${consulta.paciente_nome} agora?`)) {
          navigate(`/atendimento/${consulta.paciente_id}`);
        }
      }
    } catch (err) { alert(err.message || 'Erro ao atualizar status.'); }
  }

  function semanaAnterior() {
    setDataInicioSemana(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }

  function proximaSemana() {
    setDataInicioSemana(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }

  async function desativar(id) {
    try { await api.delete(`/pacientes/${id}`); carregarPacientes(); } catch (e) { alert(e.message); }
  }

  async function reativar(id) {
    try { await api.put(`/pacientes/${id}`, { ativo: true }); carregarPacientes(); } catch (e) { alert(e.message); }
  }

  async function excluirPermanente(id) {
    const confirmar = window.confirm(
      'ATENÇÃO: Deseja realmente excluir este paciente permanentemente?\n\nEsta ação apagará o paciente e todo o seu histórico clínico (atendimentos, anamneses e logs), desde que todos os registros tenham mais de 20 anos de armazenamento. Esta ação não pode ser desfeita.'
    );
    if (!confirmar) return;
    try {
      await api.delete(`/pacientes/${id}/permanente`);
      carregarPacientes();
      alert('Paciente e seus registros associados foram excluídos permanentemente.');
    } catch (e) { alert(e.response?.data?.erro || e.message); }
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

  // === Helpers de formatação ===

  const getDiasSemana = () => {
    const dias = [];
    const nomesDias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(dataInicioSemana);
      d.setDate(d.getDate() + i);
      dias.push({
        nome: nomesDias[i],
        data: d,
        dataStr: d.toISOString().split('T')[0],
        diaMesStr: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      });
    }
    return dias;
  };

  function formatarHora(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function mapStatusClass(status) {
    if (status === 'Em atendimento') return 'status-em_atendimento';
    if (status === 'Finalizado') return 'status-finalizado';
    return 'status-agendado';
  }

  function mapAccentClass(status) {
    if (status === 'Em atendimento') return 'accent-em_atendimento';
    if (status === 'Finalizado') return 'accent-finalizado';
    return 'accent-agendado';
  }

  function mapCalStatusClass(status) {
    if (status === 'Em atendimento') return 'cal-status-em_atendimento';
    if (status === 'Finalizado') return 'cal-status-finalizado';
    return '';
  }

  const getPeriodoSemana = () => {
    const inicio = new Date(dataInicioSemana);
    const fim = new Date(dataInicioSemana);
    fim.setDate(fim.getDate() + 6);
    return `${inicio.toLocaleDateString('pt-BR')} a ${fim.toLocaleDateString('pt-BR')}`;
  };

  const hojeFormatado = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  // Estatísticas do dia
  const totalHoje = consultasHoje.length;
  const emAtendimentoHoje = consultasHoje.filter(c => c.status === 'Em atendimento').length;
  const finalizadosHoje = consultasHoje.filter(c => c.status === 'Finalizado').length;

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

        {/* Abas de Navegação — com ícones e contadores */}
        <div className="panel-tabs">
          <button 
            className={`panel-tab ${abaAtiva === 'pacientes' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('pacientes')}
          >
            <span className="tab-icon material-icons-outlined">groups</span>
            Pacientes
            <span className="tab-count">{pacientes.length}</span>
          </button>
          <button 
            className={`panel-tab ${abaAtiva === 'hoje' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('hoje')}
          >
            <span className="tab-icon material-icons-outlined">today</span>
            Hoje
            {totalHoje > 0 && <span className="tab-count">{totalHoje}</span>}
          </button>
          <button 
            className={`panel-tab ${abaAtiva === 'calendario' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('calendario')}
          >
            <span className="tab-icon material-icons-outlined">calendar_month</span>
            Agenda Semanal
          </button>
        </div>

        {/* ================= ABA 1: PACIENTES ================= */}
        {abaAtiva === 'pacientes' && (
          <>
            <div className="panel-form">
              <h3><span className="material-icons-outlined" style={{ verticalAlign: 'middle', marginRight: '0.4rem', fontSize: '1.3rem' }}>search</span>Buscar Pacientes</h3>
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
              {pacientes.length === 0 ? (
                <div className="panel-vazio">
                  <span className="vazio-icon material-icons-outlined">person_off</span>
                  <span className="vazio-text">Nenhum paciente cadastrado ou correspondente à busca.</span>
                </div>
              ) : (
                <ul className="panel-list">
                  {pacientes.map(p => (
                    <li key={p.id}>
                      <div className="list-info">
                        <span className="list-title">{p.nome}</span>
                        <span className="list-subtitle">
                          CPF: {p.cpf} • Status: {p.ativo 
                            ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Ativo</span> 
                            : <span style={{ color: 'var(--danger)', fontWeight: 600 }}>● Inativo</span>}
                        </span>
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
              )}
            </div>
          </>
        )}

        {/* ================= ABA 2: CONSULTAS DE HOJE ================= */}
        {abaAtiva === 'hoje' && (
          <div className="panel-form">
            <div className="today-header">
              <h3>
                <span className="material-icons-outlined" style={{ fontSize: '1.3rem' }}>assignment</span>
                Consultas do Dia
                <span className="today-date-label">— {hojeFormatado}</span>
              </h3>
              <button className="btn-primario" style={{ width: 'auto' }} onClick={abrirAgendador}>+ Agendar Consulta</button>
            </div>

            {/* Stats cards */}
            <div className="today-stats">
              <div className="today-stat-card">
                <div className="today-stat-value">{totalHoje}</div>
                <div className="today-stat-label">Agendadas</div>
              </div>
              <div className="today-stat-card stat-warning">
                <div className="today-stat-value">{emAtendimentoHoje}</div>
                <div className="today-stat-label">Em atendimento</div>
              </div>
              <div className="today-stat-card stat-success">
                <div className="today-stat-value">{finalizadosHoje}</div>
                <div className="today-stat-label">Finalizadas</div>
              </div>
            </div>

            {consultasHoje.length === 0 ? (
              <div className="panel-vazio">
                <span className="vazio-icon material-icons-outlined">event_available</span>
                <span className="vazio-text">Nenhuma consulta agendada para hoje. Clique em "+ Agendar Consulta" para começar.</span>
              </div>
            ) : (
              <div className="today-grid">
                {consultasHoje.map(c => (
                  <div key={c.id} className="appointment-card">
                    {/* Barra lateral de cor por status */}
                    <div className={`appointment-accent ${mapAccentClass(c.status)}`} />

                    <div className="appointment-body">
                      <div className="appointment-info">
                        <span className="appointment-time">
                          <span className="time-icon material-icons-outlined" style={{ fontSize: '1rem' }}>schedule</span>
                          {formatarHora(c.data_hora)}
                        </span>
                        <span className="appointment-patient">{c.paciente_nome}</span>
                        <span className="appointment-details">CPF: {c.paciente_cpf}</span>
                      </div>

                      <div className="appointment-right">
                        <span className={`status-badge ${mapStatusClass(c.status)}`}>{c.status}</span>

                        <div className="appointment-actions">
                          <select 
                            value={c.status}
                            onChange={(e) => mudarStatus(c.id, e.target.value)}
                          >
                            <option value="Agendado">Agendado</option>
                            <option value="Em atendimento">Em atendimento</option>
                            <option value="Finalizado">Finalizado</option>
                          </select>
                          <button className="btn-secundario" style={{ width: 'auto' }} onClick={() => navigate(`/paciente-detalhe/${c.paciente_id}`)}>Prontuário</button>
                          {c.status === 'Em atendimento' && (
                            <button className="btn-success" style={{ width: 'auto' }} onClick={() => navigate(`/atendimento/${c.paciente_id}`)}>Atender</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 3: AGENDA SEMANAL ================= */}
        {abaAtiva === 'calendario' && (
          <div className="panel-form">
            <div className="calendar-controls">
              <div className="calendar-nav">
                <button className="btn-secundario" onClick={semanaAnterior}><span className="material-icons-outlined" style={{ fontSize: '1.1rem' }}>chevron_left</span></button>
                <h4><span className="material-icons-outlined" style={{ verticalAlign: 'middle', marginRight: '0.4rem', fontSize: '1.2rem' }}>date_range</span>{getPeriodoSemana()}</h4>
                <button className="btn-secundario" onClick={proximaSemana}><span className="material-icons-outlined" style={{ fontSize: '1.1rem' }}>chevron_right</span></button>
              </div>
              <button className="btn-primario" style={{ width: 'auto' }} onClick={abrirAgendador}>+ Agendar Consulta</button>
            </div>

            <div className="calendar-grid">
              {getDiasSemana().map(d => {
                const consultasDoDia = consultasSemana.filter(c => {
                  return c.data_hora.split('T')[0] === d.dataStr;
                });
                const eHoje = new Date().toISOString().split('T')[0] === d.dataStr;

                return (
                  <div key={d.dataStr} className={`calendar-day-col ${eHoje ? 'is-today' : ''}`}>
                    <div className="calendar-day-header">
                      <div className="calendar-day-name">{d.nome}</div>
                      <div className="calendar-day-num">
                        {d.diaMesStr}
                        {consultasDoDia.length > 0 && (
                          <span className="calendar-day-count">{consultasDoDia.length}</span>
                        )}
                      </div>
                    </div>

                    <div className="calendar-appointments-list">
                      {consultasDoDia.length === 0 ? (
                        <div className="calendar-empty-day">
                          <span className="empty-icon material-icons-outlined">event_busy</span>
                          Livre
                        </div>
                      ) : (
                        consultasDoDia.map(c => (
                          <div 
                            key={c.id} 
                            className={`calendar-appointment-item ${mapCalStatusClass(c.status)}`}
                            onClick={() => navigate(`/paciente-detalhe/${c.paciente_id}`)}
                            title={`Consultar prontuário de ${c.paciente_nome}`}
                          >
                            <span className="calendar-appointment-time">{formatarHora(c.data_hora)}</span>
                            <div className="calendar-appointment-patient">{c.paciente_nome}</div>
                            <div className={`calendar-appointment-status ${c.status === 'Em atendimento' ? 'em_atendimento' : c.status === 'Finalizado' ? 'finalizado' : 'agendado'}`}>
                              {c.status}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL DE AGENDAMENTO ===== */}
      {abrirModalAgendamento && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h3><span className="material-icons-outlined" style={{ verticalAlign: 'middle', marginRight: '0.4rem', fontSize: '1.3rem' }}>event</span>Agendar Nova Consulta</h3>
              <button className="btn-danger" style={{ width: 'auto', padding: '0 0.75rem' }} onClick={() => setAbrirModalAgendamento(false)}><span className="material-icons-outlined" style={{ fontSize: '1.1rem' }}>close</span></button>
            </header>
            <form onSubmit={salvarAgendamento}>
              <div className="modal-body">
                <div className="input-group">
                  <label>Paciente</label>
                  <select 
                    value={agendamento.paciente_id} 
                    onChange={e => setAgendamento({ ...agendamento, paciente_id: e.target.value })}
                    required
                  >
                    <option value="">Selecione um paciente...</option>
                    {todosPacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} (CPF: {p.cpf})</option>
                    ))}
                  </select>
                </div>
                <div className="row-2">
                  <div className="input-group">
                    <label>Data</label>
                    <input 
                      type="date" 
                      value={agendamento.data} 
                      onChange={e => setAgendamento({ ...agendamento, data: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Horário</label>
                    <input 
                      type="time" 
                      value={agendamento.hora} 
                      onChange={e => setAgendamento({ ...agendamento, hora: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <footer className="modal-footer">
                <button type="button" className="btn-secundario" onClick={() => setAbrirModalAgendamento(false)}>Cancelar</button>
                <button type="submit" className="btn-primario">Confirmar Agendamento</button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}