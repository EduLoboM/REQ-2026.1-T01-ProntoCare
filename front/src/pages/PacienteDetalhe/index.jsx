import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api';
import { hashTexto } from '../../services/hashService';
import { criarBlocoGenesis, criarBlocoExportacao, validarCadeia, canonicalizar } from '../../services/blockchainService';
import { exportarProntuarioPDF, exportarAnamnesePDF } from '../../services/pdfExportService';
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
  const [logsExpandidos, setLogsExpandidos] = useState({});
  const [blocosExpandidos, setBlocosExpandidos] = useState({});

  const alternarLogExpandido = (idx) => {
    setLogsExpandidos(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const alternarBlocoExpandido = (idx) => {
    setBlocosExpandidos(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Controla a aba ativa: 'prontuarios', 'anamneses', 'logs' ou 'integridade'
  const [abaAtiva, setAbaAtiva] = useState('prontuarios');

  // RNF08: Estado da blockchain de integridade
  const [blockchain, setBlockchain] = useState([]);
  const [verificando, setVerificando] = useState(false);
  const [exportandoPdf, setExportandoPdf] = useState(null);
  const [mostrarVisualizacoes, setMostrarVisualizacoes] = useState(false);
  const [integridadeResultado, setIntegridadeResultado] = useState(null);

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      const [pac, hist, anams, logData, chain] = await Promise.all([
        api.get(`/pacientes/${id}`),
        api.get(`/atendimentos/paciente/${id}`),
        api.get(`/anamneses/paciente/${id}`),
        api.get(`/logs/paciente/${id}`),
        api.get(`/blockchain/paciente/${id}`)
      ]);
      setPaciente(pac);
      setAtendimentos(hist);
      setAnamneses(anams);
      setLogs(logData);
      setBlockchain(chain || []);
    } catch (err) {
      alert('Erro ao carregar dados do paciente.');
      navigate('/medico');
    } finally {
      setCarregando(false);
    }
  }

  // RNF08: Exportar prontuário como PDF com hash SHA-256 e registro na blockchain
  async function exportarPDF(atendimento) {
    if (exportandoPdf) return;
    setExportandoPdf(atendimento.id);

    try {
      // 1. Buscar último bloco da cadeia (ou criar gênesis)
      let ultimoBlocoResp = await api.get(`/blockchain/paciente/${id}/ultimo`);
      
      if (!ultimoBlocoResp) {
        // Criar bloco gênesis
        const genesis = await criarBlocoGenesis();
        ultimoBlocoResp = await api.post('/blockchain', {
          paciente_id: parseInt(id),
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
          id: parseInt(localStorage.getItem('userId') || '0'),
          nome: localStorage.getItem('userName') || 'Médico',
          role: localStorage.getItem('role') || 'medico',
        },
      });

      // 5. Salvar bloco no backend
      const blocoSalvo = await api.post('/blockchain', {
        paciente_id: parseInt(id),
        ...novoBloco,
      });

      // 6. Exportar o PDF com hash de integridade
      await exportarProntuarioPDF({
        atendimento,
        paciente,
        blocoBlockchain: blocoSalvo,
      });

      // 7. Atualizar a cadeia local
      setBlockchain(prev => [...prev, blocoSalvo]);

      alert(`PDF exportado com sucesso!\n\nHash SHA-256: ${novoBloco.dados_hash.substring(0, 16)}...\nBloco #${novoBloco.indice} registrado na blockchain.`);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      alert('Erro ao exportar PDF: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setExportandoPdf(null);
    }
  }

  // RNF08: Exportar anamnese como PDF com hash SHA-256 e registro na blockchain
  async function exportarAnamnese(anamnese) {
    if (exportandoPdf) return;
    setExportandoPdf('anam_' + anamnese.id);

    try {
      // 1. Buscar último bloco da cadeia (ou criar gênesis)
      let ultimoBlocoResp = await api.get(`/blockchain/paciente/${id}/ultimo`);
      
      if (!ultimoBlocoResp) {
        // Criar bloco gênesis
        const genesis = await criarBlocoGenesis();
        ultimoBlocoResp = await api.post('/blockchain', {
          paciente_id: parseInt(id),
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
        dadosProntuario: dadosAnamnese,
        pdfHash: null,
        usuario: {
          id: parseInt(localStorage.getItem('userId') || '0'),
          nome: localStorage.getItem('userName') || 'Médico',
          role: localStorage.getItem('role') || 'medico',
        },
      });

      // 5. Salvar bloco no backend
      const blocoSalvo = await api.post('/blockchain', {
        paciente_id: parseInt(id),
        ...novoBloco,
      });

      // 6. Exportar o PDF com hash de integridade
      await exportarAnamnesePDF({
        anamnese,
        paciente,
        blocoBlockchain: blocoSalvo,
      });

      // 7. Atualizar a cadeia local
      setBlockchain(prev => [...prev, blocoSalvo]);

      alert(`PDF da Anamnese exportado com sucesso!\n\nHash SHA-256: ${novoBloco.dados_hash.substring(0, 16)}...\nBloco #${novoBloco.indice} registrado na blockchain.`);
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
      const resultado = await api.get(`/blockchain/paciente/${id}/verificar`);
      
      // Verificação do lado do cliente (double-check via Web Crypto API)
      const cadeia = await api.get(`/blockchain/paciente/${id}`);
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
      const logData = await api.get(`/logs/paciente/${id}`);
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

  function mapAcao(acao) {
    const map = {
      criacao: { icon: '🜔', label: 'Criação', cor: 'log-criacao' },
      edicao: { icon: '☿', label: 'Edição', cor: 'log-edicao' },
      exclusao: { icon: '🜍', label: 'Exclusão', cor: 'log-exclusao' },
      desativacao: { icon: '♄', label: 'Desativação', cor: 'log-desativacao' },
      reativacao: { icon: '☉', label: 'Reativação', cor: 'log-criacao' },
      visualizacao: { icon: '☽', label: 'Visualização', cor: 'log-visualizacao' },
      verificacao: { icon: '♁', label: 'Integridade', cor: 'log-verificacao' },
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
    if (simbolo === '♁') return 'icon-antimonio';
    return '';
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

  // Trunca valores longos para exibição no log
  function truncar(val, max = 60) {
    if (!val) return '(vazio)';
    if (val === '***') return '***';
    return val.length > max ? val.substring(0, max) + '...' : val;
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
  const logsFiltrados = logs.filter(l => mostrarVisualizacoes || l.acao !== 'visualizacao');
  const gruposLog = agruparLogs(logsFiltrados);

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
              Prontuários ({atendimentos.length})
            </button>
            <button 
              className={`pd-tab ${abaAtiva === 'anamneses' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('anamneses')}
            >
              Anamneses ({anamneses.length})
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

          {/* === ABA: PRONTUÁRIOS === */}
          {abaAtiva === 'prontuarios' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  Histórico de Prontuários
                </h3>
                <span className="pd-contagem">{atendimentos.length} registro{atendimentos.length !== 1 ? 's' : ''}</span>
              </div>

              {atendimentos.length === 0 ? (
                <div className="pd-vazio">
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
                        <div className={`pd-timeline-dot log-icon-container prontuario ${index === 0 ? 'recente' : ''}`}>
                          <span className="pd-log-icon icon-sal">🜔</span>
                        </div>
                        {index < atendimentos.length - 1 && <div className="pd-timeline-line"></div>}
                      </div>

                      {/* Conteúdo do atendimento */}
                      <div className="pd-timeline-content prontuario" onClick={() => setExpandido(expandido === at.id ? null : at.id)}>
                        <div className="pd-timeline-header">
                          <div className="pd-timeline-info">
                            <span className="pd-timeline-data">{formatarDataHora(at.criado_em)}</span>
                            <span className="pd-timeline-medico">Dr(a). {at.medico_nome}</span>
                          </div>
                          <div className="pd-timeline-acoes">
                            <button
                              className="pd-btn-pdf"
                              onClick={(e) => { e.stopPropagation(); exportarPDF(at); }}
                              disabled={exportandoPdf === at.id}
                              title="Exportar prontuário como PDF com hash SHA-256"
                            >
                              {exportandoPdf === at.id ? 'Exportando...' : 'PDF'}
                            </button>
                            {podeExcluir(at.criado_em) && (
                              <button 
                                className="pd-btn-excluir"
                                onClick={(e) => excluirAtendimento(at.id, e)}
                                title="Excluir este prontuário permanentemente (Legislação de 20 anos)"
                              >
                                Excluir
                              </button>
                            )}
                            <button 
                              className="pd-btn-editar"
                              onClick={(e) => { e.stopPropagation(); navigate(`/atendimento/${id}?editar=${at.id}`); }}
                              title="Editar este prontuário"
                            >
                              Editar
                            </button>
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
                  Histórico de Anamneses
                </h3>
                <span className="pd-contagem">{anamneses.length} registro{anamneses.length !== 1 ? 's' : ''}</span>
              </div>

              {anamneses.length === 0 ? (
                <div className="pd-vazio">
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
                        <div className={`pd-timeline-dot log-icon-container anamnese ${index === 0 ? 'recente' : ''}`}>
                          <span className="pd-log-icon icon-mercurio">☿</span>
                        </div>
                        {index < anamneses.length - 1 && <div className="pd-timeline-line"></div>}
                      </div>

                      {/* Conteúdo da anamnese */}
                      <div className="pd-timeline-content anamnese" onClick={() => setExpandido(expandido === 'anam_' + anam.id ? null : 'anam_' + anam.id)}>
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
                                Excluir
                              </button>
                            )}
                            <button 
                              className="pd-btn-editar"
                              onClick={(e) => { e.stopPropagation(); navigate(`/anamnese/${id}?editar=${anam.id}`); }}
                              title="Editar esta anamnese"
                            >
                              Editar
                            </button>
                            <button 
                              className="pd-btn-pdf"
                              onClick={(e) => { e.stopPropagation(); exportarAnamnese(anam); }}
                              disabled={exportandoPdf === 'anam_' + anam.id}
                              title="Exportar anamnese como PDF com hash SHA-256"
                            >
                              {exportandoPdf === 'anam_' + anam.id ? 'Exportando...' : 'PDF'}
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
                  Log de Alterações
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#64748b', fontWeight: 'normal' }}>
                    <input 
                      type="checkbox" 
                      checked={mostrarVisualizacoes} 
                      onChange={(e) => setMostrarVisualizacoes(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    Mostrar acessos de leitura
                  </label>
                  <span className="pd-contagem">{formatarContagem(gruposLog.length)} evento{gruposLog.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {gruposLog.length === 0 ? (
                <div className="pd-vazio">
                  <p>Nenhuma alteração registrada ainda.</p>
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
                                por <strong>{p.usuario_nome}</strong> ({p.usuario_role})
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
                    height: 'auto'
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
                          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', animation: 'pd-fadeIn 0.25s ease' }}>
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
                                por <strong>{bloco.usuario_nome}</strong> ({bloco.usuario_role})
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
