import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../api';
import { exportarReceitaPDF } from '../../services/pdfExportService';
import { criarBlocoGenesis, criarBlocoExportacao } from '../../services/blockchainService';
import '../Anamnese/styles.css'; // Reuse existing theme and layout styles

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
      let response;
      if (editarId) {
        response = await api.put(`/receitas/${editarId}`, {
          medicamentos: medicamentos.trim(),
          observacoes: observacoes.trim() || null
        });
        alert('Receita digital atualizada com sucesso!');
      } else {
        response = await api.post('/receitas', {
          paciente_id: parseInt(pacienteId),
          medicamentos: medicamentos.trim(),
          observacoes: observacoes.trim() || null
        });
        alert('Receita digital elaborada com sucesso!');
      }

      // Fluxo de Emissão Automática de PDF com Blockchain
      if (response && response.id) {
        try {
          const receitaCompleta = await api.get(`/receitas/${response.id}`);
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
          let ultimoBlocoResp = await api.get(`/blockchain/paciente/${pacienteId}/ultimo`);
          if (!ultimoBlocoResp) {
            const genesis = await criarBlocoGenesis();
            ultimoBlocoResp = await api.post('/blockchain', {
              paciente_id: parseInt(pacienteId),
              ...genesis,
            });
          }

          // 2. Determinar versão para a blockchain
          const chain = await api.get(`/blockchain/paciente/${pacienteId}`);
          const blocosDoDoc = (chain || []).filter(
            b => b.entidade === 'receita' && b.entidade_id === receitaCompleta.id
          );
          const versao = blocosDoDoc.length + 1;

          // 3. Criar novo bloco de exportação
          const novoBloco = await criarBlocoExportacao({
            blocoAnterior: ultimoBlocoResp,
            entidade: 'receita',
            entidade_id: receitaCompleta.id,
            versao,
            dadosProntuario: {
              id: receitaCompleta.id,
              paciente_id: receitaCompleta.paciente_id,
              medico_id: receitaCompleta.medico_id,
              medicamentos: receitaCompleta.medicamentos,
              observacoes: receitaCompleta.observacoes,
              criado_em: receitaCompleta.criado_em,
            },
            pdfHash: null,
            usuario: {
              id: parseInt(localStorage.getItem('userId') || '0'),
              nome: localStorage.getItem('userName') || 'Médico',
              role: localStorage.getItem('role') || 'medico',
            },
          });

          // 4. Salvar bloco no backend
          const blocoSalvo = await api.post('/blockchain', {
            paciente_id: parseInt(pacienteId),
            ...novoBloco,
          });

          await exportarReceitaPDF({
            receita: receitaCompleta,
            paciente: pac,
            medico,
            blocoBlockchain: blocoSalvo
          });
        } catch (pdfErr) {
          console.error('Erro ao buscar receita completa ou registrar na blockchain para PDF:', pdfErr);
          const medicoFallback = {
            nome: localStorage.getItem('userName') || 'Médico',
            crm: localStorage.getItem('userCrm') || '',
            especialidade: localStorage.getItem('userEspecialidade') || ''
          };
          await exportarReceitaPDF({
            receita: response,
            paciente: paciente,
            medico: medicoFallback
          });
        }
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

        <div className="historico-lista">
          {historico.length === 0 ? (
            <p style={{ color: '#7f8c8d', fontSize: 14 }}>Nenhuma receita anterior prescrita.</p>
          ) : (
            historico.map(rec => (
              <div key={rec.id} className="historico-card">
                <div className="timeline-dot"></div>
                <span className="historico-data">{formatarDataHora(rec.criado_em)}</span>
                <p className="historico-resumo" style={{ whiteSpace: 'pre-wrap', marginTop: '4px', fontSize: '13px' }}>
                  {rec.medicamentos.substring(0, 100) + (rec.medicamentos.length > 100 ? '...' : '')}
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
              {loading ? 'Salvando...' : (editarId ? 'Salvar Alterações e Emitir' : 'Salvar e Emitir Receita')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
