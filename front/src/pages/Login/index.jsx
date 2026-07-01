import { useState } from 'react';
import { api } from '../../api';
import './styles.css';

export default function Login({ onLogin }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const data = await api.post('/auth/login', { login, senha });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      // RNF08: Salvar dados do usuário para blockchain de integridade
      if (data.nome) localStorage.setItem('userName', data.nome);
      // Decodificar o JWT para extrair o ID do usuário
      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        if (payload.id) localStorage.setItem('userId', String(payload.id));
      } catch { /* ignora erros de decodificação */ }
      onLogin(data.role);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='login-container'>
      <div className='login-wrapper'>
        <img src="/MASCOTE.png" alt="Mascote ProntoCare" className="login-mascote" />
        <div className='login-card'>
        <header>
          <h2>Entrar no ProntoCare</h2>
          <p>Acesse seu prontuário eletrônico e consultas de telemedicina</p>
        </header>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className="input-group">
            <label htmlFor="login">Login ou E-mail</label>
            <input
              id="login"
              type="text"
              placeholder="Login ou E-mail"
              value={login}
              onChange={e => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>

          {/* Exibe mensagem de erro, se houver */}
          {erro && (
            <div className="mensagem-erro">
              <p>{erro}</p>
            </div>
          )}


          <button type="submit" disabled={loading} className="btn-primario">
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        

      </div>
      </div>
    </div>
  );
}