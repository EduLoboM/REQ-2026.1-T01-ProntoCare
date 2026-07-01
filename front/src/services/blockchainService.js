/**
 * blockchainService.js — RNF08
 * Blockchain de integridade de prontuários do lado do cliente.
 * 
 * Implementa uma cadeia de blocos onde cada documento (prontuário exportado) é
 * vinculado ao anterior por SHA-256 (Web Crypto API). 
 * 
 * Diferencial: permite edição de prontuários — ao editar, um novo bloco é 
 * adicionado com a versão atualizada, mantendo o bloco original na cadeia como 
 * histórico. O bloco editado referencia o bloco original que foi modificado.
 * 
 * Cada bloco contém:
 *  - indice: posição na cadeia
 *  - timestamp: data/hora ISO de criação do bloco
 *  - tipo: 'exportacao' | 'edicao'
 *  - entidade: 'atendimento' | 'anamnese'
 *  - entidade_id: ID do prontuário/anamnese
 *  - versao: número da versão do documento (incrementa a cada edição)
 *  - dados_hash: SHA-256 do conteúdo do prontuário
 *  - pdf_hash: SHA-256 do arquivo PDF exportado (null se não houve PDF)
 *  - hash_anterior: hash do bloco anterior na cadeia
 *  - hash: hash SHA-256 deste bloco
 *  - bloco_original_id: referência ao bloco original (para edições)
 *  - usuario_id / usuario_nome / usuario_role: quem gerou o bloco
 */

import { hashTexto, hashBloco } from './hashService';

/**
 * Monta o conteúdo canônico de um prontuário para hashing.
 * Serializa os dados de forma determinística (chaves ordenadas).
 * @param {object} dados - Dados do prontuário
 * @returns {string} JSON canônico
 */
export function canonicalizar(dados) {
  const chaves = Object.keys(dados).sort();
  const obj = {};
  for (const k of chaves) {
    obj[k] = dados[k];
  }
  return JSON.stringify(obj);
}

/**
 * Cria o bloco Gênesis da blockchain (primeiro bloco, sem dados reais).
 * @returns {Promise<object>} Bloco gênesis
 */
export async function criarBlocoGenesis() {
  const bloco = {
    indice: 0,
    timestamp: new Date().toISOString(),
    tipo: 'genesis',
    entidade: null,
    entidade_id: null,
    versao: 0,
    dados_hash: '0',
    pdf_hash: null,
    hash_anterior: '0',
    bloco_original_id: null,
    usuario_id: null,
    usuario_nome: 'Sistema',
    usuario_role: 'sistema',
  };

  bloco.hash = await hashBloco(bloco);
  return bloco;
}

/**
 * Cria um novo bloco de exportação na blockchain.
 * @param {object} params
 * @param {object} params.blocoAnterior - Último bloco da cadeia
 * @param {string} params.entidade - 'atendimento' ou 'anamnese'
 * @param {number} params.entidade_id - ID do registro
 * @param {number} params.versao - Versão do documento
 * @param {object} params.dadosProntuario - Dados completos do prontuário
 * @param {string|null} params.pdfHash - Hash SHA-256 do PDF exportado
 * @param {object} params.usuario - { id, nome, role }
 * @returns {Promise<object>} Novo bloco
 */
export async function criarBlocoExportacao({
  blocoAnterior,
  entidade,
  entidade_id,
  versao,
  dadosProntuario,
  pdfHash,
  usuario,
}) {
  const dadosCanonicos = canonicalizar(dadosProntuario);
  const dadosHash = await hashTexto(dadosCanonicos);

  const bloco = {
    indice: blocoAnterior.indice + 1,
    timestamp: new Date().toISOString(),
    tipo: 'exportacao',
    entidade,
    entidade_id,
    versao,
    dados_hash: dadosHash,
    pdf_hash: pdfHash || null,
    hash_anterior: blocoAnterior.hash,
    bloco_original_id: null,
    usuario_id: usuario.id,
    usuario_nome: usuario.nome,
    usuario_role: usuario.role,
  };

  bloco.hash = await hashBloco(bloco);
  return bloco;
}

/**
 * Cria um novo bloco de edição na blockchain.
 * Ao editar um prontuário, mantemos o bloco original e adicionamos um novo 
 * bloco referenciando o original, com os dados atualizados.
 * @param {object} params
 * @param {object} params.blocoAnterior - Último bloco da cadeia
 * @param {string} params.entidade - 'atendimento' ou 'anamnese'
 * @param {number} params.entidade_id - ID do registro
 * @param {number} params.versao - Nova versão
 * @param {object} params.dadosProntuario - Dados atualizados
 * @param {number} params.blocoOriginalId - Índice do bloco original na cadeia
 * @param {object} params.usuario - { id, nome, role }
 * @returns {Promise<object>} Novo bloco de edição
 */
export async function criarBlocoEdicao({
  blocoAnterior,
  entidade,
  entidade_id,
  versao,
  dadosProntuario,
  blocoOriginalId,
  usuario,
}) {
  const dadosCanonicos = canonicalizar(dadosProntuario);
  const dadosHash = await hashTexto(dadosCanonicos);

  const bloco = {
    indice: blocoAnterior.indice + 1,
    timestamp: new Date().toISOString(),
    tipo: 'edicao',
    entidade,
    entidade_id,
    versao,
    dados_hash: dadosHash,
    pdf_hash: null,
    hash_anterior: blocoAnterior.hash,
    bloco_original_id: blocoOriginalId,
    usuario_id: usuario.id,
    usuario_nome: usuario.nome,
    usuario_role: usuario.role,
  };

  bloco.hash = await hashBloco(bloco);
  return bloco;
}

/**
 * Valida a integridade de toda a cadeia de blocos.
 * Verifica se os hashes anteriores são consistentes e se cada hash do bloco 
 * corresponde ao conteúdo.
 * @param {object[]} cadeia - Array de blocos ordenados por índice
 * @returns {Promise<{valida: boolean, blocoInvalido: number|null, erro: string|null}>}
 */
export async function validarCadeia(cadeia) {
  if (cadeia.length === 0) {
    return { valida: true, blocoInvalido: null, erro: null };
  }

  for (let i = 1; i < cadeia.length; i++) {
    const blocoAtual = cadeia[i];
    const blocoAnterior = cadeia[i - 1];

    // Verifica se o hash_anterior do bloco atual aponta para o hash do bloco anterior
    if (blocoAtual.hash_anterior !== blocoAnterior.hash) {
      return {
        valida: false,
        blocoInvalido: i,
        erro: `Bloco #${i}: hash_anterior não corresponde ao hash do bloco #${i - 1}`,
      };
    }

    // Recalcula o hash do bloco e compara usando Web Crypto API
    const hashVerificacao = await hashBloco(blocoAtual);

    if (hashVerificacao !== blocoAtual.hash) {
      return {
        valida: false,
        blocoInvalido: i,
        erro: `Bloco #${i}: hash não corresponde ao conteúdo (possível adulteração)`,
      };
    }
  }

  return { valida: true, blocoInvalido: null, erro: null };
}

/**
 * Obtém o histórico de versões de um prontuário a partir da blockchain.
 * @param {object[]} cadeia - Cadeia completa de blocos
 * @param {string} entidade - 'atendimento' ou 'anamnese'
 * @param {number} entidade_id - ID do registro
 * @returns {object[]} Blocos relacionados àquele prontuário, ordenados por versão
 */
export function obterHistoricoVersoes(cadeia, entidade, entidade_id) {
  return cadeia
    .filter(b => b.entidade === entidade && b.entidade_id === entidade_id)
    .sort((a, b) => a.versao - b.versao);
}
