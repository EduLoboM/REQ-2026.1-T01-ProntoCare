import { useState, useEffect } from 'react';
import './AssinaturaModal.css';

export default function AssinaturaModal({ isOpen, onClose, onSign, docType }) {
  const [provedor, setProvedor] = useState('birdid');
  const [cpf, setCpf] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState(0);

  // Status messages for realistic signing simulation
  const steps = [
    'Iniciando conexão segura com o provedor...',
    'Localizando certificado padrão ICP-Brasil A3...',
    'Autenticando credenciais via PIN e OTP...',
    'Gerando assinatura digital criptografada...',
    'Finalizando registro com validade jurídica...'
  ];

  // Pre-fill fields if user info is available (not strictly required, but great UX)
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setOtp('');
      setLoading(false);
      setStatusStep(0);
      
      // Auto-prefill CPF if patient cpf exists in localStorage or can default
      const storedUserName = localStorage.getItem('userName') || '';
      // We will let them input their CPF manually but they can use a placeholder
    }
  }, [isOpen]);

  // Handle keyboard events (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const providers = [
    { id: 'birdid', name: 'BirdID', company: 'Soluti', logo: 'flutter_dash' },
    { id: 'vida', name: 'VIDA', company: 'Valid', logo: 'lock' },
    { id: 'safeid', name: 'SafeID', company: 'Safeweb', logo: 'shield' },
    { id: 'neoid', name: 'NeoID', company: 'Serpro', logo: 'settings' },
    { id: 'remoteid', name: 'remoteID', company: 'Certisign', logo: 'public' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!provedor || !cpf || !pin || !otp) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setStatusStep(0);

    // Simulate connection and signing steps for premium micro-interactions
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setStatusStep(i);
    }

    try {
      await onSign({ provedor, cpf, pin, otp });
    } catch (err) {
      alert(err.message || 'Erro ao assinar digitalmente.');
      setLoading(false);
    }
  };

  return (
    <div className="sig-modal-overlay">
      <div className="sig-modal-card">
        <header className="sig-modal-header">
          <div className="sig-modal-title-row">
            <span className="material-icons sig-modal-icon" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>history_edu</span>
            <h2>Assinatura Digital ICP-Brasil</h2>
          </div>
          <p className="sig-modal-subtitle">
            Assinatura em nuvem padrão ICP-Brasil A3 para {docType === 'receita' ? 'receita médica' : 'prontuário clínico'}.
          </p>
        </header>

        {loading ? (
          <div className="sig-modal-loading-container">
            <div className="sig-modal-spinner"></div>
            <div className="sig-modal-status-text">
              {steps[statusStep]}
            </div>
            <div className="sig-modal-progress-bar">
              <div 
                className="sig-modal-progress-fill" 
                style={{ width: `${((statusStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="sig-modal-form">
            {/* Step 1: Select Provider */}
            <div className="sig-form-group">
              <label className="sig-form-label">Selecione seu Provedor de Certificado (PSC)</label>
              <div className="sig-provider-grid">
                {providers.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`sig-provider-card ${provedor === p.id ? 'active' : ''}`}
                    onClick={() => setProvedor(p.id)}
                  >
                    <div className="sig-provider-logo">
                      <span className="material-icons" style={{ fontSize: '1.4rem' }}>{p.logo}</span>
                    </div>
                    <div className="sig-provider-details">
                      <div className="sig-provider-name">{p.name}</div>
                      <div className="sig-provider-company">{p.company}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Input credentials */}
            <div className="sig-credentials-row">
              <div className="sig-form-group">
                <label htmlFor="sig-cpf" className="sig-form-label">CPF do Médico</label>
                <input
                  id="sig-cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  className="sig-input"
                  required
                />
              </div>

              <div className="sig-form-group">
                <label htmlFor="sig-pin" className="sig-form-label">PIN do Certificado</label>
                <input
                  id="sig-pin"
                  type="password"
                  placeholder="Digite o PIN"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  className="sig-input"
                  required
                />
              </div>

              <div className="sig-form-group">
                <label htmlFor="sig-otp" className="sig-form-label">Código OTP (Token)</label>
                <input
                  id="sig-otp"
                  type="text"
                  maxLength="8"
                  placeholder="Ex: 123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="sig-input sig-input-otp"
                  required
                />
              </div>
            </div>

            <div className="sig-disclaimer" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="material-icons" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>verified</span>
              <span>Esta assinatura utiliza criptografia assimétrica de chaves públicas, gerando um registro de integridade com validade legal garantida no território nacional (Medida Provisória nº 2.200-2/2001).</span>
            </div>

            <footer className="sig-modal-footer">
              <button 
                type="button" 
                className="sig-btn-cancelar" 
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="sig-btn-assinar"
                disabled={loading}
              >
                Assinar e Exportar
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}
