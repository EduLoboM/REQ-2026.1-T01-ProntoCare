import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api';
import { criarBlocoGenesis, criarBlocoExportacao, validarCadeia } from '../../services/blockchainService';
import { exportarProntuarioPDF, exportarAnamnesePDF, exportarReceitaPDF } from '../../services/pdfExportService';
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

  // RF08: Estado de anexos do paciente
  const [anexos, setAnexos] = useState([]);
  const [visualizandoAnexo, setVisualizandoAnexo] = useState(null);
  const [carregandoArquivo, setCarregandoArquivo] = useState(false);

  // RF15/RF17/RF19: Estado de receitas
  const [receitas, setReceitas] = useState([]);
  const [emitindoReceitaId, setEmitindoReceitaId] = useState(null);

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function carregarDados() {
    try {
      const [pac, hist, anams, logData, chain, anxs, recs] = await Promise.all([
        api.get(`/pacientes/${id}`),
        api.get(`/atendimentos/paciente/${id}`),
        api.get(`/anamneses/paciente/${id}`),
        api.get(`/logs/paciente/${id}`),
        api.get(`/blockchain/paciente/${id}`),
        api.get(`/anexos/paciente/${id}`),
        api.get(`/receitas/paciente/${id}`)
      ]);
      setPaciente(pac);
      setAtendimentos(hist);
      setAnamneses(anams);
      setLogs(logData);
      setBlockchain(chain || []);
      setAnexos(anxs || []);
      setReceitas(recs || []);
    } catch (err) {
      console.error(err);
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

  // RF08: Visualizar ou baixar o anexo
  async function visualizarAnexo(anexoId) {
    setCarregandoArquivo(true);
    try {
      const detalhe = await api.get(`/anexos/${anexoId}`);
      setVisualizandoAnexo(detalhe);
    } catch (err) {
      alert('Erro ao recuperar o arquivo: ' + err.message);
    } finally {
      setCarregandoArquivo(false);
    }
  }

  // Baixar o arquivo do anexo como download
  async function baixarAnexo(anexoId, nomeArquivo) {
    setCarregandoArquivo(true);
    try {
      const detalhe = await api.get(`/anexos/${anexoId}`);
      if (detalhe && detalhe.conteudo_base64) {
        const byteCharacters = atob(detalhe.conteudo_base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: detalhe.mime_type || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo || 'anexo';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('Arquivo não encontrado ou sem conteúdo.');
      }
    } catch (err) {
      alert('Erro ao baixar o arquivo: ' + err.message);
    } finally {
      setCarregandoArquivo(false);
    }
  }

  // RF08: Excluir o anexo
  async function excluirAnexo(anexoId) {
    const confirmar = window.confirm(
      'ATENÇÃO: Pela Lei nº 13.787/2018, documentos anexados ao histórico clínico devem ser mantidos por no mínimo 20 anos.\n\nDeseja excluir este anexo?'
    );
    if (!confirmar) return;

    try {
      await api.delete(`/anexos/${anexoId}`);
      alert('Anexo excluído com sucesso.');
      // Recarrega anexos e logs
      const anxs = await api.get(`/anexos/paciente/${id}`);
      setAnexos(anxs || []);
      const logData = await api.get(`/logs/paciente/${id}`);
      setLogs(logData);
    } catch (err) {
      alert(err.message || 'Erro ao excluir the anexo.');
    }
  }

  // RF17: Emitir receita PDF com hash SHA-256 e registro na blockchain
  async function emitirReceitaPDF(receita) {
    if (emitindoReceitaId) return;
    setEmitindoReceitaId(receita.id);
    try {
      const receitaCompleta = await api.get(`/receitas/${receita.id}`);
      const medico = {
        nome: receitaCompleta.medico_nome,
        crm: receitaCompleta.medico_crm,
        especialidade: receitaCompleta.medico_especialidade
      };
      const pac = {
        nome: receitaCompleta.paciente_nome,
        cpf: receitaCompleta.paciente_cpf,
        data_nascimento: receitaCompleta.paciente_nascimento,
        sexo: receitaCompleta.paciente_sexo
      };

      // 1. Buscar último bloco da cadeia (ou criar gênesis)
      let ultimoBlocoResp = await api.get(`/blockchain/paciente/${id}/ultimo`);
      
      if (!ultimoBlocoResp) {
        const genesis = await criarBlocoGenesis();
        ultimoBlocoResp = await api.post('/blockchain', {
          paciente_id: parseInt(id),
          ...genesis,
        });
      }

      // 2. Determinar versão do documento
      const blocosDoDoc = (blockchain || []).filter(
        b => b.entidade === 'receita' && b.entidade_id === receita.id
      );
      const versao = blocosDoDoc.length + 1;

      // 3. Gerar dados canônicos para hash
      const dadosReceita = {
        id: receita.id,
        paciente_id: receita.paciente_id,
        medico_id: receita.medico_id,
        medicamentos: receita.medicamentos,
        observacoes: receita.observacoes,
        criado_em: receita.criado_em,
      };

      // 4. Criar novo bloco na blockchain
      const novoBloco = await criarBlocoExportacao({
        blocoAnterior: ultimoBlocoResp,
        entidade: 'receita',
        entidade_id: receita.id,
        versao,
        dadosProntuario: dadosReceita,
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
      await exportarReceitaPDF({
        receita: receitaCompleta,
        paciente: pac,
        medico,
        blocoBlockchain: blocoSalvo,
      });

      // 7. Sincronizar com a cadeia local
      setBlockchain(prev => [...prev, blocoSalvo]);

      alert(`PDF da Prescrição exportado com sucesso!\n\nHash SHA-256: ${novoBloco.dados_hash.substring(0, 16)}...\nBloco #${novoBloco.indice} registrado na blockchain.`);
    } catch (err) {
      console.error(err);
      // Fallback
      try {
        const medicoFallback = {
          nome: localStorage.getItem('userName') || 'Médico',
          crm: localStorage.getItem('userCrm') || '',
          especialidade: localStorage.getItem('userEspecialidade') || ''
        };
        await exportarReceitaPDF({
          receita,
          paciente,
          medico: medicoFallback
        });
      } catch (fallbackErr) {
        console.error('Erro no fallback:', fallbackErr);
        alert('Erro ao exportar PDF: ' + (err.message || 'Erro desconhecido'));
      }
    } finally {
      setEmitindoReceitaId(null);
    }
  }

  // Excluir receita (validação de 20 anos)
  async function handleExcluirReceita(receitaId) {
    const confirmar = window.confirm(
      'ATENÇÃO: Pela Lei nº 13.787/2018, receitas médicas devem ser mantidas por no mínimo 20 anos.\n\nDeseja realmente excluir esta receita?'
    );
    if (!confirmar) return;

    try {
      await api.delete(`/receitas/${receitaId}`);
      alert('Receita excluída com sucesso.');
      const recs = await api.get(`/receitas/paciente/${id}`);
      setReceitas(recs || []);
      const logData = await api.get(`/logs/paciente/${id}`);
      setLogs(logData);
    } catch (err) {
      alert(err.message || 'Erro ao excluir a receita.');
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
      verificacao: { icon: '♃', label: 'Integridade', cor: 'log-verificacao' },
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
    if (simbolo === '♃') return 'icon-jupiter';
    return '';
  }

  function mapEntidade(ent) {
    if (ent === 'paciente') return 'Cadastro';
    if (ent === 'atendimento') return 'Prontuário';
    if (ent === 'anamnese') return 'Anamnese';
    if (ent === 'blockchain') return 'Blockchain';
    if (ent === 'receita') return 'Receita';
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
          {localStorage.getItem('role') === 'medico' && (
            <>
              <button className="pd-btn-primario" onClick={() => navigate(`/atendimento/${id}`)}>
                + Novo Prontuário
              </button>
              <button className="pd-btn-primario" onClick={() => navigate(`/anamnese/${id}`)}>
                + Nova Anamnese
              </button>
              <button className="pd-btn-primario" onClick={() => navigate(`/prescricao/${id}`)}>
                + Nova Prescrição
              </button>
              <button className="pd-btn-primario" onClick={() => navigate(`/anexo/${id}`)}>
                + Novo Anexo
              </button>
            </>
          )}
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
              className={`pd-tab ${abaAtiva === 'receitas' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('receitas')}
            >
              Prescrições ({receitas.length})
            </button>
            <button 
              className={`pd-tab ${abaAtiva === 'anexos' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('anexos')}
            >
              Anexos ({anexos.length})
            </button>
            <button 
              className={`pd-tab ${abaAtiva === 'integridade' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('integridade')}
            >
              Integridade ({blockchain.length})
            </button>
            <button 
              className={`pd-tab ${abaAtiva === 'logs' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('logs')}
            >
              Log de Alterações ({logs.length})
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
                        <div className={`pd-timeline-dot log-icon-container ${index === 0 ? 'prontuario recente' : ''}`}>
                          <span className="pd-log-icon icon-sal">🜔</span>
                        </div>
                        {index < atendimentos.length - 1 && <div className="pd-timeline-line"></div>}
                      </div>

                      {/* Conteúdo do atendimento */}
                      <div className={`pd-timeline-content prontuario ${index === 0 ? 'recente' : ''}`} onClick={() => setExpandido(expandido === at.id ? null : at.id)}>
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
                        <div className={`pd-timeline-dot log-icon-container ${index === 0 ? 'anamnese recente' : ''}`}>
                          <span className="pd-log-icon icon-sal">🜔</span>
                        </div>
                        {index < anamneses.length - 1 && <div className="pd-timeline-line"></div>}
                      </div>

                      {/* Conteúdo da anamnese */}
                      <div className={`pd-timeline-content anamnese ${index === 0 ? 'recente' : ''}`} onClick={() => setExpandido(expandido === 'anam_' + anam.id ? null : 'anam_' + anam.id)}>
                        <div className="pd-timeline-header">
                          <div className="pd-timeline-info">
                            <span className="pd-timeline-data">{formatarDataHora(anam.criado_em)}</span>
                            <span className="pd-timeline-medico">Dr(a). {anam.medico_nome}</span>
                          </div>
                          <div className="pd-timeline-acoes">
                            <button 
                              className="pd-btn-pdf"
                              onClick={(e) => { e.stopPropagation(); exportarAnamnese(anam); }}
                              disabled={exportandoPdf === 'anam_' + anam.id}
                              title="Exportar anamnese como PDF com hash SHA-256"
                            >
                              {exportandoPdf === 'anam_' + anam.id ? 'Exportando...' : 'PDF'}
                            </button>
                            {localStorage.getItem('role') === 'medico' && (
                              <button 
                                className="pd-btn-editar"
                                onClick={(e) => { e.stopPropagation(); navigate(`/anamnese/${id}?editar=${anam.id}`); }}
                                title="Editar esta anamnese"
                              >
                                Editar
                              </button>
                            )}
                            {localStorage.getItem('role') === 'medico' && podeExcluir(anam.criado_em) && (
                              <button 
                                className="pd-btn-excluir"
                                onClick={(e) => { e.stopPropagation(); excluirAnamnese(anam.id, e); }}
                                title="Excluir esta anamnese permanentemente (Legislação de 20 anos)"
                              >
                                Excluir
                              </button>
                            )}
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
                                {bloco.entidade === 'atendimento' ? 'Prontuário' : bloco.entidade === 'receita' ? 'Prescrição' : 'Anamnese'} #{bloco.entidade_id}
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

          {/* === ABA: ANEXOS (DOCUMENTOS E EXAMES) === */}
          {abaAtiva === 'anexos' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  Anexos e Exames do Paciente
                </h3>
                <span className="pd-contagem">{anexos.length} arquivo{anexos.length !== 1 ? 's' : ''}</span>
              </div>



              {/* Lista de Anexos */}
              {anexos.length === 0 ? (
                <div className="pd-vazio">
                  <p>Nenhum documento anexado ao prontuário deste paciente.</p>
                </div>
              ) : (
                <div className="pd-timeline">
                  {anexos.map((anx, index) => {
                    const isPDF = anx.mime_type.includes('pdf');
                    const tamanhoKB = (anx.tamanho_bytes / 1024).toFixed(1);

                    return (
                      <div key={anx.id} className="pd-timeline-item">
                        <div className="pd-timeline-marker">
                          <div className={`pd-timeline-dot log-icon-container ${isPDF ? 'log-exclusao' : 'log-visualizacao'} ${index === 0 ? 'recente' : ''}`}>
                            <span className={`pd-log-icon ${isPDF ? 'icon-chofre' : 'icon-lua'}`}>{isPDF ? '🜍' : '☽'}</span>
                          </div>
                          {index < anexos.length - 1 && <div className="pd-timeline-line"></div>}
                        </div>

                        <div className={`pd-timeline-content prontuario ${index === 0 ? 'recente' : ''}`} style={{ padding: '12px 16px' }}>
                          <div className="pd-timeline-header" style={{ marginBottom: 0 }}>
                            <div className="pd-timeline-info">
                              <span className="pd-timeline-data" style={{ fontWeight: '600', color: 'var(--text-heading)', fontSize: '14.5px' }}>
                                {anx.nome_arquivo}
                              </span>
                              <span className="pd-timeline-medico" style={{ fontSize: '12.5px' }}>
                                Tamanho: {tamanhoKB} KB • Tipo: {anx.mime_type} • Enviado por Dr(a). {anx.medico_nome} em {formatarDataHora(anx.criado_em)}
                                {anx.atendimento_data && (
                                  <strong style={{ color: 'var(--primary)', marginLeft: '8px' }}>
                                    (Vinculado à Consulta de {formatarDataHora(anx.atendimento_data)})
                                  </strong>
                                )}
                              </span>
                            </div>
                            <div className="pd-timeline-acoes" style={{ gap: '8px' }}>
                              <button 
                                className="pd-btn-pdf" 
                                onClick={() => baixarAnexo(anx.id, anx.nome_arquivo)}
                                disabled={carregandoArquivo}
                                title="Baixar este anexo"
                              >
                                {carregandoArquivo ? 'Baixando...' : 'Baixar'}
                              </button>
                              {podeExcluir(anx.criado_em) && (
                                <button 
                                  className="pd-btn-excluir"
                                  onClick={() => excluirAnexo(anx.id)}
                                  title="Excluir este anexo permanentemente (Legislação de 20 anos)"
                                >
                                  Excluir
                                </button>
                              )}
                              <button 
                                className="pd-btn-editar" 
                                onClick={() => visualizarAnexo(anx.id)}
                                disabled={carregandoArquivo}
                                title="Visualizar este anexo"
                              >
                                {carregandoArquivo ? 'Carregando...' : 'Visualizar'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Modal / Visualizador de Anexo */}
              {visualizandoAnexo && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 100000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px'
                }} onClick={() => setVisualizandoAnexo(null)}>
                  <div style={{
                    background: 'white',
                    width: '900px',
                    maxWidth: '95vw',
                    height: '80vh',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-lg)'
                  }} onClick={e => e.stopPropagation()}>
                    <header style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <h3 style={{ margin: 0 }}>Visualizando: {visualizandoAnexo.nome_arquivo}</h3>
                      <button 
                        className="btn-danger" 
                        onClick={() => setVisualizandoAnexo(null)}
                        style={{ height: '32px', padding: '0 12px' }}
                      >
                        Fechar
                      </button>
                    </header>
                    <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
                      {visualizandoAnexo.mime_type.includes('pdf') ? (
                        <iframe 
                          src={`data:${visualizandoAnexo.mime_type};base64,${visualizandoAnexo.dados_base64}`} 
                          title={visualizandoAnexo.nome_arquivo} 
                          style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                      ) : (
                        <img 
                          src={`data:${visualizandoAnexo.mime_type};base64,${visualizandoAnexo.dados_base64}`} 
                          alt={visualizandoAnexo.nome_arquivo} 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === ABA: PRESCRIÇÕES === */}
          {abaAtiva === 'receitas' && (
            <div className="pd-card">
              <div className="pd-card-header-row">
                <h3 className="pd-card-title">
                  Histórico de Prescrições
                </h3>
                <span className="pd-contagem">{receitas.length} receita{receitas.length !== 1 ? 's' : ''}</span>
              </div>



              {/* Lista de Receitas */}
              {receitas.length === 0 ? (
                <div className="pd-vazio">
                  <p>Nenhuma receita médica prescrita para este paciente.</p>
                </div>
              ) : (
                <div className="pd-timeline">
                  {receitas.map((rec, index) => (
                    <div key={rec.id} className={`pd-timeline-item ${expandido === 'receita_' + rec.id ? 'expandido' : ''}`}>
                      {/* Linha da timeline */}
                      <div className="pd-timeline-marker">
                        <div className={`pd-timeline-dot log-icon-container ${index === 0 ? 'prontuario recente' : ''}`}>
                          <span className="pd-log-icon icon-sal">🜔</span>
                        </div>
                        {index < receitas.length - 1 && <div className="pd-timeline-line"></div>}
                      </div>

                      {/* Conteúdo da receita */}
                      <div className={`pd-timeline-content prontuario ${index === 0 ? 'recente' : ''}`} onClick={() => setExpandido(expandido === 'receita_' + rec.id ? null : 'receita_' + rec.id)}>
                        <div className="pd-timeline-header">
                          <div className="pd-timeline-info">
                            <span className="pd-timeline-data">{formatarDataHora(rec.criado_em)}</span>
                            <span className="pd-timeline-medico">Prescrito por Dr(a). {rec.medico_nome || 'Médico'}</span>
                          </div>
                          <div className="pd-timeline-acoes">
                            <button
                              className="pd-btn-pdf"
                              onClick={(e) => { e.stopPropagation(); emitirReceitaPDF(rec); }}
                              disabled={emitindoReceitaId === rec.id}
                              title="Exportar prescrição como PDF com hash SHA-256"
                            >
                              {emitindoReceitaId === rec.id ? 'Exportando...' : 'PDF'}
                            </button>
                            {localStorage.getItem('role') === 'medico' && (
                              <button
                                className="pd-btn-editar"
                                onClick={(e) => { e.stopPropagation(); navigate(`/prescricao/${id}?editar=${rec.id}`); }}
                                title="Editar esta prescrição"
                              >
                                Editar
                              </button>
                            )}
                            {localStorage.getItem('role') === 'medico' && podeExcluir(rec.criado_em) && (
                              <button
                                className="pd-btn-excluir"
                                onClick={(e) => { e.stopPropagation(); handleExcluirReceita(rec.id); }}
                                title="Excluir esta prescrição permanentemente (Legislação de 20 anos)"
                              >
                                Excluir
                              </button>
                            )}
                            <span className="pd-expand-icon">{expandido === 'receita_' + rec.id ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {/* Conteúdo resumido/completo */}
                        <p className="pd-timeline-resumo" style={{ whiteSpace: 'pre-wrap' }}>
                          {expandido === 'receita_' + rec.id ? rec.medicamentos : (rec.medicamentos.substring(0, 150) + (rec.medicamentos.length > 150 ? '...' : ''))}
                        </p>

                        {expandido === 'receita_' + rec.id && rec.observacoes && (
                          <div className="pd-soap-detalhes">
                            <div className="pd-soap-bloco">
                              <h4>Observações</h4>
                              <p style={{ whiteSpace: 'pre-wrap' }}>{rec.observacoes}</p>
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
        </main>
      </div>
    </div>
  );
}
