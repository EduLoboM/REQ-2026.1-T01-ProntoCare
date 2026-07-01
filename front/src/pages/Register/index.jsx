import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api'; 
import './styles.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    sexo: '',
    cpf: '',
    nomeMae: '',
    email: '',
    telefone: '',
    cep: '',
    numero: '',
    senha: ''
    });

    const [loading, setLoading] = useState(false);

    const maskCPF = (v) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    const maskCEP = (v) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
    const maskTelefone = (v) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})$/, '$1-$2');

    // Salva os dados do formulário
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/pacientes', form);
            alert('Paciente cadastrado com sucesso!');
            navigate('/medico');
        } catch (err) {
            alert(err.message || 'Erro ao cadastrar paciente. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    }
        return (
            <div className="register-container">
            <div className="register-card">
                <header className="register-header">
                <h2>ProntoCare</h2>
                <p>Acesse seu prontuário eletrônico</p>
                </header>

                <div className="form-header">
                <div>
                    <h3>Cadastro de Novo Paciente</h3>
                    <p>Preencha os dados do paciente para conceder acesso</p>
                </div>
                <span className="badge">Aguardando Aprovação</span>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
          
                    {/* SEÇÃO 1: Identificação */}
                    <fieldset>
                        <legend>Identificação</legend>
                        
                        <div className="row-2">
                        <div className="input-group">
                            <label>Nome Completo</label>
                            <input type="text" placeholder="ex: João da Silva Sauro" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
                        </div>
                        <div className="input-group">
                            <label>Nome da Mãe</label>
                            <input type="text" placeholder="ex: Maria da Silva Sauro" value={form.nomeMae} onChange={e => setForm({ ...form, nomeMae: e.target.value })} required />
                        </div>
                        </div>
                        
                        <div className="row-3">
                        <div className="input-group">
                            <label>Data de Nascimento</label>
                            <input type="date" value={form.dataNascimento} onChange={e => setForm({ ...form, dataNascimento: e.target.value })} required />
                        </div>
                        <div className="input-group">
                            <label>Sexo/Gênero</label>
                            <select value={form.sexo} onChange={e => setForm({ ...form, sexo: e.target.value })} required>
                            <option value="">Selecione...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                            <option value="O">Outro</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>CPF</label>
                            <input type="text" placeholder="ex: 000.000.000-00" value={form.cpf} onChange={e => setForm({ ...form, cpf: maskCPF(e.target.value) })} pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" title="Digite o CPF no formato 000.000.000-00" required />
                        </div>
                        </div>
                    </fieldset>

                    {/* SEÇÃO 2: Contato, Endereço e Acesso */}
                    <fieldset>
                        <legend>Contato, Endereço e Acesso</legend>
                        
                        <div className="row-2">
                        <div className="input-group">
                            <label>E-mail Principal</label>
                            <input type="email" placeholder="ex: paciente@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <div className="input-group">
                            <label>Senha Provisória</label>
                            <input type="password" placeholder="ex: ProntoCare123" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} required />
                        </div>
                        
                        </div>
                        
                        <div className="row-3">
                        <div className="input-group">
                            <label>CEP</label>
                            <input type="text" placeholder="ex: 00000-000" value={form.cep} onChange={e => setForm({ ...form, cep: maskCEP(e.target.value) })} pattern="\d{5}-\d{3}" title="Digite o CEP no formato 00000-000" required />
                        </div>
                        <div className="input-group">
                            <label>Número/Complemento</label>
                            <input type="text" placeholder="ex: Apt 123" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} required />
                        </div>
                        <div className="input-group">
                            <label>Telefone / WhatsApp</label>
                            <input type="tel" placeholder="ex: (99) 99999-9999" value={form.telefone} onChange={e => setForm({ ...form, telefone: maskTelefone(e.target.value) })} pattern="\(\d{2}\)\s\d{4,5}-\d{4}" title="Digite o telefone no formato (99) 99999-9999" required />
                        </div>
                        </div>
                    </fieldset>

                    {/* BOTÕES DE AÇÃO */}
                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="btn-primario">
                        {loading ? 'Cadastrando...' : 'Cadastrar Paciente'}
                        </button>
                        <button type="button" className="btn-link" onClick={() => navigate('/medico')}>
                        Voltar para o Painel do Médico
                        </button>
                    </div>
                    </form>
            </div>
            </div>
        );
    }
