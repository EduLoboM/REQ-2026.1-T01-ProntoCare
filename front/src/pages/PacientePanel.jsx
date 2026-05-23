import { useState, useEffect } from 'react';
import { api } from '../api';
import './PacienteDetalhe/styles.css';

export default function PacientePanel({ onLogout }) {
  const [paciente, setPaciente] = useState(null);
  const [atendimentos, setAtendimentos] = useState([]);
  const [logs, setLogs] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [excluido, setExcluido] = useState(false);
  const [expandido, setExpandido] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('prontuarios');

  useEffect(() => {
    async function carregar() {
      try {
        const dadosPaciente = await api.get('/pacientes/me');
        setPaciente(dadosPaciente);
        
        const [historico, logsData] = await Promise.all([
          api.get(`/atendimentos/paciente/${dadosPaciente.id}`),
          api.get(`/logs/paciente/${dadosPaciente.id}`)
        ]);
        
        setAtendimentos(historico);
        setLogs(logsData);
      } catch (e) {
        alert(e.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  async function exportar() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/pacientes/me/exportar', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao exportar');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meus_dados.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message);
    }
  }

  async function solicitarExclusao() {
    if (!window.confirm('Tem certeza de que deseja solicitar a desativação da sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }
    try {
      await api.delete('/pacientes/me');
      setExcluido(true);
    } catch (e) {
      alert(e.message);
    }
  }

  function calcularIdade(dataNasc) {
    if (!dataNasc) return '';
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return idade;
  }

  function formatarData(dataStr) {
    if (!dataStr) return '—';
    const partes = dataStr.split('T')[0].split('-');
    if (partes.length !== 3) return dataStr;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function formatarDataHora(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
      + ' às ' 
      + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function mapSexo(s) {
    if (s === 'M') return 'Masculino';
    if (s === 'F') return 'Feminino';
    if (s === 'O') return 'Outro';
    return '—';
  }

  function gerarResumo(at) {
    const partes = [];
    if (at.avaliacao) partes.push(at.avaliacao.substring(0, 80));
    else if (at.subjetivo) partes.push(at.subjetivo.substring(0, 80));
    else if (at.plano) partes.push(at.plano.substring(0, 80));
    if (partes.length === 0) return 'Registro sem conteúdo clínico detalhado.';
    let resumo = partes.join(' ');
    if (resumo.length >= 80) resumo += '...';
    return resumo;
  }

  function mapAcao(acao) {
    const map = {
      criacao: { icon: '🟢', label: 'Criação', cor: 'log-criacao' },
      edicao: { icon: '🟡', label: 'Edição', cor: 'log-edicao' },
      exclusao: { icon: '🔴', label: 'Exclusão', cor: 'log-exclusao' },
      desativacao: { icon: '⚫', label: 'Desativação', cor: 'log-desativacao' },
      reativacao: { icon: '🟢', label: 'Reativação', cor: 'log-criacao' },
    };
    return map[acao] || { icon: '⚪', label: acao, cor: '' };
  }

  function mapEntidade(ent) {
    return ent === 'paciente' ? 'Cadastro' : 'Prontuário';
  }

  function truncar(val, max = 60) {
    if (!val) return '(vazio)';
    if (val === '***') return '***';
    return val.length > max ? val.substring(0, max) + '...' : val;
  }

  function agruparLogs(logsList) {
    const grupos = [];
    let grupoAtual = null;

    for (const log of logsList) {
      const chave = `${log.criado_em}-${log.acao}-${log.entidade}-${log.entidade_id}-${log.usuario_id}`;
      
      if (grupoAtual && grupoAtual.chave === chave) {
        grupoAtual.itens.push(log);
      } else {
        grupoAtual = { chave, itens: [log], principal: log };
        grupos.push(grupoAtual);
      }
    }

    return grupos;
  }

  if (carregando) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner"></div>
        <p>Carregando prontuário...</p>
      </div>
    );
  }

  if (excluido) {
    return (
      <div className="pd-loading" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Conta desativada</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Sua conta foi desativada com sucesso e você não tem mais acesso ao sistema.
        </p>
        <button className="pd-btn-secundario" onClick={onLogout}>Sair</button>
      </div>
    );
  }

  if (!paciente) return null;

  const ultimoImc = atendimentos.find(a => a.imc)?.imc;
  const gruposLog = agruparLogs(logs);

  return (
    <div className="pd-container">
      {/* Cabeçalho */}
      <header className="pd-header">
        <div className="pd-header-left">
          <div className="pd-header-info">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Painel do Paciente
            </span>
            <h1 style={{ marginTop: '0.2rem' }}>{paciente.nome}</h1>
            <div className="pd-header-tags">
              <span className="pd-tag">{calcularIdade(paciente.data_nascimento)} anos</span>
              <span className="pd-tag">{mapSexo(paciente.sexo)}</span>
              <span className="pd-tag">CPF: {paciente.cpf}</span>
              {ultimoImc && <span className="pd-tag pd-tag-imc">IMC: {ultimoImc}</span>}
            </div>
          </div>
        </div>
        <div className="pd-header-actions">
          <button className="pd-btn-secundario" onClick={exportar}>
            Exportar Dados
          </button>
          <button className="pd-btn-primario pd-btn-danger" onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="pd-content">
        {/* Coluna Esquerda: Dados Cadastrais */}
        <aside className="pd-sidebar-dados">
          <div className="pd-card">
            <h3 className="pd-card-title">
              Meus Dados
            </h3>
            <div className="pd-dados-lista">
              <div className="pd-dado">
                <span className="pd-dado-label">Nome Completo</span>
                <span className="pd-dado-valor">{paciente.nome}</span>
              </div>
              <div className="pd-dado">
                <span className="pd-dado-label">CPF</span>
                <span className="pd-dado-valor">{paciente.cpf}</span>
              </div>
              <div className="pd-dado">
                <span className="pd-dado-label">Data de Nascimento</span>
                <span className="pd-dado-valor">{formatarData(paciente.data_nascimento)}</span>
              </div>
              <div className="pd-dado">
                <span className="pd-dado-label">Sexo</span>
                <span className="pd-dado-valor">{mapSexo(paciente.sexo)}</span>
              </div>
              <div className="pd-dado">
                <span className="pd-dado-label">Nome da Mãe</span>
                <span className="pd-dado-valor">{paciente.nome_mae || '—'}</span>
              </div>
              <div className="pd-dado">
                <span className="pd-dado-label">E-mail</span>
                <span className="pd-dado-valor">{paciente.email}</span>
              </div>
              <div className="pd-dado">
                <span className="pd-dado-label">Telefone</span>
                <span className="pd-dado-valor">{paciente.telefone || '—'}</span>
              </div>
              <div className="pd-dado">
                <span className="pd-dado-label">CEP</span>
                <span className="pd-dado-valor">{paciente.cep || '—'}</span>
              </div>
              <div className="pd-dado">
                <span className="pd-dado-label">Número</span>
                <span className="pd-dado-valor">{paciente.numero || '—'}</span>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                className="pd-btn-primario pd-btn-danger" 
                onClick={solicitarExclusao} 
                style={{ width: '100%' }}
              >
                Solicitar Exclusão da Conta
              </button>
            </div>
          </div>
        </aside>

        {/* Coluna Direita: Abas de Histórico Clínico e Logs */}
        <main className="pd-main-historico">
          <div className="pd-tabs">
            <button 
              className={`pd-tab ${abaAtiva === 'prontuarios' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('prontuarios')}
            >
              Meu Histórico ({atendimentos.length})
            </button>
            <button 
              className={`pd-tab ${abaAtiva === 'logs' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('logs')}
            >
              Histórico de Alterações ({logs.length})
            </button>
          </div>

          {/* === ABA: MEU HISTÓRICO CLÍNICO === */}
          {abaAtiva === 'prontuarios' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  Meu Histórico Clínico
                </h3>
                <span className="pd-contagem">{atendimentos.length} consulta{atendimentos.length !== 1 ? 's' : ''}</span>
              </div>

              {atendimentos.length === 0 ? (
                <div className="pd-vazio">
                  <p>Nenhum registro clínico encontrado em seu histórico.</p>
                </div>
              ) : (
                <div className="pd-timeline">
                  {atendimentos.map((at, index) => (
                    <div key={at.id} className={`pd-timeline-item ${expandido === at.id ? 'expandido' : ''}`}>
                      {/* Linha da timeline */}
                      <div className="pd-timeline-marker">
                        <div className={`pd-timeline-dot ${index === 0 ? 'recente' : ''}`}></div>
                        {index < atendimentos.length - 1 && <div className="pd-timeline-line"></div>}
                      </div>

                      {/* Conteúdo do atendimento */}
                      <div className="pd-timeline-content" onClick={() => setExpandido(expandido === at.id ? null : at.id)}>
                        <div className="pd-timeline-header">
                          <div className="pd-timeline-info">
                            <span className="pd-timeline-data">{formatarDataHora(at.criado_em)}</span>
                            <span className="pd-timeline-medico">Médico Responsável: Dr(a). {at.medico_nome}</span>
                          </div>
                          <div className="pd-timeline-acoes">
                            <span className="pd-expand-icon">{expandido === at.id ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {/* Resumo (sempre visível) */}
                        <p className="pd-timeline-resumo">{gerarResumo(at)}</p>

                        {/* Sinais vitais (sempre visíveis se existirem) */}
                        {(at.peso || at.altura || at.imc) && (
                          <div className="pd-sinais-vitais">
                            {at.peso && <span className="pd-sinal">Peso: {at.peso} kg</span>}
                            {at.altura && <span className="pd-sinal">Altura: {at.altura} m</span>}
                            {at.imc && <span className="pd-sinal">IMC: {at.imc}</span>}
                          </div>
                        )}

                        {/* Detalhes SOAP (expandido) */}
                        {expandido === at.id && (
                          <div className="pd-soap-detalhes">
                            {at.subjetivo && (
                              <div className="pd-soap-bloco">
                                <h4>S — Subjetivo</h4>
                                <p>{at.subjetivo}</p>
                              </div>
                            )}
                            {at.objetivo && (
                              <div className="pd-soap-bloco">
                                <h4>O — Objetivo</h4>
                                <p>{at.objetivo}</p>
                              </div>
                            )}
                            {at.avaliacao && (
                              <div className="pd-soap-bloco">
                                <h4>A — Avaliação</h4>
                                <p>{at.avaliacao}</p>
                              </div>
                            )}
                            {at.plano && (
                              <div className="pd-soap-bloco">
                                <h4>P — Plano</h4>
                                <p>{at.plano}</p>
                              </div>
                            )}
                            <div className="pd-soap-meta">
                              Registro finalizado em: {formatarDataHora(at.criado_em)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === ABA: HISTÓRICO DE ALTERAÇÕES (LOGS) === */}
          {abaAtiva === 'logs' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  Histórico de Alterações de Dados e Prontuários
                </h3>
                <span className="pd-contagem">{gruposLog.length} evento{gruposLog.length !== 1 ? 's' : ''}</span>
              </div>

              {gruposLog.length === 0 ? (
                <div className="pd-vazio">
                  <p>Nenhuma alteração registrada em seus dados ou prontuários.</p>
                </div>
              ) : (
                <div className="pd-log-lista">
                  {gruposLog.map((grupo, index) => {
                    const p = grupo.principal;
                    const acaoInfo = mapAcao(p.acao);
                    const isEdicao = p.acao === 'edicao';

                    return (
                      <div key={index} className={`pd-log-item ${acaoInfo.cor}`}>
                        <div className="pd-log-marker">
                          <span className="pd-log-icon">{acaoInfo.icon}</span>
                          {index < gruposLog.length - 1 && <div className="pd-log-line"></div>}
                        </div>

                        <div className="pd-log-content">
                          <div className="pd-log-header">
                            <div className="pd-log-titulo">
                              <span className="pd-log-badge">{acaoInfo.label}</span>
                              <span className="pd-log-entidade">{mapEntidade(p.entidade)} #{p.entidade_id}</span>
                            </div>
                            <span className="pd-log-data">{formatarDataHora(p.criado_em)}</span>
                          </div>

                          <div className="pd-log-autor">
                            Modificado por <strong>{p.usuario_nome}</strong> ({p.usuario_role === 'medico' ? 'Médico' : p.usuario_role === 'admin' ? 'Administrador' : 'Paciente'})
                          </div>

                          {/* Detalhes de campos alterados (somente para edições) */}
                          {isEdicao && grupo.itens.length > 0 && (
                            <div className="pd-log-campos">
                              {grupo.itens.map((item, i) => (
                                <div key={i} className="pd-log-campo">
                                  <span className="pd-log-campo-nome">{item.campo}</span>
                                  <div className="pd-log-diff">
                                    <span className="pd-log-antigo" title={item.valor_anterior || '(vazio)'}>
                                      {truncar(item.valor_anterior)}
                                    </span>
                                    <span className="pd-log-seta">→</span>
                                    <span className="pd-log-novo" title={item.valor_novo || '(vazio)'}>
                                      {truncar(item.valor_novo)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}