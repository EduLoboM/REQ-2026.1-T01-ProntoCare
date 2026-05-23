import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../api';
import './styles.css';

export default function Anamnese() {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [searchParams] = useSearchParams();
  const editarId = searchParams.get('editar');

  const [sidebarAberto, setSidebarAberto] = useState(true);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const [paciente, setPaciente] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [conteudo, setConteudo] = useState('');

  useEffect(() => {
    carregarDados();
  }, [pacienteId, editarId]);

  async function carregarDados() {
    try {
      const [pac, hist] = await Promise.all([
        api.get(`/pacientes/${pacienteId}`),
        api.get(`/anamneses/paciente/${pacienteId}`)
      ]);
      setPaciente(pac);
      setHistorico(hist);

      if (editarId) {
        const anamnese = await api.get(`/anamneses/${editarId}`);
        setConteudo(anamnese.conteudo || '');
      }
    } catch (err) {
      alert('Erro ao carregar dados do paciente ou anamnese.');
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

    if (!conteudo || !conteudo.trim()) {
      alert("Preencha o conteúdo da anamnese antes de salvar.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        paciente_id: parseInt(pacienteId),
        conteudo: conteudo.trim()
      };

      if (editarId) {
        await api.put(`/anamneses/${editarId}`, payload);
        alert('Anamnese atualizada com sucesso!');
      } else {
        await api.post('/anamneses', payload);
        alert('Anamnese salva com sucesso!');
      }
      navigate(`/paciente-detalhe/${pacienteId}`);
    } catch (err) {
      alert(err.message || 'Erro ao salvar anamnese.');
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
      {/* Barra Lateral: Histórico de Anamneses */}
      <aside className={`historico-sidebar ${sidebarAberto ? 'aberta' : 'fechada'}`}>
        <div className="sidebar-header">
          <button onClick={() => navigate(`/paciente-detalhe/${pacienteId}`)} className="btn-voltar">
            ← Voltar ao Perfil
          </button>
          <h3>Histórico de Anamneses</h3>
        </div>

        <div className="historico-lista">
          {historico.length === 0 ? (
            <p style={{ color: '#7f8c8d', fontSize: 14 }}>Nenhum registro anterior.</p>
          ) : (
            historico.map(anam => (
              <div key={anam.id} className="historico-card">
                <div className="timeline-dot"></div>
                <span className="historico-data">{formatarDataHora(anam.criado_em)}</span>
                <p className="historico-resumo">
                  {anam.conteudo.substring(0, 100) + (anam.conteudo.length > 100 ? '...' : '')}
                </p>
              </div>
            ))
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
          <div className="status-badge">{editarId ? 'Editando Anamnese' : 'Nova Anamnese'}</div>
        </header>

        <form onSubmit={handleFinalizar} className="soap-form">
          <div className="form-header">
            <h3>{editarId ? 'EDITAR ANAMNESE' : 'REGISTRO DE ANAMNESE'}</h3>
          </div>

          <div className="anamnese-textarea-group">
            <label>Conteúdo da Anamnese <span>(Histórico de sintomas, hábitos, antecedentes familiares e queixa principal)</span></label>
            <textarea
              value={conteudo}
              onChange={e => setConteudo(e.target.value)}
              placeholder="Digite aqui o registro detalhado da anamnese..."
            />
          </div>

          <div className="form-actions-bottom">
            <button type="button" className="btn-cancelar" onClick={() => navigate(`/paciente-detalhe/${pacienteId}`)}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-finalizar">
              {loading ? 'Salvando...' : (editarId ? 'Salvar Alterações' : 'Salvar Anamnese')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
