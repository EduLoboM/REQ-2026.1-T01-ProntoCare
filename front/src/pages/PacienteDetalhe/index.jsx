import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api';
import './styles.css';

export default function PacienteDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [paciente, setPaciente] = useState(null);
  const [atendimentos, setAtendimentos] = useState([]);
  const [anamneses, setAnamneses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Controla qual atendimento está expandido na timeline
  const [expandido, setExpandido] = useState(null);

  // Controla a aba ativa: 'prontuarios', 'anamneses' ou 'logs'
  const [abaAtiva, setAbaAtiva] = useState('prontuarios');

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      const [pac, hist, anams, logData] = await Promise.all([
        api.get(`/pacientes/${id}`),
        api.get(`/atendimentos/paciente/${id}`),
        api.get(`/anamneses/paciente/${id}`),
        api.get(`/logs/paciente/${id}`)
      ]);
      setPaciente(pac);
      setAtendimentos(hist);
      setAnamneses(anams);
      setLogs(logData);
    } catch (err) {
      alert('Erro ao carregar dados do paciente.');
      navigate('/medico');
    } finally {
      setCarregando(false);
    }
  }

  function calcularIdade(dataNasc) {
    if (!dataNasc) return '—';
    const nascimento = new Date(dataNasc);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  }

  function formatarData(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  // Gera um resumo curto a partir dos campos SOAP para exibir na timeline
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

  function podeExcluir(dataCriacao) {
    if (!dataCriacao) return false;
    const criado = new Date(dataCriacao);
    const hoje = new Date();
    const limite = new Date(criado.getFullYear() + 20, criado.getMonth(), criado.getDate());
    return hoje >= limite;
  }

  async function excluirAtendimento(atId, event) {
    event.stopPropagation();
    const confirmar = window.confirm(
      'ATENÇÃO: Pela Lei nº 13.787/2018, este prontuário médico já completou o prazo mínimo de 20 anos de armazenamento e pode ser excluído permanentemente.\n\nDeseja realmente excluí-lo? Esta ação não pode ser desfeita.'
    );
    if (!confirmar) return;

    try {
      await api.delete(`/atendimentos/${atId}`);
      alert('Prontuário excluído com sucesso.');
      carregarDados();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir o prontuário.');
    }
  }

  async function excluirAnamnese(anamId, event) {
    event.stopPropagation();
    const confirmar = window.confirm(
      'ATENÇÃO: Pela Lei nº 13.787/2018, esta anamnese já completou o prazo mínimo de 20 anos de armazenamento e pode ser excluída permanentemente.\n\nDeseja realmente excluí-la? Esta ação não pode ser desfeita.'
    );
    if (!confirmar) return;

    try {
      await api.delete(`/anamneses/${anamId}`);
      alert('Anamnese excluída com sucesso.');
      carregarDados();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir a anamnese.');
    }
  }

  // Mapeia ações do log para ícones e labels legíveis
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
    if (ent === 'paciente') return 'Cadastro';
    if (ent === 'atendimento') return 'Prontuário';
    if (ent === 'anamnese') return 'Anamnese';
    return ent;
  }

  // Trunca valores longos para exibição no log
  function truncar(val, max = 60) {
    if (!val) return '(vazio)';
    if (val === '***') return '***';
    return val.length > max ? val.substring(0, max) + '...' : val;
  }

  // Agrupa logs por data + hora (mesma ação em batch)
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
        <p>Carregando dados do paciente...</p>
      </div>
    );
  }

  if (!paciente) return null;

  // Último IMC registrado para exibir no banner
  const ultimoImc = atendimentos.find(a => a.imc)?.imc;
  const gruposLog = agruparLogs(logs);

  return (
    <div className="pd-container">
      {/* Cabeçalho com dados vitais */}
      <header className="pd-header">
        <div className="pd-header-left">
          <button className="pd-btn-voltar" onClick={() => navigate('/medico')}>
            ← Voltar ao Painel
          </button>
          <div className="pd-header-info">
            <h1>{paciente.nome}</h1>
            <div className="pd-header-tags">
              <span className="pd-tag">{calcularIdade(paciente.data_nascimento)} anos</span>
              <span className="pd-tag">{mapSexo(paciente.sexo)}</span>
              <span className="pd-tag">CPF: {paciente.cpf}</span>
              {ultimoImc && <span className="pd-tag pd-tag-imc">IMC: {ultimoImc}</span>}
            </div>
          </div>
        </div>
        <div className="pd-header-actions">
          <span className={`pd-status ${paciente.ativo ? 'ativo' : 'inativo'}`}>
            {paciente.ativo ? '● Ativo' : '● Inativo'}
          </span>
          <button className="pd-btn-primario" onClick={() => navigate(`/anamnese/${id}`)}>
            + Nova Anamnese
          </button>
          <button className="pd-btn-primario" onClick={() => navigate(`/atendimento/${id}`)}>
            + Novo Prontuário
          </button>
          <button className="pd-btn-secundario" onClick={() => navigate(`/edit-paciente/${id}`)}>
            Editar Cadastro
          </button>
        </div>
      </header>

      <div className="pd-content">
        {/* Coluna Esquerda: Dados Cadastrais */}
        <aside className="pd-sidebar-dados">
          <div className="pd-card">
            <h3 className="pd-card-title">
              <span className="pd-card-icon">📋</span>
              Dados Cadastrais
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
                <span className="pd-dado-label">Número/Complemento</span>
                <span className="pd-dado-valor">{paciente.numero || '—'}</span>
              </div>
            </div>
            <div className="pd-dado pd-dado-meta">
              <span className="pd-dado-label">Cadastrado em</span>
              <span className="pd-dado-valor">{formatarDataHora(paciente.criado_em)}</span>
            </div>
          </div>
        </aside>

        {/* Coluna Direita: Abas (Prontuários / Log) */}
        <main className="pd-main-historico">
          <div className="pd-tabs">
            <button 
              className={`pd-tab ${abaAtiva === 'prontuarios' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('prontuarios')}
            >
              🩺 Prontuários ({atendimentos.length})
            </button>
            <button 
              className={`pd-tab ${abaAtiva === 'anamneses' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('anamneses')}
            >
              📋 Anamneses ({anamneses.length})
            </button>
            <button 
              className={`pd-tab ${abaAtiva === 'logs' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('logs')}
            >
              📝 Log de Alterações ({logs.length})
            </button>
          </div>

          {/* === ABA: PRONTUÁRIOS === */}
          {abaAtiva === 'prontuarios' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  <span className="pd-card-icon">🩺</span>
                  Histórico de Prontuários
                </h3>
                <span className="pd-contagem">{atendimentos.length} registro{atendimentos.length !== 1 ? 's' : ''}</span>
              </div>

              {atendimentos.length === 0 ? (
                <div className="pd-vazio">
                  <p className="pd-vazio-icon">📄</p>
                  <p>Nenhum prontuário registrado para este paciente.</p>
                  <button className="pd-btn-primario" onClick={() => navigate(`/atendimento/${id}`)}>
                    Criar Primeiro Prontuário
                  </button>
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
                            <span className="pd-timeline-medico">Dr(a). {at.medico_nome}</span>
                          </div>
                          <div className="pd-timeline-acoes">
                            {podeExcluir(at.criado_em) && (
                              <button 
                                className="pd-btn-excluir"
                                onClick={(e) => excluirAtendimento(at.id, e)}
                                title="Excluir este prontuário permanentemente (Legislação de 20 anos)"
                              >
                                🗑️ Excluir
                              </button>
                            )}
                            <button 
                              className="pd-btn-editar"
                              onClick={(e) => { e.stopPropagation(); navigate(`/atendimento/${id}?editar=${at.id}`); }}
                              title="Editar este prontuário"
                            >
                              ✏️ Editar
                            </button>
                            <span className="pd-expand-icon">{expandido === at.id ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {/* Resumo (sempre visível) */}
                        <p className="pd-timeline-resumo">{gerarResumo(at)}</p>

                        {/* Sinais vitais (sempre visíveis se existirem) */}
                        {(at.peso || at.altura || at.imc) && (
                          <div className="pd-sinais-vitais">
                            {at.peso && <span className="pd-sinal">⚖️ {at.peso} kg</span>}
                            {at.altura && <span className="pd-sinal">📏 {at.altura} m</span>}
                            {at.imc && <span className="pd-sinal">📊 IMC: {at.imc}</span>}
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
                              Última atualização: {formatarDataHora(at.atualizado_em)}
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

          {/* === ABA: ANAMNESES === */}
          {abaAtiva === 'anamneses' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  <span className="pd-card-icon">📋</span>
                  Histórico de Anamneses
                </h3>
                <span className="pd-contagem">{anamneses.length} registro{anamneses.length !== 1 ? 's' : ''}</span>
              </div>

              {anamneses.length === 0 ? (
                <div className="pd-vazio">
                  <p className="pd-vazio-icon">📄</p>
                  <p>Nenhuma anamnese registrada para este paciente.</p>
                  <button className="pd-btn-primario" onClick={() => navigate(`/anamnese/${id}`)}>
                    Criar Primeira Anamnese
                  </button>
                </div>
              ) : (
                <div className="pd-timeline">
                  {anamneses.map((anam, index) => (
                    <div key={anam.id} className={`pd-timeline-item ${expandido === 'anam_' + anam.id ? 'expandido' : ''}`}>
                      {/* Linha da timeline */}
                      <div className="pd-timeline-marker">
                        <div className={`pd-timeline-dot ${index === 0 ? 'recente' : ''}`}></div>
                        {index < anamneses.length - 1 && <div className="pd-timeline-line"></div>}
                      </div>

                      {/* Conteúdo da anamnese */}
                      <div className="pd-timeline-content" onClick={() => setExpandido(expandido === 'anam_' + anam.id ? null : 'anam_' + anam.id)}>
                        <div className="pd-timeline-header">
                          <div className="pd-timeline-info">
                            <span className="pd-timeline-data">{formatarDataHora(anam.criado_em)}</span>
                            <span className="pd-timeline-medico">Dr(a). {anam.medico_nome}</span>
                          </div>
                          <div className="pd-timeline-acoes">
                            {podeExcluir(anam.criado_em) && (
                              <button 
                                className="pd-btn-excluir"
                                onClick={(e) => excluirAnamnese(anam.id, e)}
                                title="Excluir esta anamnese permanentemente (Legislação de 20 anos)"
                              >
                                🗑️ Excluir
                              </button>
                            )}
                            <button 
                              className="pd-btn-editar"
                              onClick={(e) => { e.stopPropagation(); navigate(`/anamnese/${id}?editar=${anam.id}`); }}
                              title="Editar esta anamnese"
                            >
                              ✏️ Editar
                            </button>
                            <span className="pd-expand-icon">{expandido === 'anam_' + anam.id ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {/* Conteúdo resumido/completo */}
                        <p className="pd-timeline-resumo" style={{ whiteSpace: 'pre-wrap' }}>
                          {expandido === 'anam_' + anam.id ? anam.conteudo : (anam.conteudo.substring(0, 120) + (anam.conteudo.length > 120 ? '...' : ''))}
                        </p>
                        
                        {expandido === 'anam_' + anam.id && (
                          <div className="pd-soap-meta">
                            Última atualização: {formatarDataHora(anam.atualizado_em)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === ABA: LOG DE ALTERAÇÕES === */}
          {abaAtiva === 'logs' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  <span className="pd-card-icon">📝</span>
                  Log de Alterações
                </h3>
                <span className="pd-contagem">{gruposLog.length} evento{gruposLog.length !== 1 ? 's' : ''}</span>
              </div>

              {gruposLog.length === 0 ? (
                <div className="pd-vazio">
                  <p className="pd-vazio-icon">📝</p>
                  <p>Nenhuma alteração registrada ainda.</p>
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
                            por <strong>{p.usuario_nome}</strong> ({p.usuario_role})
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
