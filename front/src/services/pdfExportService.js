/**
 * pdfExportService.js — RNF08
 * Serviço de exportação de prontuários em PDF com hash de integridade SHA-256.
 * 
 * Gera o PDF inteiramente no lado do cliente usando a API nativa de impressão 
 * do navegador (window.print via iframe oculto) para evitar dependências externas.
 * 
 * Após a geração, calcula o hash SHA-256 do conteúdo via Web Crypto API.
 */

import { hashTexto } from './hashService';

/**
 * Formata uma data ISO para dd/mm/aaaa.
 */
function formatarData(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Formata uma data ISO para dd/mm/aaaa às HH:MM.
 */
function formatarDataHora(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' às '
    + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Gera o HTML de um prontuário (atendimento) para exportação em PDF.
 * @param {object} atendimento - Dados do atendimento
 * @param {object} paciente - Dados do paciente
 * @param {string} hashIntegridade - Hash SHA-256 de integridade do prontuário
 * @param {object|null} blocoBlockchain - Informações do bloco na blockchain (se houver)
 * @returns {string} HTML formatado para impressão
 */
export function gerarHtmlProntuario(atendimento, paciente, hashIntegridade, blocoBlockchain = null) {
  const mapSexo = (s) => {
    if (s === 'M') return 'Masculino';
    if (s === 'F') return 'Feminino';
    if (s === 'O') return 'Outro';
    return '—';
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Prontuário #${atendimento.id} — ${paciente.nome}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      padding: 2.5rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .pdf-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #0d9488;
      padding-bottom: 1.25rem;
      margin-bottom: 2rem;
    }

    .pdf-header-logo h1 {
      font-size: 1.6rem;
      color: #0d9488;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .pdf-header-logo p {
      font-size: 0.85rem;
      color: #64748b;
    }

    .pdf-header-meta {
      text-align: right;
      font-size: 0.8rem;
      color: #64748b;
    }

    .pdf-header-meta strong {
      color: #0f172a;
    }

    .pdf-section {
      margin-bottom: 1.5rem;
    }

    .pdf-section-title {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0d9488;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.4rem;
      margin-bottom: 0.8rem;
    }

    .pdf-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem 2rem;
    }

    .pdf-field {
      margin-bottom: 0.5rem;
    }

    .pdf-field-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .pdf-field-value {
      font-size: 0.95rem;
      color: #1e293b;
      font-weight: 500;
    }

    .pdf-soap-section {
      margin-bottom: 1.25rem;
    }

    .pdf-soap-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #0d9488;
      margin-bottom: 0.4rem;
    }

    .pdf-soap-content {
      font-size: 0.9rem;
      color: #334155;
      background: #f8fafc;
      border-left: 4px solid #0d9488;
      padding: 0.75rem 1rem;
      border-radius: 0 6px 6px 0;
      white-space: pre-wrap;
    }

    .pdf-vitals {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.25rem;
    }

    .pdf-vital-badge {
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      border-radius: 6px;
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #0d9488;
    }

    .pdf-footer {
      margin-top: 2.5rem;
      padding-top: 1.25rem;
      border-top: 2px solid #e2e8f0;
    }

    .pdf-hash-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-top: 1rem;
    }

    .pdf-hash-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .pdf-hash-value {
      font-family: ui-monospace, Consolas, monospace;
      font-size: 0.75rem;
      color: #0d9488;
      word-break: break-all;
      font-weight: 600;
    }

    .pdf-blockchain-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 0.75rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .pdf-blockchain-info strong {
      color: #0f172a;
    }

    @media print {
      body { padding: 1rem; }
      .pdf-hash-section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    <div class="pdf-header-logo">
      <h1>☉ ProntoCare</h1>
      <p>Prontuário Eletrônico do Paciente</p>
    </div>
    <div class="pdf-header-meta">
      <p><strong>Prontuário #${atendimento.id}</strong></p>
      <p>Emitido em: ${formatarDataHora(new Date().toISOString())}</p>
      <p>Médico: Dr(a). ${atendimento.medico_nome || '—'}</p>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">Dados do Paciente</div>
    <div class="pdf-grid">
      <div class="pdf-field">
        <div class="pdf-field-label">Nome Completo</div>
        <div class="pdf-field-value">${paciente.nome}</div>
      </div>
      <div class="pdf-field">
        <div class="pdf-field-label">CPF</div>
        <div class="pdf-field-value">${paciente.cpf}</div>
      </div>
      <div class="pdf-field">
        <div class="pdf-field-label">Data de Nascimento</div>
        <div class="pdf-field-value">${formatarData(paciente.data_nascimento)}</div>
      </div>
      <div class="pdf-field">
        <div class="pdf-field-label">Sexo</div>
        <div class="pdf-field-value">${mapSexo(paciente.sexo)}</div>
      </div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">Registro Clínico (SOAP)</div>
    <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">
      Data do atendimento: ${formatarDataHora(atendimento.criado_em)}
      ${atendimento.atualizado_em && atendimento.atualizado_em !== atendimento.criado_em
        ? ' | Última atualização: ' + formatarDataHora(atendimento.atualizado_em)
        : ''
      }
    </p>

    ${(atendimento.peso || atendimento.altura || atendimento.imc) ? `
    <div class="pdf-vitals">
      ${atendimento.peso ? `<span class="pdf-vital-badge">Peso: ${atendimento.peso} kg</span>` : ''}
      ${atendimento.altura ? `<span class="pdf-vital-badge">Altura: ${atendimento.altura} m</span>` : ''}
      ${atendimento.imc ? `<span class="pdf-vital-badge">IMC: ${atendimento.imc}</span>` : ''}
    </div>` : ''}

    ${atendimento.subjetivo ? `
    <div class="pdf-soap-section">
      <div class="pdf-soap-title">S — Subjetivo</div>
      <div class="pdf-soap-content">${atendimento.subjetivo}</div>
    </div>` : ''}

    ${atendimento.objetivo ? `
    <div class="pdf-soap-section">
      <div class="pdf-soap-title">O — Objetivo</div>
      <div class="pdf-soap-content">${atendimento.objetivo}</div>
    </div>` : ''}

    ${atendimento.avaliacao ? `
    <div class="pdf-soap-section">
      <div class="pdf-soap-title">A — Avaliação</div>
      <div class="pdf-soap-content">${atendimento.avaliacao}</div>
    </div>` : ''}

    ${atendimento.plano ? `
    <div class="pdf-soap-section">
      <div class="pdf-soap-title">P — Plano</div>
      <div class="pdf-soap-content">${atendimento.plano}</div>
    </div>` : ''}
  </div>

  <div class="pdf-footer">
    <div class="pdf-hash-section">
      <div class="pdf-hash-title">
        🜔 Hash de Integridade SHA-256 (Web Crypto API)
      </div>
      <div class="pdf-hash-value">${hashIntegridade}</div>

      ${blocoBlockchain ? `
      <div class="pdf-blockchain-info">
        <div>
          <span>Bloco #</span>
          <strong>${blocoBlockchain.indice}</strong>
        </div>
        <div>
          <span>Versão:</span>
          <strong>${blocoBlockchain.versao}</strong>
        </div>
        <div>
          <span>Tipo:</span>
          <strong>${blocoBlockchain.tipo === 'exportacao' ? 'Exportação' : blocoBlockchain.tipo === 'edicao' ? 'Edição' : blocoBlockchain.tipo}</strong>
        </div>
        <div>
          <span>Registrado em:</span>
          <strong>${formatarDataHora(blocoBlockchain.timestamp)}</strong>
        </div>
      </div>
      <div style="margin-top: 0.5rem;">
        <div class="pdf-hash-title" style="margin-bottom: 0.25rem;">
          🜍 Hash do Bloco Anterior
        </div>
        <div class="pdf-hash-value" style="font-size: 0.7rem; color: #94a3b8;">${blocoBlockchain.hash_anterior}</div>
      </div>
      ` : ''}

      ${(blocoBlockchain && blocoBlockchain.assinado) ? `
      <div class="pdf-signature-box" style="margin-top: 1rem; background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 1rem; display: flex; align-items: center; gap: 0.75rem; page-break-inside: avoid;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 11 2 2 4-4"></path></svg>
        <div style="text-align: left;">
          <div style="font-weight: 700; color: #065f46; font-size: 0.85rem;">Documento Assinado Digitalmente — ICP-Brasil</div>
          <div style="font-size: 0.75rem; color: #047857; margin-top: 0.1rem; line-height: 1.4;">
            Assinado por: <strong>Dr(a). ${blocoBlockchain.assinatura_nome}</strong> (CPF: ${blocoBlockchain.assinatura_cpf || '***.***.***-**'})<br/>
            Provedor em Nuvem: <strong>${blocoBlockchain.assinatura_provedor.toUpperCase()} (A3)</strong> | Data: ${formatarDataHora(blocoBlockchain.assinatura_data)}<br/>
            Validade Jurídica: MP nº 2.200-2/2001 | Verificar em: <a href="https://assinador.iti.br" target="_blank" style="color: #047857; text-decoration: underline; font-weight: 600;">assinador.iti.br</a>
          </div>
          <div style="font-family: monospace; font-size: 0.6rem; color: #065f46; word-break: break-all; margin-top: 0.3rem; background: rgba(16, 185, 129, 0.1); padding: 2px 6px; border-radius: 4px;">
            Stamp: ${blocoBlockchain.assinatura_token}
          </div>
        </div>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Exporta um prontuário como PDF usando a API de impressão do navegador.
 * Abre um iframe oculto com o HTML formatado e aciona window.print().
 * 
 * @param {string} html - HTML completo do prontuário
 * @param {string} nomeArquivo - Nome do arquivo PDF (sem extensão)
 */
export function imprimirPDF(html, nomeArquivo) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  
  document.body.appendChild(iframe);
  
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
  
  // Aguarda fontes e estilos carregarem antes de imprimir
  iframe.contentWindow.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.document.title = nomeArquivo;
      iframe.contentWindow.print();
      // Remove o iframe após fechar a janela de impressão
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };
}

/**
 * Pipeline completo: gera hash do prontuário + registra na blockchain + abre PDF para download.
 * @param {object} params
 * @param {object} params.atendimento - Dados do atendimento
 * @param {object} params.paciente - Dados do paciente
 * @param {object|null} params.blocoBlockchain - Dados do bloco da blockchain
 * @returns {Promise<{hashIntegridade: string, html: string}>}
 */
export async function exportarProntuarioPDF({ atendimento, paciente, blocoBlockchain }) {
  // 1. Gerar o hash de integridade a partir do conteúdo canônico do prontuário
  const dadosCanonicos = JSON.stringify({
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
  });
  
  const hashIntegridade = await hashTexto(dadosCanonicos);
  
  // 2. Gerar o HTML do prontuário
  const html = gerarHtmlProntuario(atendimento, paciente, hashIntegridade, blocoBlockchain);
  
  // 3. Abrir para impressão/download via browser print API
  const nomeArquivo = `prontuario_${atendimento.id}_${paciente.nome.replace(/\s+/g, '_')}`;
  imprimirPDF(html, nomeArquivo);
  
  return { hashIntegridade, html };
}

/**
 * Gera o HTML de uma anamnese para exportação em PDF.
 */
export function gerarHtmlAnamnese(anamnese, paciente, hashIntegridade, blocoBlockchain = null) {
  const mapSexo = (s) => {
    if (s === 'M') return 'Masculino';
    if (s === 'F') return 'Feminino';
    if (s === 'O') return 'Outro';
    return '—';
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Anamnese #${anamnese.id} — ${paciente.nome}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      padding: 2.5rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .pdf-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #0d9488;
      padding-bottom: 1.25rem;
      margin-bottom: 2rem;
    }

    .pdf-header-logo h1 {
      font-size: 1.6rem;
      color: #0d9488;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .pdf-header-logo p {
      font-size: 0.85rem;
      color: #64748b;
    }

    .pdf-header-meta {
      text-align: right;
      font-size: 0.8rem;
      color: #64748b;
    }

    .pdf-header-meta strong {
      color: #0f172a;
    }

    .pdf-section {
      margin-bottom: 1.5rem;
    }

    .pdf-section-title {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0d9488;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.4rem;
      margin-bottom: 0.8rem;
    }

    .pdf-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem 2rem;
    }

    .pdf-field {
      margin-bottom: 0.5rem;
    }

    .pdf-field-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .pdf-field-value {
      font-size: 0.95rem;
      color: #1e293b;
      font-weight: 500;
    }

    .pdf-content-box {
      font-size: 0.9rem;
      color: #334155;
      background: #f8fafc;
      border-left: 4px solid #0d9488;
      padding: 1rem 1.25rem;
      border-radius: 0 6px 6px 0;
      white-space: pre-wrap;
      margin-top: 0.5rem;
    }

    .pdf-footer {
      margin-top: 2.5rem;
      padding-top: 1.25rem;
      border-top: 2px solid #e2e8f0;
    }

    .pdf-hash-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-top: 1rem;
    }

    .pdf-hash-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .pdf-hash-value {
      font-family: ui-monospace, Consolas, monospace;
      font-size: 0.75rem;
      color: #0d9488;
      word-break: break-all;
      font-weight: 600;
    }

    .pdf-blockchain-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 0.75rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .pdf-blockchain-info strong {
      color: #0f172a;
    }

    @media print {
      body { padding: 1rem; }
      .pdf-hash-section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    <div class="pdf-header-logo">
      <h1>☉ ProntoCare</h1>
      <p>Anamnese Clínica do Paciente</p>
    </div>
    <div class="pdf-header-meta">
      <p><strong>Anamnese #${anamnese.id}</strong></p>
      <p>Emitido em: ${formatarDataHora(new Date().toISOString())}</p>
      <p>Médico: Dr(a). ${anamnese.medico_nome || '—'}</p>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">Dados do Paciente</div>
    <div class="pdf-grid">
      <div class="pdf-field">
        <div class="pdf-field-label">Nome Completo</div>
        <div class="pdf-field-value">${paciente.nome}</div>
      </div>
      <div class="pdf-field">
        <div class="pdf-field-label">CPF</div>
        <div class="pdf-field-value">${paciente.cpf}</div>
      </div>
      <div class="pdf-field">
        <div class="pdf-field-label">Data de Nascimento</div>
        <div class="pdf-field-value">${formatarData(paciente.data_nascimento)}</div>
      </div>
      <div class="pdf-field">
        <div class="pdf-field-label">Sexo</div>
        <div class="pdf-field-value">${mapSexo(paciente.sexo)}</div>
      </div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">Conteúdo da Anamnese</div>
    <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">
      Data de criação: ${formatarDataHora(anamnese.criado_em)}
      ${anamnese.atualizado_em && anamnese.atualizado_em !== anamnese.criado_em
        ? ' | Última atualização: ' + formatarDataHora(anamnese.atualizado_em)
        : ''
      }
    </p>
    <div class="pdf-content-box">${anamnese.conteudo}</div>
  </div>

  <div class="pdf-footer">
    <div class="pdf-hash-section">
      <div class="pdf-hash-title">
        🜔 Hash de Integridade SHA-256 (Web Crypto API)
      </div>
      <div class="pdf-hash-value">${hashIntegridade}</div>

      ${blocoBlockchain ? `
      <div class="pdf-blockchain-info">
        <div>
          <span>Bloco #</span>
          <strong>${blocoBlockchain.indice}</strong>
        </div>
        <div>
          <span>Versão:</span>
          <strong>${blocoBlockchain.versao}</strong>
        </div>
        <div>
          <span>Tipo:</span>
          <strong>${blocoBlockchain.tipo === 'exportacao' ? 'Exportação' : blocoBlockchain.tipo === 'edicao' ? 'Edição' : blocoBlockchain.tipo}</strong>
        </div>
        <div>
          <span>Registrado em:</span>
          <strong>${formatarDataHora(blocoBlockchain.timestamp)}</strong>
        </div>
      </div>
      <div style="margin-top: 0.5rem;">
        <div class="pdf-hash-title" style="margin-bottom: 0.25rem;">
          🜍 Hash do Bloco Anterior
        </div>
        <div class="pdf-hash-value" style="font-size: 0.7rem; color: #94a3b8;">${blocoBlockchain.hash_anterior}</div>
      </div>
      ` : ''}

      ${(blocoBlockchain && blocoBlockchain.assinado) ? `
      <div class="pdf-signature-box" style="margin-top: 1rem; background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 1rem; display: flex; align-items: center; gap: 0.75rem; page-break-inside: avoid;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 11 2 2 4-4"></path></svg>
        <div style="text-align: left;">
          <div style="font-weight: 700; color: #065f46; font-size: 0.85rem;">Documento Assinado Digitalmente — ICP-Brasil</div>
          <div style="font-size: 0.75rem; color: #047857; margin-top: 0.1rem; line-height: 1.4;">
            Assinado por: <strong>Dr(a). ${blocoBlockchain.assinatura_nome}</strong> (CPF: ${blocoBlockchain.assinatura_cpf || '***.***.***-**'})<br/>
            Provedor em Nuvem: <strong>${blocoBlockchain.assinatura_provedor.toUpperCase()} (A3)</strong> | Data: ${formatarDataHora(blocoBlockchain.assinatura_data)}<br/>
            Validade Jurídica: MP nº 2.200-2/2001 | Verificar em: <a href="https://assinador.iti.br" target="_blank" style="color: #047857; text-decoration: underline; font-weight: 600;">assinador.iti.br</a>
          </div>
          <div style="font-family: monospace; font-size: 0.6rem; color: #065f46; word-break: break-all; margin-top: 0.3rem; background: rgba(16, 185, 129, 0.1); padding: 2px 6px; border-radius: 4px;">
            Stamp: ${blocoBlockchain.assinatura_token}
          </div>
        </div>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Pipeline completo: gera hash da anamnese + registra na blockchain + abre PDF para download.
 */
export async function exportarAnamnesePDF({ anamnese, paciente, blocoBlockchain }) {
  // 1. Gerar o hash de integridade a partir do conteúdo canônico da anamnese
  const dadosCanonicos = JSON.stringify({
    id: anamnese.id,
    paciente_id: anamnese.paciente_id,
    medico_id: anamnese.medico_id,
    conteudo: anamnese.conteudo,
    criado_em: anamnese.criado_em,
    atualizado_em: anamnese.atualizado_em,
  });
  
  const hashIntegridade = await hashTexto(dadosCanonicos);
  
  // 2. Gerar o HTML da anamnese
  const html = gerarHtmlAnamnese(anamnese, paciente, hashIntegridade, blocoBlockchain);
  
  // 3. Abrir para impressão/download via browser print API
  const nomeArquivo = `anamnese_${anamnese.id}_${paciente.nome.replace(/\s+/g, '_')}`;
  imprimirPDF(html, nomeArquivo);
  
  return { hashIntegridade, html };
}

/**
 * Gera o HTML de uma receita médica para exportação em PDF.
 */
export function gerarHtmlReceita(receita, paciente, medico, hashIntegridade, blocoBlockchain = null) {
  const mapSexo = (s) => {
    if (s === 'M') return 'Masculino';
    if (s === 'F') return 'Feminino';
    if (s === 'O') return 'Outro';
    return '—';
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Receita Médica #${receita.id} — ${paciente.nome || paciente.paciente_nome}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      padding: 2.5rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .pdf-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #0d9488;
      padding-bottom: 1.25rem;
      margin-bottom: 2rem;
    }

    .pdf-header-logo h1 {
      font-size: 1.6rem;
      color: #0d9488;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .pdf-header-logo p {
      font-size: 0.85rem;
      color: #64748b;
    }

    .pdf-header-meta {
      text-align: right;
      font-size: 0.8rem;
      color: #64748b;
    }

    .pdf-header-meta strong {
      color: #0f172a;
    }

    .pdf-section {
      margin-bottom: 1.5rem;
    }

    .pdf-section-title {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0d9488;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.4rem;
      margin-bottom: 0.8rem;
    }

    .pdf-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem 2rem;
    }

    .pdf-field {
      margin-bottom: 0.5rem;
    }

    .pdf-field-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .pdf-field-value {
      font-size: 0.95rem;
      color: #1e293b;
      font-weight: 500;
    }

    .pdf-content-box {
      font-size: 1rem;
      color: #1e293b;
      background: #f8fafc;
      border-left: 4px solid #0d9488;
      padding: 1.25rem 1.5rem;
      border-radius: 0 6px 6px 0;
      white-space: pre-wrap;
      margin-top: 0.5rem;
      min-height: 150px;
    }

    .pdf-signature-section {
      margin-top: 5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      page-break-inside: avoid;
    }

    .pdf-signature-line {
      width: 250px;
      border-top: 1px solid #94a3b8;
      margin-bottom: 0.5rem;
    }

    .pdf-signature-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #0f172a;
    }

    .pdf-signature-crm {
      font-size: 0.8rem;
      color: #64748b;
    }

    .pdf-footer {
      margin-top: 2.5rem;
      padding-top: 1.25rem;
      border-top: 2px solid #e2e8f0;
    }

    .pdf-hash-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-top: 1rem;
    }

    .pdf-hash-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .pdf-hash-value {
      font-family: ui-monospace, Consolas, monospace;
      font-size: 0.75rem;
      color: #0d9488;
      word-break: break-all;
      font-weight: 600;
    }

    .pdf-blockchain-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 0.75rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .pdf-blockchain-info strong {
      color: #0f172a;
    }

    @media print {
      body { padding: 1rem; }
      .pdf-signature-section { break-inside: avoid; }
      .pdf-hash-section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    <div class="pdf-header-logo">
      <h1>☉ ProntoCare</h1>
      <p>Receita Médica Digital</p>
    </div>
    <div class="pdf-header-meta">
      <p><strong>Receita #${receita.id}</strong></p>
      <p>Emitido em: ${formatarDataHora(receita.criado_em || new Date().toISOString())}</p>
      <p>Médico: Dr(a). ${medico.nome || medico.medico_nome || '—'}</p>
      <p>CRM: ${medico.crm || medico.medico_crm || '—'}</p>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">Dados do Paciente</div>
    <div class="pdf-grid">
      <div class="pdf-field">
        <div class="pdf-field-label">Nome Completo</div>
        <div class="pdf-field-value">${paciente.nome || paciente.paciente_nome || '—'}</div>
      </div>
      <div class="pdf-field">
        <div class="pdf-field-label">CPF</div>
        <div class="pdf-field-value">${paciente.cpf || paciente.paciente_cpf || '—'}</div>
      </div>
      <div class="pdf-field">
        <div class="pdf-field-label">Data de Nascimento</div>
        <div class="pdf-field-value">${formatarData(paciente.data_nascimento || paciente.paciente_nascimento)}</div>
      </div>
      <div class="pdf-field">
        <div class="pdf-field-label">Sexo</div>
        <div class="pdf-field-value">${mapSexo(paciente.sexo || paciente.paciente_sexo)}</div>
      </div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">Medicamentos e Instruções de Uso</div>
    <div class="pdf-content-box">${receita.medicamentos}</div>
  </div>

  ${receita.observacoes ? `
  <div class="pdf-section" style="margin-top: 1.5rem;">
    <div class="pdf-section-title">Observações</div>
    <div style="font-size: 0.9rem; color: #475569; background: #f8fafc; padding: 0.75rem 1rem; border-radius: 6px; white-space: pre-wrap;">${receita.observacoes}</div>
  </div>` : ''}

  ${(receita.assinado || (blocoBlockchain && blocoBlockchain.assinado)) ? `
  <div class="pdf-signature-box" style="margin-top: 3rem; background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; page-break-inside: avoid;">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 11 2 2 4-4"></path></svg>
    <div style="text-align: left;">
      <div style="font-weight: 700; color: #065f46; font-size: 0.95rem;">Documento Assinado Digitalmente — ICP-Brasil</div>
      <div style="font-size: 0.85rem; color: #047857; margin-top: 0.2rem; line-height: 1.4;">
        Assinado por: <strong>Dr(a). ${receita.assinatura_nome || (blocoBlockchain && blocoBlockchain.assinatura_nome) || medico.nome || medico.medico_nome}</strong> (CPF: ${receita.assinatura_cpf || (blocoBlockchain && blocoBlockchain.assinatura_cpf) || '***.***.***-**'})<br/>
        Provedor em Nuvem: <strong>${(receita.assinatura_provedor || (blocoBlockchain && blocoBlockchain.assinatura_provedor) || 'BirdID').toUpperCase()} (A3)</strong> | Data: ${formatarDataHora(receita.assinatura_data || (blocoBlockchain && blocoBlockchain.assinatura_data) || receita.criado_em)}<br/>
        Validade Jurídica: Garantida por Medida Provisória nº 2.200-2/2001 | Verificar em: <a href="https://assinador.iti.br" target="_blank" style="color: #047857; text-decoration: underline; font-weight: 600;">assinador.iti.br</a>
      </div>
      <div style="font-family: monospace; font-size: 0.65rem; color: #065f46; word-break: break-all; margin-top: 0.4rem; background: rgba(16, 185, 129, 0.1); padding: 4px 8px; border-radius: 4px;">
        Stamp: ${receita.assinatura_token || (blocoBlockchain && blocoBlockchain.assinatura_token) || 'ICP-Brasil-A3-Cloud-Mock-Stamp'}
      </div>
    </div>
  </div>
  ` : `
  <div class="pdf-signature-section">
    <div class="pdf-signature-line"></div>
    <div class="pdf-signature-name">Dr(a). ${medico.nome || medico.medico_nome || '—'}</div>
    <div class="pdf-signature-crm">CRM: ${medico.crm || medico.medico_crm || '—'}${medico.especialidade || medico.medico_especialidade ? ` - ${medico.especialidade || medico.medico_especialidade}` : ''}</div>
  </div>
  `}

  <div class="pdf-footer">
    <div class="pdf-hash-section">
      <div class="pdf-hash-title">
        🜔 Hash de Integridade SHA-256 (Web Crypto API)
      </div>
      <div class="pdf-hash-value">${hashIntegridade}</div>

      ${blocoBlockchain ? `
      <div class="pdf-blockchain-info">
        <div>
          <span>Bloco #</span>
          <strong>${blocoBlockchain.indice}</strong>
        </div>
        <div>
          <span>Versão:</span>
          <strong>${blocoBlockchain.versao}</strong>
        </div>
        <div>
          <span>Tipo:</span>
          <strong>${blocoBlockchain.tipo === 'exportacao' ? 'Exportação' : blocoBlockchain.tipo === 'edicao' ? 'Edição' : blocoBlockchain.tipo}</strong>
        </div>
        <div>
          <span>Registrado em:</span>
          <strong>${formatarDataHora(blocoBlockchain.timestamp)}</strong>
        </div>
      </div>
      <div style="margin-top: 0.5rem;">
        <div class="pdf-hash-title" style="margin-bottom: 0.25rem;">
          🜍 Hash do Bloco Anterior
        </div>
        <div class="pdf-hash-value" style="font-size: 0.7rem; color: #94a3b8;">${blocoBlockchain.hash_anterior}</div>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Pipeline completo para exportar receita em PDF com integridade e registro blockchain.
 */
export async function exportarReceitaPDF({ receita, paciente, medico, blocoBlockchain = null }) {
  // 1. Gerar o hash de integridade a partir do conteúdo canônico da receita
  const dadosCanonicos = JSON.stringify({
    id: receita.id,
    paciente_id: receita.paciente_id,
    medico_id: receita.medico_id,
    medicamentos: receita.medicamentos,
    observacoes: receita.observacoes,
    criado_em: receita.criado_em,
  });
  
  const hashIntegridade = await hashTexto(dadosCanonicos);

  // 2. Gerar o HTML
  const html = gerarHtmlReceita(receita, paciente, medico, hashIntegridade, blocoBlockchain);
  const nomeArquivo = `receita_${receita.id}_${(paciente.nome || paciente.paciente_nome || 'paciente').replace(/\s+/g, '_')}`;
  imprimirPDF(html, nomeArquivo);
  
  return { hashIntegridade, html };
}
