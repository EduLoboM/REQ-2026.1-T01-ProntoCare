import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../api';
import '../Anamnese/styles.css'; // Reuse existing theme and layout styles
import '../PacienteDetalhe/styles.css';

export default function Prescricao() {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [searchParams] = useSearchParams();
  const editarId = searchParams.get('editar');

  const [sidebarAberto, setSidebarAberto] = useState(true);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const [paciente, setPaciente] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [medicamentos, setMedicamentos] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    async function carregarDados() {
      try {
        const [pac, hist] = await Promise.all([
          api.get(`/pacientes/${pacienteId}`),
          api.get(`/receitas/paciente/${pacienteId}`)
        ]);
        setPaciente(pac);
        setHistorico(hist || []);

        if (editarId) {
          const receita = await api.get(`/receitas/${editarId}`);
          setMedicamentos(receita.medicamentos || '');
          setObservacoes(receita.observacoes || '');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados do paciente ou histórico de prescrições.');
        navigate('/medico');
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [pacienteId, editarId, navigate]);

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

    if (!medicamentos || !medicamentos.trim()) {
      alert("Por favor, preencha os medicamentos prescritos.");
      return;
    }

    setLoading(true);

    try {
      if (editarId) {
        await api.put(`/receitas/${editarId}`, {
          medicamentos: medicamentos.trim(),
          observacoes: observacoes.trim() || null
        });
        alert('Receita digital atualizada com sucesso!');
      } else {
        await api.post('/receitas', {
          paciente_id: parseInt(pacienteId),
          medicamentos: medicamentos.trim(),
          observacoes: observacoes.trim() || null
        });
        alert('Receita digital elaborada com sucesso!');
      }

      navigate(`/paciente-detalhe/${pacienteId}`);
    } catch (err) {
      alert(err.message || 'Erro ao salvar receita.');
    } finally {
      setLoading(false);
    }
  }

  if (carregando) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Carregando...</div>;
  }

  if (!paciente) return null;

  return (
    <div className="atendimento-layout">
      {/* Barra Lateral: Histórico de Receitas */}
      <aside className={`historico-sidebar ${sidebarAberto ? 'aberta' : 'fechada'}`}>
        <div className="sidebar-header">
          <button onClick={() => navigate(`/paciente-detalhe/${pacienteId}`)} className="btn-voltar">
            ← Voltar ao Perfil
          </button>
          <h3>Prescrições Anteriores</h3>
        </div>

        <div className="historico-lista" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
          {historico.length === 0 ? (
            <p style={{ color: '#7f8c8d', fontSize: 14 }}>Nenhuma receita anterior prescrita.</p>
          ) : (
            <div className="pd-timeline">
              {historico.map((rec, index) => (
                <div key={rec.id} className="pd-timeline-item">
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
                          {formatarDataHora(rec.criado_em)}
                        </span>
                        <span className="pd-timeline-medico" style={{ fontSize: '12.5px' }}>
                          Prescrito por Dr(a). {rec.medico_nome || 'Médico'}
                        </span>
                      </div>
                    </div>
                    <p className="pd-timeline-resumo" style={{ whiteSpace: 'pre-wrap', marginTop: '8px', fontSize: '13px' }}>
                      {rec.medicamentos.substring(0, 100) + (rec.medicamentos.length > 100 ? '...' : '')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="atendimento-main">
        {/* Banner do Paciente */}
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
              </span>
            </div>
          </div>
          <div className="status-badge" style={{ background: 'var(--primary)', color: 'white' }}>{editarId ? 'Editando Prescrição' : 'Nova Prescrição'}</div>
        </header>

        <form onSubmit={handleFinalizar} className="soap-form">
          <div className="form-header">
            <h3>{editarId ? 'Editar Receita Médica Digital' : 'Elaborar Receita Médica Digital'}</h3>
          </div>

          <div className="soap-grid">
            <div className="soap-group">
              <label>Medicamentos e Instruções de Uso *</label>
              <textarea
                required
                rows={6}
                value={medicamentos}
                onChange={e => setMedicamentos(e.target.value)}
                placeholder="Ex:&#10;1. Dipirona 500mg - Tomar 1 comprimido via oral de 6 em 6 horas se dor ou febre.&#10;2. Amoxicilina 500mg - Tomar 1 cápsula via oral de 8 em 8 horas por 7 dias."
              />
            </div>

            <div className="soap-group">
              <label>Observações Adicionais (Opcional)</label>
              <textarea
                rows={3}
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Ex: Repouso por 2 dias. Retornar se sintomas persistirem."
              />
            </div>
          </div>

          <div className="form-actions-bottom">
            <button type="button" className="btn-cancelar" onClick={() => navigate(`/paciente-detalhe/${pacienteId}`)}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-finalizar">
              {loading ? 'Salvando...' : (editarId ? 'Salvar Alterações' : 'Salvar Receita')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
