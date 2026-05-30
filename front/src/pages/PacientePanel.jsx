import { useState, useEffect } from 'react';
import { api } from '../api';
import './PacienteDetalhe/styles.css';
import { exportarProntuarioPDF, exportarAnamnesePDF } from '../services/pdfExportService';
import { 
  criarBlocoGenesis, 
  criarBlocoExportacao, 
  validarCadeia 
} from '../services/blockchainService';

export default function PacientePanel({ onLogout }) {
  const [paciente, setPaciente] = useState(null);
  const [atendimentos, setAtendimentos] = useState([]);
  const [anamneses, setAnamneses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [blockchain, setBlockchain] = useState([]);
  const [verificando, setVerificando] = useState(false);
  const [integridadeResultado, setIntegridadeResultado] = useState(null);
  const [exportandoPdf, setExportandoPdf] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [excluido, setExcluido] = useState(false);
  const [expandido, setExpandido] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('prontuarios');
  const [mostrarVisualizacoes, setMostrarVisualizacoes] = useState(false);
  const [logsExpandidos, setLogsExpandidos] = useState({});
  const [blocosExpandidos, setBlocosExpandidos] = useState({});

  const alternarLogExpandido = (idx) => {
    setLogsExpandidos(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const alternarBlocoExpandido = (idx) => {
    setBlocosExpandidos(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    async function carregar() {
      try {
        const dadosPaciente = await api.get('/pacientes/me');
        setPaciente(dadosPaciente);
        
        const [historico, anams, logsData, cadeia] = await Promise.all([
          api.get(`/atendimentos/paciente/${dadosPaciente.id}`),
          api.get(`/anamneses/paciente/${dadosPaciente.id}`),
          api.get(`/logs/paciente/${dadosPaciente.id}`),
          api.get(`/blockchain/paciente/${dadosPaciente.id}`)
        ]);
        
        setAtendimentos(historico);
        setAnamneses(anams);
        setLogs(logsData);
        setBlockchain(cadeia || []);
      } catch (e) {
        alert(e.message || 'Erro ao carregar dados do paciente.');
        onLogout();
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

  // RNF08: Exportar prontuário como PDF com hash SHA-256 e registro na blockchain
  async function exportarPDF(atendimento) {
    const itemKey = `at_${atendimento.id}`;
    if (exportandoPdf) return;
    setExportandoPdf(itemKey);

    try {
      // 1. Buscar último bloco da cadeia (ou criar gênesis)
      let ultimoBlocoResp = await api.get(`/blockchain/paciente/${paciente.id}/ultimo`);
      
      if (!ultimoBlocoResp) {
        // Criar bloco gênesis
        const genesis = await criarBlocoGenesis();
        ultimoBlocoResp = await api.post('/blockchain', {
          paciente_id: parseInt(paciente.id),
          ...genesis,
        });
      }

      // 2. Determinar versão do documento
      const blocosDoDoc = (blockchain || []).filter(
        b => b.entidade === 'atendimento' && b.entidade_id === atendimento.id
      );
      const versao = blocosDoDoc.length + 1;

      // 3. Gerar dados canônicos para hash
      const dadosProntuario = {
        id: atendimento.id,
        paciente_id: atendimento.paciente_id,
        medico_id: atendimento.medico_id,
        peso: atendimento.peso,
        altura: atendimento.altura,
        imc: atendimento.imc,
        subjetivo: atendimento.subjetivo,
        objetivo: atendimento.objetivo,
        avaliacao: atendimento.avaliacao,
        plano: atendimento.plano,
        criado_em: atendimento.criado_em,
        atualizado_em: atendimento.atualizado_em,
      };

      // 4. Criar novo bloco na blockchain
      const novoBloco = await criarBlocoExportacao({
        blocoAnterior: ultimoBlocoResp,
        entidade: 'atendimento',
        entidade_id: atendimento.id,
        versao,
        dadosProntuario,
        pdfHash: null,
        usuario: {
          id: paciente.id,
          nome: paciente.nome,
          role: 'paciente',
        },
      });

      // 5. Salvar na blockchain da API
      const blocoSalvo = await api.post('/blockchain', {
        paciente_id: parseInt(paciente.id),
        ...novoBloco,
      });

      // 6. Exportar o PDF com hash de integridade
      await exportarProntuarioPDF({
        atendimento,
        paciente,
        blocoBlockchain: blocoSalvo,
      });

      // 7. Atualizar cadeia e logs localmente
      const novaCadeia = await api.get(`/blockchain/paciente/${paciente.id}`);
      setBlockchain(novaCadeia || []);
      const logsData = await api.get(`/logs/paciente/${paciente.id}`);
      setLogs(logsData);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      alert('Erro ao exportar PDF: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setExportandoPdf(null);
    }
  }

  // RNF08: Exportar anamnese como PDF com hash SHA-256 e registro na blockchain
  async function exportarAnamnese(anamnese) {
    const itemKey = `anam_${anamnese.id}`;
    if (exportandoPdf) return;
    setExportandoPdf(itemKey);

    try {
      // 1. Buscar último bloco da cadeia (ou criar gênesis)
      let ultimoBlocoResp = await api.get(`/blockchain/paciente/${paciente.id}/ultimo`);
      
      if (!ultimoBlocoResp) {
        // Criar bloco gênesis
        const genesis = await criarBlocoGenesis();
        ultimoBlocoResp = await api.post('/blockchain', {
          paciente_id: parseInt(paciente.id),
          ...genesis,
        });
      }

      // 2. Determinar versão do documento
      const blocosDoDoc = (blockchain || []).filter(
        b => b.entidade === 'anamnese' && b.entidade_id === anamnese.id
      );
      const versao = blocosDoDoc.length + 1;

      // 3. Gerar dados canônicos para hash
      const dadosAnamnese = {
        id: anamnese.id,
        paciente_id: anamnese.paciente_id,
        medico_id: anamnese.medico_id,
        conteudo: anamnese.conteudo,
        criado_em: anamnese.criado_em,
        atualizado_em: anamnese.atualizado_em,
      };

      // 4. Criar novo bloco na blockchain
      const novoBloco = await criarBlocoExportacao({
        blocoAnterior: ultimoBlocoResp,
        entidade: 'anamnese',
        entidade_id: anamnese.id,
        versao,
        dadosAnamnese,
        pdfHash: null,
        usuario: {
          id: paciente.id,
          nome: paciente.nome,
          role: 'paciente',
        },
      });

      // 5. Salvar na blockchain da API
      const blocoSalvo = await api.post('/blockchain', {
        paciente_id: parseInt(paciente.id),
        ...novoBloco,
      });

      // 6. Exportar o PDF com hash de integridade
      await exportarAnamnesePDF({
        anamnese,
        paciente,
        blocoBlockchain: blocoSalvo,
      });

      // 7. Atualizar cadeia e logs localmente
      const novaCadeia = await api.get(`/blockchain/paciente/${paciente.id}`);
      setBlockchain(novaCadeia || []);
      const logsData = await api.get(`/logs/paciente/${paciente.id}`);
      setLogs(logsData);
    } catch (err) {
      console.error('Erro ao exportar PDF da Anamnese:', err);
      alert('Erro ao exportar PDF: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setExportandoPdf(null);
    }
  }

  // RNF08: Verificar integridade da blockchain
  async function verificarIntegridade() {
    setVerificando(true);

    try {
      // Verificação do lado do servidor
      const resultado = await api.get(`/blockchain/paciente/${paciente.id}/verificar`);
      
      // Verificação do lado do cliente (double-check via Web Crypto API)
      const cadeia = await api.get(`/blockchain/paciente/${paciente.id}`);
      const resultadoCliente = await validarCadeia(cadeia || []);

      const dataHoraFormatada = formatarDataHora(new Date().toISOString());
      const valida = resultado.valida && resultadoCliente.valida;

      // Salva resultado para exibição no log expandido
      setIntegridadeResultado({
        valida,
        servidor: resultado.valida ? 'Cadeia validada.' : (resultado.mensagem || 'Cadeia inválida.'),
        cliente: resultadoCliente.valida ? 'Cadeia validada.' : (resultadoCliente.erro || 'Cadeia inválida.'),
        timestamp: dataHoraFormatada,
      });

      if (valida) {
        alert(`Status: ✓ Cadeia Íntegra\nServidor: ✓ Cadeia validada.\nCliente: ✓ Cadeia validada.`);
      } else {
        const msgServidor = resultado.valida ? 'Cadeia validada.' : (resultado.mensagem || 'Cadeia inválida.');
        const msgCliente = resultadoCliente.valida ? 'Cadeia validada.' : (resultadoCliente.erro || 'Cadeia inválida.');
        alert(`Status: ✗ Integridade Comprometida\nServidor: ✗ ${msgServidor}\nCliente: ✗ ${msgCliente}`);
      }

      setBlockchain(cadeia || []);

      // Atualiza logs para exibir o novo log de verificação imediatamente
      const logData = await api.get(`/logs/paciente/${paciente.id}`);
      setLogs(logData);
    } catch (err) {
      const dataHoraFormatada = formatarDataHora(new Date().toISOString());
      setIntegridadeResultado({
        valida: false,
        servidor: 'Erro ao verificar: ' + err.message,
        cliente: 'Erro ao verificar: ' + err.message,
        timestamp: dataHoraFormatada,
      });
      alert(`Status: ✗ Integridade Comprometida\nServidor: ✗ Erro ao verificar: ${err.message}\nCliente: ✗ Erro ao verificar: ${err.message}`);
    } finally {
      setVerificando(false);
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
      criacao: { icon: '🜔', label: 'Criação', cor: 'log-criacao' },
      edicao: { icon: '☿', label: 'Edição', cor: 'log-edicao' },
      exclusao: { icon: '🜍', label: 'Exclusão', cor: 'log-exclusao' },
      desativacao: { icon: '♄', label: 'Desativação', cor: 'log-desativacao' },
      reativacao: { icon: '☉', label: 'Reativação', cor: 'log-criacao' },
      verificacao: { icon: '🜓', label: 'Integridade', cor: 'log-verificacao' },
    };
    return map[acao] || { icon: '🜔', label: acao, cor: '' };
  }

  function obterIconClass(simbolo) {
    if (simbolo === '🜔') return 'icon-sal';
    if (simbolo === '☿') return 'icon-mercurio';
    if (simbolo === '🜍') return 'icon-chofre';
    if (simbolo === '♄') return 'icon-saturno';
    if (simbolo === '☉') return 'icon-sol';
    if (simbolo === '☽') return 'icon-lua';
    if (simbolo === '🜓') return 'icon-vitriolo';
    return '';
  }

  function detectarBrowser(userAgent) {
    if (!userAgent) return 'Desconhecido';
    const ua = userAgent.toLowerCase();
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('chrome') && !ua.includes('chromium') && !ua.includes('edg')) return 'Chrome';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('edg')) return 'Edge';
    if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
    if (ua.includes('msie') || ua.includes('trident')) return 'Internet Explorer';
    return 'Outro / API';
  }

  function formatarIp(ip) {
    if (!ip) return 'Desconhecido';
    if (ip === '::1') return '127.0.0.1';
    if (ip === '::ffff:127.0.0.1') return '127.0.0.1';
    return ip;
  }

  function mapEntidade(ent) {
    if (ent === 'paciente') return 'Cadastro';
    if (ent === 'atendimento') return 'Prontuário';
    if (ent === 'anamnese') return 'Anamnese';
    if (ent === 'blockchain') return 'Blockchain';
    return ent;
  }

  function formatarContagem(n) {
    return n > 99 ? '99+' : n;
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
  const logsFiltrados = logs.filter(l => mostrarVisualizacoes || l.acao !== 'visualizacao');
  const gruposLog = agruparLogs(logsFiltrados);

  const historicoClinico = [
    ...atendimentos.map(at => ({ ...at, tipoItem: 'atendimento' })),
    ...anamneses.map(an => ({ ...an, tipoItem: 'anamnese' }))
  ].sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));

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

          </div>
        </aside>

        {/* Coluna Direita: Abas de Histórico Clínico e Logs */}
        <main className="pd-main-historico">
          <div className="pd-tabs">
            <button 
              className={`pd-tab ${abaAtiva === 'prontuarios' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('prontuarios')}
            >
              Meu Histórico ({historicoClinico.length})
            </button>
            <button 
              className={`pd-tab ${abaAtiva === 'logs' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('logs')}
            >
              Log de Alterações ({logs.length})
            </button>
            <button 
              className={`pd-tab ${abaAtiva === 'integridade' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('integridade')}
            >
              Integridade ({blockchain.length})
            </button>
          </div>

          {/* === ABA: MEU HISTÓRICO CLÍNICO === */}
          {abaAtiva === 'prontuarios' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  Meu Histórico Clínico
                </h3>
                <span className="pd-contagem">
                  {historicoClinico.length} registro{historicoClinico.length !== 1 ? 's' : ''}
                </span>
              </div>

              {historicoClinico.length === 0 ? (
                <div className="pd-vazio">
                  <p>Nenhum registro clínico encontrado em seu histórico.</p>
                </div>
              ) : (
                <div className="pd-timeline">
                  {historicoClinico.map((item, index) => {
                    const isAtendimento = item.tipoItem === 'atendimento';
                    const itemKey = isAtendimento ? `at_${item.id}` : `anam_${item.id}`;
                    const isExpandido = expandido === itemKey;

                    return (
                      <div key={itemKey} className={`pd-timeline-item ${isExpandido ? 'expandido' : ''}`}>
                        {/* Linha da timeline */}
                        <div className="pd-timeline-marker">
                          <div className={`pd-timeline-dot log-icon-container ${isAtendimento ? 'prontuario' : 'anamnese'} ${index === 0 ? 'recente' : ''}`}>
                            <span className={`pd-log-icon ${isAtendimento ? 'icon-sal' : 'icon-mercurio'}`}>{isAtendimento ? '🜔' : '☿'}</span>
                          </div>
                          {index < historicoClinico.length - 1 && <div className="pd-timeline-line"></div>}
                        </div>

                        {/* Conteúdo do item */}
                        <div className={`pd-timeline-content ${isAtendimento ? 'prontuario' : 'anamnese'}`} onClick={() => setExpandido(isExpandido ? null : itemKey)}>
                          <div className="pd-timeline-header">
                            <div className="pd-timeline-info">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span className="pd-timeline-data">{formatarDataHora(item.criado_em)}</span>
                                <span className="pd-log-badge" style={{
                                  backgroundColor: 'var(--primary-light)',
                                  color: 'var(--primary)',
                                  borderColor: 'var(--primary)',
                                  fontSize: '0.75rem',
                                  padding: '2px 8px',
                                  textTransform: 'uppercase',
                                  fontWeight: '700',
                                  borderRadius: 'var(--radius-sm)'
                                }}>
                                  {isAtendimento ? 'Prontuário' : 'Anamnese'}
                                </span>
                              </div>
                              <span className="pd-timeline-medico">Médico Responsável: Dr(a). {item.medico_nome}</span>
                            </div>
                            <div className="pd-timeline-acoes">
                              <button 
                                className="pd-btn-pdf"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  if (isAtendimento) {
                                    exportarPDF(item);
                                  } else {
                                    exportarAnamnese(item);
                                  }
                                }}
                                disabled={exportandoPdf === itemKey}
                                title={isAtendimento ? "Exportar prontuário como PDF com hash SHA-256" : "Exportar anamnese como PDF com hash SHA-256"}
                                style={{ marginRight: '0.5rem' }}
                              >
                                {exportandoPdf === itemKey ? 'Exportando...' : 'PDF'}
                              </button>
                              <span className="pd-expand-icon">{isExpandido ? '▲' : '▼'}</span>
                            </div>
                          </div>

                          {isAtendimento ? (
                            <>
                              {/* Resumo (sempre visível) */}
                              <p className="pd-timeline-resumo">{gerarResumo(item)}</p>

                              {/* Sinais vitais (sempre visíveis se existirem) */}
                              {(item.peso || item.altura || item.imc) && (
                                <div className="pd-sinais-vitais">
                                  {item.peso && <span className="pd-sinal">Peso: {item.peso} kg</span>}
                                  {item.altura && <span className="pd-sinal">Altura: {item.altura} m</span>}
                                  {item.imc && <span className="pd-sinal">IMC: {item.imc}</span>}
                                </div>
                              )}

                              {/* Detalhes SOAP (expandido) */}
                              {isExpandido && (
                                <div className="pd-soap-detalhes">
                                  {item.subjetivo && (
                                    <div className="pd-soap-bloco">
                                      <h4>S — Subjetivo</h4>
                                      <p>{item.subjetivo}</p>
                                    </div>
                                  )}
                                  {item.objetivo && (
                                    <div className="pd-soap-bloco">
                                      <h4>O — Objetivo</h4>
                                      <p>{item.objetivo}</p>
                                    </div>
                                  )}
                                  {item.avaliacao && (
                                    <div className="pd-soap-bloco">
                                      <h4>A — Avaliação</h4>
                                      <p>{item.avaliacao}</p>
                                    </div>
                                  )}
                                  {item.plano && (
                                    <div className="pd-soap-bloco">
                                      <h4>P — Plano</h4>
                                      <p>{item.plano}</p>
                                    </div>
                                  )}
                                  <div className="pd-soap-meta">
                                    Registro finalizado em: {formatarDataHora(item.criado_em)}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {/* Conteúdo resumido/completo da anamnese */}
                              <p className="pd-timeline-resumo" style={{ whiteSpace: 'pre-wrap' }}>
                                {isExpandido ? item.conteudo : (item.conteudo.substring(0, 120) + (item.conteudo.length > 120 ? '...' : ''))}
                              </p>
                              
                              {isExpandido && (
                                <div className="pd-soap-meta" style={{ marginTop: '1rem', paddingTop: '0.6rem' }}>
                                  Registro finalizado em: {formatarDataHora(item.criado_em)}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={mostrarVisualizacoes} 
                      onChange={e => setMostrarVisualizacoes(e.target.checked)} 
                    />
                    Mostrar acessos de leitura
                  </label>
                  <span className="pd-contagem">{formatarContagem(gruposLog.length)} evento{gruposLog.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {gruposLog.length === 0 ? (
                <div className="pd-vazio">
                  <p>Nenhuma alteração registrada em seus dados ou prontuários.</p>
                </div>
              ) : (
                <div className="pd-timeline">
                  {gruposLog.map((grupo, index) => {
                    const p = grupo.principal;
                    const acaoInfo = mapAcao(p.acao);
                    const isEdicao = p.acao === 'edicao';
                    const isLogExpandido = !!logsExpandidos[index];

                    return (
                      <div key={index} className={`pd-timeline-item ${isLogExpandido ? 'expandido' : ''}`}>
                        <div className="pd-timeline-marker">
                          <div className={`pd-timeline-dot log-icon-container ${acaoInfo.cor} ${index === 0 ? 'recente' : ''}`}>
                            <span className={`pd-log-icon ${obterIconClass(acaoInfo.icon)}`}>{acaoInfo.icon}</span>
                          </div>
                          {index < gruposLog.length - 1 && <div className="pd-timeline-line"></div>}
                        </div>

                        <div 
                          className={`pd-timeline-content pd-log-content ${acaoInfo.cor}`}
                          onClick={() => alternarLogExpandido(index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="pd-timeline-header">
                            <div className="pd-timeline-info" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span className="pd-log-badge" style={{ margin: 0 }}>{acaoInfo.label}</span>
                              <span className="pd-log-entidade" style={{ fontSize: '0.9rem' }}>{mapEntidade(p.entidade)} #{p.entidade_id}</span>
                            </div>
                            <div className="pd-timeline-acoes" style={{ gap: '1rem' }}>
                              <span className="pd-log-data">{formatarDataHora(p.criado_em)}</span>
                              <span className="pd-expand-icon">{isLogExpandido ? '▲' : '▼'}</span>
                            </div>
                          </div>

                          {isLogExpandido && (
                            <div className="pd-soap-detalhes">
                              <div className="pd-log-autor" style={{ margin: 0 }}>
                                Modificado por <strong>{p.usuario_nome}</strong> ({p.usuario_role === 'medico' ? 'Médico' : p.usuario_role === 'admin' ? 'Administrador' : 'Paciente'})
                                {p.ip && <span className="pd-log-meta-item" title="Endereço IP de origem"> • IP: <code>{formatarIp(p.ip)}</code></span>}
                                {p.user_agent && (
                                  <span className="pd-log-meta-item" title={p.user_agent}>
                                     • Navegador: <em>{detectarBrowser(p.user_agent)}</em>
                                  </span>
                                )}
                              </div>

                              {/* Detalhes de campos alterados (somente para edições) */}
                              {isEdicao && grupo.itens.length > 0 && (
                                <div className="pd-log-campos" style={{ marginTop: '0.75rem' }}>
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

                              {/* Resultado da verificação de integridade */}
                              {p.acao === 'verificacao' && integridadeResultado && (
                                <div className="pd-log-campos" style={{ marginTop: '0.75rem' }}>
                                  <div className="pd-log-campo">
                                    <span className="pd-log-campo-nome">Status</span>
                                    <span style={{ fontWeight: 'bold', color: integridadeResultado.valida ? 'var(--success)' : 'var(--danger)' }}>
                                      {integridadeResultado.valida ? '✓ Cadeia Íntegra' : '✗ Integridade Comprometida'}
                                    </span>
                                  </div>
                                  <div className="pd-log-campo">
                                    <span className="pd-log-campo-nome">Servidor</span>
                                    <span style={{ color: 'var(--text-main)' }}>
                                      {integridadeResultado.valida ? '✓ ' : '✗ '} {integridadeResultado.servidor}
                                    </span>
                                  </div>
                                  <div className="pd-log-campo">
                                    <span className="pd-log-campo-nome">Cliente</span>
                                    <span style={{ color: 'var(--text-main)' }}>
                                      {integridadeResultado.valida ? '✓ ' : '✗ '} {integridadeResultado.cliente}
                                    </span>
                                  </div>
                                </div>
                              )}
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

          {/* === ABA: INTEGRIDADE (BLOCKCHAIN) === */}
          {abaAtiva === 'integridade' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  Blockchain de Integridade
                </h3>
                <button
                  className="pd-btn-primario"
                  onClick={verificarIntegridade}
                  disabled={verificando}
                  style={{
                    fontSize: '0.85rem',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--primary)',
                    fontWeight: '600',
                    lineHeight: '1.4',
                    cursor: 'pointer',
                    height: 'auto',
                    minWidth: '90px'
                  }}
                >
                  {verificando ? 'Verificando...' : 'Verificar Integridade'}
                </button>
              </div>

              {/* Lista de blocos */}
              {blockchain.length === 0 ? (
                <div className="pd-vazio">
                  <p>Nenhum bloco na blockchain. Exporte um prontuário como PDF para iniciar a cadeia.</p>
                </div>
              ) : (
                <div className="pd-timeline">
                  {[...blockchain].reverse().map((bloco, index) => (
                    <div key={bloco.id || index} className={`pd-timeline-item ${blocosExpandidos[bloco.indice] ? 'expandido' : ''}`}>
                      <div className="pd-timeline-marker">
                        <div className={`pd-timeline-dot log-icon-container ${bloco.tipo} ${index === 0 ? 'recente' : ''}`}>
                          <span className={`pd-log-icon ${bloco.tipo === 'genesis' ? 'icon-sol' : bloco.tipo === 'exportacao' ? 'icon-sal' : 'icon-mercurio'}`}>
                            {bloco.tipo === 'genesis' ? '☉' : bloco.tipo === 'exportacao' ? '🜔' : '☿'}
                          </span>
                        </div>
                        {index < blockchain.length - 1 && <div className="pd-timeline-line"></div>}
                      </div>
                      <div 
                        className={`pd-timeline-content pd-blockchain-bloco ${bloco.tipo}`}
                        onClick={() => alternarBlocoExpandido(bloco.indice)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="pd-blockchain-bloco-header">
                          <div className="pd-blockchain-bloco-titulo">
                            <span className="pd-blockchain-bloco-indice">#{bloco.indice}</span>
                            <span className={`pd-blockchain-tipo-badge ${bloco.tipo}`}>
                              {bloco.tipo === 'genesis' ? 'Gênesis' : bloco.tipo === 'exportacao' ? 'Exportação' : 'Edição'}
                            </span>
                            {bloco.entidade && (
                              <span className="pd-blockchain-entidade">
                                {bloco.entidade === 'atendimento' ? 'Prontuário' : 'Anamnese'} #{bloco.entidade_id}
                                {bloco.versao > 0 && ` (v${bloco.versao})`}
                              </span>
                            )}
                          </div>
                          <div className="pd-timeline-acoes" style={{ gap: '1rem' }}>
                            <span className="pd-blockchain-data">{formatarDataHora(bloco.timestamp || bloco.criado_em)}</span>
                            <span className="pd-expand-icon">{blocosExpandidos[bloco.indice] ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {blocosExpandidos[bloco.indice] && (
                          <div className="pd-soap-detalhes" style={{ gap: '0.75rem' }}>
                            <div className="pd-blockchain-hashes">
                              <div className="pd-blockchain-hash-row">
                                <span className="pd-blockchain-hash-label">Hash:</span>
                                <code className="pd-blockchain-hash-value">{bloco.hash}</code>
                              </div>
                              <div className="pd-blockchain-hash-row">
                                <span className="pd-blockchain-hash-label">Anterior:</span>
                                <code className="pd-blockchain-hash-value anterior">
                                  {bloco.hash_anterior === '0' ? '(gênesis)' : bloco.hash_anterior}
                                </code>
                              </div>
                              {bloco.dados_hash && bloco.dados_hash !== '0' && (
                                <div className="pd-blockchain-hash-row">
                                  <span className="pd-blockchain-hash-label">Dados:</span>
                                  <code className="pd-blockchain-hash-value dados">{bloco.dados_hash}</code>
                                </div>
                              )}
                            </div>

                            {bloco.usuario_nome && (
                              <div className="pd-blockchain-autor" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                                por <strong>{bloco.usuario_nome}</strong> ({bloco.usuario_role === 'medico' ? 'Médico' : bloco.usuario_role === 'admin' ? 'Administrador' : 'Paciente'})
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}