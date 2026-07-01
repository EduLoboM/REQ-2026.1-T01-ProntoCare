/**
 * hashService.js — RNF08
 * Geração de hash SHA-256 no lado do cliente usando Web Crypto API.
 * 
 * Responsável por:
 *  - Gerar hash SHA-256 de strings (conteúdo de prontuário)
 *  - Gerar hash SHA-256 de ArrayBuffer (arquivo PDF exportado)
 *  - Converter entre formatos (hex, base64)
 */

/**
 * Gera um hash SHA-256 a partir de uma string.
 * @param {string} texto - O texto a ser hasheado
 * @returns {Promise<string>} Hash SHA-256 em formato hexadecimal
 */
export async function hashTexto(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferParaHex(hashBuffer);
}

/**
 * Gera um hash SHA-256 a partir de um ArrayBuffer (ex: PDF).
 * @param {ArrayBuffer} buffer - O buffer a ser hasheado
 * @returns {Promise<string>} Hash SHA-256 em formato hexadecimal
 */
export async function hashBuffer(buffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return bufferParaHex(hashBuffer);
}

/**
 * Gera um hash SHA-256 a partir de um Blob (ex: arquivo PDF).
 * @param {Blob} blob - O blob a ser hasheado
 * @returns {Promise<string>} Hash SHA-256 em formato hexadecimal
 */
export async function hashBlob(blob) {
  const buffer = await blob.arrayBuffer();
  return hashBuffer(buffer);
}

/**
 * Converte um ArrayBuffer em string hexadecimal.
 * @param {ArrayBuffer} buffer
 * @returns {string} String hexadecimal (64 caracteres para SHA-256)
 */
function bufferParaHex(buffer) {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Serializa um bloco de forma canônica e determinística para hashing,
 * normalizando campos e excluindo colunas do banco de dados (id, criado_em, paciente_id).
 */
export function canonicalizarBloco(bloco) {
  // Normaliza o timestamp para garantir consistência de milissegundos/timezone do banco
  const ts = bloco.timestamp ? new Date(bloco.timestamp).toISOString() : '';

  const campos = {
    indice: Number(bloco.indice),
    timestamp: ts,
    tipo: bloco.tipo || '',
    entidade: bloco.entidade || null,
    entidade_id: bloco.entidade_id ? Number(bloco.entidade_id) : null,
    versao: Number(bloco.versao || 0),
    dados_hash: bloco.dados_hash || '',
    pdf_hash: bloco.pdf_hash || null,
    hash_anterior: bloco.hash_anterior || '',
    bloco_original_id: bloco.bloco_original_id ? Number(bloco.bloco_original_id) : null,
    usuario_id: bloco.usuario_id ? Number(bloco.usuario_id) : null,
    usuario_nome: bloco.usuario_nome || '',
    usuario_role: bloco.usuario_role || '',
  };

  // Ordena as chaves
  const chaves = Object.keys(campos).sort();
  const obj = {};
  for (const k of chaves) {
    obj[k] = campos[k];
  }
  return JSON.stringify(obj);
}

/**
 * Gera o hash de integridade para o conteúdo de um bloco da blockchain.
 * @param {object} bloco - O objeto do bloco
 * @returns {Promise<string>} Hash SHA-256 do bloco
 */
export async function hashBloco(bloco) {
  const conteudo = canonicalizarBloco(bloco);
  return hashTexto(conteudo);
}
