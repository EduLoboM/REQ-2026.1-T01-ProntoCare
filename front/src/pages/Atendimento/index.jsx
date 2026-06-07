import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../api';
import './styles.css';
import '../PacienteDetalhe/styles.css';

export default function Atendimento() {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [searchParams] = useSearchParams();
  const editarId = searchParams.get('editar');

  // Controla a visibilidade da barra lateral para expandir a área de digitação (Modo Foco)
  const [sidebarAberto, setSidebarAberto] = useState(true);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const [paciente, setPaciente] = useState(null);
  const [historico, setHistorico] = useState([]);

  // Armazena os dados do atendimento clínico atual baseados na metodologia SOAP
  const [soap, setSoap] = useState({
    peso: '', altura: '', subjetivo: '', objetivo: '', avaliacao: '', plano: ''
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        const [pac, hist] = await Promise.all([
          api.get(`/pacientes/${pacienteId}`),
          api.get(`/atendimentos/paciente/${pacienteId}`)
        ]);
        setPaciente(pac);
        setHistorico(hist);

        // Se estiver editando, carrega os dados do atendimento existente
        if (editarId) {
          const atendimento = await api.get(`/atendimentos/${editarId}`);
          setSoap({
            peso: atendimento.peso || '',
            altura: atendimento.altura || '',
            subjetivo: atendimento.subjetivo || '',
            objetivo: atendimento.objetivo || '',
            avaliacao: atendimento.avaliacao || '',
            plano: atendimento.plano || ''
          });
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados do paciente.');
        navigate('/medico');
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId, editarId]);

  function calcularIdade(dataNasc) {
    if (!dataNasc) return '—';
    const nascimento = new Date(dataNasc);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  }

  function mapSexo(s) {
    if (s === 'M') return 'Masculino';
    if (s === 'F') return 'Feminino';
    if (s === 'O') return 'Outro';
    return '—';
  }

  function formatarDataHora(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' às '
      + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  async function handleFinalizar(e) {
    e.preventDefault();

    // Impede o envio de prontuários inteiramente em branco para a base de dados
    if (!soap.subjetivo && !soap.objetivo && !soap.avaliacao && !soap.plano) {
      alert("Preencha pelo menos um campo clínico para salvar o prontuário.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        paciente_id: parseInt(pacienteId),
        peso: soap.peso || null,
        altura: soap.altura || null,
        subjetivo: soap.subjetivo || null,
        objetivo: soap.objetivo || null,
        avaliacao: soap.avaliacao || null,
        plano: soap.plano || null
      };

      if (editarId) {
        await api.put(`/atendimentos/${editarId}`, payload);
        alert('Prontuário atualizado com sucesso!');
      } else {
        await api.post('/atendimentos', payload);
        alert('Prontuário assinado e salvo com sucesso!');
      }
      navigate(`/paciente-detalhe/${pacienteId}`);
    } catch (err) {
      alert(err.message || 'Erro ao salvar prontuário.');
    } finally {
      setLoading(false);
    }
  }

  if (carregando) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Carregando...</div>;
  }

  if (!paciente) return null;

  // Último IMC registrado
  const ultimoImc = historico.find(a => a.imc)?.imc;

  return (
    <div className="atendimento-layout">

      {/* Barra Lateral: Exibe o histórico de consultas passadas para contexto do médico */}
      <aside className={`historico-sidebar ${sidebarAberto ? 'aberta' : 'fechada'}`}>
        <div className="sidebar-header">
          <button onClick={() => navigate(`/paciente-detalhe/${pacienteId}`)} className="btn-voltar">
            ← Voltar ao Perfil
          </button>
          <h3>Histórico Clínico</h3>
        </div>

        <div className="historico-lista" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
          {historico.length === 0 ? (
            <p style={{ color: '#7f8c8d', fontSize: 14 }}>Nenhum registro anterior.</p>
          ) : (
            <div className="pd-timeline">
              {historico.map((consulta, index) => (
                <div key={consulta.id} className="pd-timeline-item">
                  <div className="pd-timeline-marker">
                    <div className={`pd-timeline-dot log-icon-container ${index === 0 ? 'prontuario recente' : ''}`}>
                      <span className="pd-log-icon icon-sal">🜔</span>
                    </div>
                    {index < historico.length - 1 && <div className="pd-timeline-line"></div>}
                  </div>
                  <div className={`pd-timeline-content prontuario ${index === 0 ? 'recente' : ''}`} style={{ padding: '12px 16px' }}>
                    <div className="pd-timeline-header" style={{ marginBottom: 0 }}>
                      <div className="pd-timeline-info">
                        <span className="pd-timeline-data" style={{ fontWeight: '600', color: 'var(--text-heading)', fontSize: '14.5px' }}>
                          {formatarDataHora(consulta.criado_em)}
                        </span>
                        <span className="pd-timeline-medico" style={{ fontSize: '12.5px' }}>
                          Dr(a). {consulta.medico_nome || 'Médico'}
                        </span>
                      </div>
                    </div>
                    <p className="pd-timeline-resumo" style={{ marginTop: '8px', fontSize: '13px' }}>
                      {consulta.avaliacao
                        ? consulta.avaliacao.substring(0, 100) + (consulta.avaliacao.length > 100 ? '...' : '')
                        : consulta.subjetivo
                          ? consulta.subjetivo.substring(0, 100) + (consulta.subjetivo.length > 100 ? '...' : '')
                          : 'Registro clínico'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="atendimento-main">

        {/* Cabeçalho Fixo: Mantém os dados demográficos vitais visíveis durante a rolagem */}
        <header className="patient-banner">
          <div className="patient-info-container">
            <button
              type="button"
              className="btn-toggle-sidebar"
              onClick={() => setSidebarAberto(!sidebarAberto)}
              title="Alternar Histórico"
            >
              ☰
            </button>
            <div className="patient-info">
              <h2>{paciente.nome}</h2>
              <span>
                {calcularIdade(paciente.data_nascimento)} anos • Sexo {mapSexo(paciente.sexo)}
                {ultimoImc && ` • IMC Ant: ${ultimoImc}`}
              </span>
            </div>
          </div>
          <div className="status-badge">{editarId ? 'Editando Prontuário' : 'Novo Atendimento'}</div>
        </header>

        <form onSubmit={handleFinalizar} className="soap-form">
          <div className="form-header">
            <h3>{editarId ? 'Editar Prontuário (SOAP)' : 'Registro de Evolução (SOAP)'}</h3>
          </div>

          {/* O layout grid 2x2 distribui os 4 blocos principais do SOAP uniformemente */}
          <div className="soap-grid">

            <div className="soap-group">
              <label>S - Subjetivo <span>(Queixas e histórico relatado)</span></label>
              <textarea
                value={soap.subjetivo} onChange={e => setSoap({ ...soap, subjetivo: e.target.value })}
                placeholder="Ex: Paciente queixa-se de tosse produtiva e febre há 3 dias..."
              />
            </div>

            <div className="soap-group">
              <label>O - Objetivo <span>(Sinais Vitais e Exame Físico)</span></label>

              {/* Entradas estruturadas para facilitar cálculos de IMC ou gráficos no futuro */}
              <div className="sinais-vitais-row">
                <div className="input-group-pequeno">
                  <input type="number" step="0.1" value={soap.peso} onChange={e => setSoap({ ...soap, peso: e.target.value })} placeholder="Peso (kg)" />
                </div>
                <div className="input-group-pequeno">
                  <input type="number" step="0.01" value={soap.altura} onChange={e => setSoap({ ...soap, altura: e.target.value })} placeholder="Altura (m)" />
                </div>
              </div>

              <textarea
                value={soap.objetivo} onChange={e => setSoap({ ...soap, objetivo: e.target.value })}
                placeholder="Ex: FEBRE: 38.5°C. PULSO: 92 bpm. Garganta hiperemiada..."
              />
            </div>

            <div className="soap-group">
              <label>A - Avaliação <span>(Hipótese Diagnóstica)</span></label>
              <textarea
                value={soap.avaliacao} onChange={e => setSoap({ ...soap, avaliacao: e.target.value })}
                placeholder="Ex: Hipótese: Amigdalite Bacteriana Aguda..."
              />
            </div>

            <div className="soap-group">
              <label>P - Plano <span>(Conduta, Exames e Prescrições)</span></label>
              <textarea
                value={soap.plano} onChange={e => setSoap({ ...soap, plano: e.target.value })}
                placeholder="Ex: Prescrito Amoxicilina 500mg. Repouso..."
              />
            </div>

          </div>

          <div className="form-actions-bottom">
            <button type="button" className="btn-cancelar" onClick={() => navigate(`/paciente-detalhe/${pacienteId}`)}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-finalizar">
              {loading ? 'Salvando...' : (editarId ? 'Salvar Alterações' : 'Finalizar Atendimento')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}