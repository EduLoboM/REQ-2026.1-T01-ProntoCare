/**
 * offlineService.js — RNF03
 * Gerenciamento de banco de dados local (IndexedDB) para cache e fila offline.
 *
 * Oferece cache de requisições GET, fila de requisições de escrita (POST, PUT, DELETE),
 * atualização otimista dos dados locais, mapeamento dinâmico de IDs temporários
 * gerados pelo cliente para IDs reais gerados pelo servidor, e backup manual (export/import).
 */

const DB_NAME = 'ProntoCareOfflineDB';
const DB_VERSION = 1;

/**
 * Inicializa e abre o banco de dados IndexedDB.
 * @returns {Promise<IDBDatabase>}
 */
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // Store para requisições GET cacheadas
      if (!db.objectStoreNames.contains('get_cache')) {
        db.createObjectStore('get_cache', { keyPath: 'path' });
      }

      // Store para fila de escrita offline (POST, PUT, DELETE)
      if (!db.objectStoreNames.contains('offline_queue')) {
        db.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
      }

      // Store para mapear ID temporário -> ID real do servidor
      if (!db.objectStoreNames.contains('temp_id_map')) {
        db.createObjectStore('temp_id_map', { keyPath: 'tempId' });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// ==========================================
// MÉTODOS DE CACHE (GET)
// ==========================================

/**
 * Salva a resposta de uma requisição GET no cache.
 * @param {string} path - URL/Caminho relativo
 * @param {any} data - Dados de resposta da API
 */
export async function cacheGetRequest(path, data) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('get_cache', 'readwrite');
    const store = tx.objectStore('get_cache');
    const request = store.put({ path, data, timestamp: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Recupera um resultado GET cacheado.
 * @param {string} path
 * @returns {Promise<any | null>}
 */
export async function getCachedRequest(path) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('get_cache', 'readonly');
    const store = tx.objectStore('get_cache');
    const request = store.get(path);

    request.onsuccess = () => {
      resolve(request.result ? request.result.data : null);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtém todas as chaves salvas no cache de GETs.
 * @returns {Promise<string[]>}
 */
export async function getAllCachedKeys() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('get_cache', 'readonly');
    const store = tx.objectStore('get_cache');
    const request = store.getAllKeys();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// ==========================================
// MÉTODOS DA FILA (QUEUE)
// ==========================================

/**
 * Adiciona uma requisição de alteração (POST, PUT, DELETE) na fila offline.
 * @param {string} method
 * @param {string} path
 * @param {any} body
 * @param {string} tempId - ID temporário gerado (para relacionamentos)
 */
export async function queueWriteRequest(method, path, body, tempId = null) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('offline_queue', 'readwrite');
    const store = tx.objectStore('offline_queue');
    const request = store.add({
      method,
      path,
      body,
      tempId,
      timestamp: Date.now()
    });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtém todas as operações na fila offline.
 * @returns {Promise<object[]>}
 */
export async function getQueue() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('offline_queue', 'readonly');
    const store = tx.objectStore('offline_queue');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtém o tamanho da fila pendente.
 * @returns {Promise<number>}
 */
export async function getQueueSize() {
  const q = await getQueue();
  return q.length;
}

/**
 * Remove um item da fila offline.
 * @param {number} id - ID do IndexedDB autoincrement
 */
export async function removeQueueItem(id) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('offline_queue', 'readwrite');
    const store = tx.objectStore('offline_queue');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Limpa toda a fila offline.
 */
export async function clearQueue() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('offline_queue', 'readwrite');
    const store = tx.objectStore('offline_queue');
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ==========================================
// MAPEAMENTO DE IDS (TEMP -> REAL)
// ==========================================

/**
 * Salva a correspondência de um ID temporário com o real retornado pelo servidor.
 */
export async function addIdMapping(tempId, realId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('temp_id_map', 'readwrite');
    const store = tx.objectStore('temp_id_map');
    const request = store.put({ tempId, realId, timestamp: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtém o ID mapeado real.
 */
export async function getIdMapping(tempId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('temp_id_map', 'readonly');
    const store = tx.objectStore('temp_id_map');
    const request = store.get(tempId);

    request.onsuccess = () => resolve(request.result ? request.result.realId : null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtém todos os mapeamentos de IDs ativos.
 * @returns {Promise<object>} Objeto contendo tempId -> realId
 */
export async function getAllIdMappings() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('temp_id_map', 'readonly');
    const store = tx.objectStore('temp_id_map');
    const request = store.getAll();

    request.onsuccess = () => {
      const map = {};
      (request.result || []).forEach(item => {
        map[item.tempId] = item.realId;
      });
      resolve(map);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Limpa a tabela de mapeamento de IDs.
 */
export async function clearIdMappings() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('temp_id_map', 'readwrite');
    const store = tx.objectStore('temp_id_map');
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ==========================================
// EXPORTAÇÃO E IMPORTAÇÃO DE BACKUP
// ==========================================

/**
 * Gera um backup JSON de todo o banco IndexedDB.
 */
export async function getOfflineStateBackup() {
  const db = await initDB();

  const getStoreData = (storeName) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  };

  const get_cache = await getStoreData('get_cache');
  const offline_queue = await getStoreData('offline_queue');
  const temp_id_map = await getStoreData('temp_id_map');

  return {
    version: DB_VERSION,
    timestamp: Date.now(),
    get_cache,
    offline_queue,
    temp_id_map
  };
}

/**
 * Restaura o estado IndexedDB a partir de um backup JSON.
 */
export async function restoreOfflineStateBackup(backup) {
  if (!backup || typeof backup !== 'object') {
    throw new Error('Formato de backup inválido.');
  }

  const db = await initDB();

  const clearAndPopulateStore = (storeName, items) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      if (items && Array.isArray(items)) {
        items.forEach(item => {
          store.put(item);
        });
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  };

  await clearAndPopulateStore('get_cache', backup.get_cache);
  await clearAndPopulateStore('offline_queue', backup.offline_queue);
  await clearAndPopulateStore('temp_id_map', backup.temp_id_map);
}

// ==========================================
// ATUALIZAÇÃO OTIMISTA (OPTIMISTIC UPDATE)
// ==========================================

/**
 * Aplica modificações locais de forma imediata nos dados GET cacheados,
 * para que o usuário veja suas alterações no frontend mesmo offline.
 */
export async function applyOptimisticUpdate(method, path, body, tempId) {
  const updateCacheEntry = async (key, updateFn) => {
    const cached = await getCachedRequest(key);
    if (cached) {
      const updated = updateFn(cached);
      await cacheGetRequest(key, updated);
    }
  };

  const updateMatchingCaches = async (prefix, updateFn) => {
    const keys = await getAllCachedKeys();
    for (const key of keys) {
      if (key.startsWith(prefix)) {
        await updateCacheEntry(key, updateFn);
      }
    }
  };

  if (method === 'POST') {
    if (path === '/pacientes') {
      const newPaciente = {
        id: tempId,
        nome: body.nome,
        cpf: body.cpf,
        ativo: body.ativo !== undefined ? body.ativo : true,
        pode_excluir: false,
        telefone: body.telefone || '',
        data_nascimento: body.data_nascimento || '',
        email: body.email || '',
        historico_clinico: body.historico_clinico || '',
      };

      // Adiciona na lista geral e suas buscas
      await updateMatchingCaches('/pacientes', (list) => {
        if (Array.isArray(list)) {
          return [newPaciente, ...list];
        }
        return list;
      });

      // Cria detalhe individual
      await cacheGetRequest(`/pacientes/${tempId}`, newPaciente);
    }
    else if (path === '/atendimentos') {
      const newAtendimento = {
        id: tempId,
        paciente_id: body.pacienteId || body.paciente_id,
        data_hora: body.dataHora || body.data_hora || new Date().toISOString(),
        subjetivo: body.subjetivo || '',
        objetivo: body.objetivo || '',
        avaliacao: body.avaliacao || '',
        plano: body.plano || '',
        imc: body.imc || null,
        peso: body.peso || null,
        altura: body.altura || null,
        medico_id: body.medico_id || localStorage.getItem('userId'),
      };

      const pId = newAtendimento.paciente_id;

      // Adiciona na lista de atendimentos do paciente
      await updateMatchingCaches(`/atendimentos/paciente/${pId}`, (list) => {
        if (Array.isArray(list)) {
          return [newAtendimento, ...list];
        }
        return [newAtendimento];
      });

      // Salva detalhe
      await cacheGetRequest(`/atendimentos/${tempId}`, newAtendimento);
    }
    else if (path === '/anamneses') {
      const newAnamnese = {
        id: tempId,
        paciente_id: body.pacienteId || body.paciente_id,
        data_hora: body.dataHora || body.data_hora || new Date().toISOString(),
        queixa_principal: body.queixaPrincipal || body.queixa_principal || '',
        historico_doenca: body.historicoDoenca || body.historico_doenca || '',
        antecedentes_familiares: body.antecedentesFamiliares || body.antecedentes_familiares || '',
        antecedentes_pessoais: body.antecedentesPessoais || body.antecedentes_pessoais || '',
        medico_id: body.medico_id || localStorage.getItem('userId'),
      };

      const pId = newAnamnese.paciente_id;

      // Adiciona na lista de anamneses do paciente
      await updateMatchingCaches(`/anamneses/paciente/${pId}`, (list) => {
        if (Array.isArray(list)) {
          return [newAnamnese, ...list];
        }
        return [newAnamnese];
      });

      // Salva detalhe
      await cacheGetRequest(`/anamneses/${tempId}`, newAnamnese);
    }
    else if (path === '/blockchain') {
      const newBlock = {
        ...body,
        id: tempId
      };
      const pId = body.paciente_id || body.pacienteId;

      // Adiciona bloco na cadeia
      await updateMatchingCaches(`/blockchain/paciente/${pId}`, (list) => {
        if (Array.isArray(list)) {
          const updated = [...list, newBlock];
          return updated.sort((a, b) => a.indice - b.indice);
        }
        return [newBlock];
      });

      // Define como último bloco
      await cacheGetRequest(`/blockchain/paciente/${pId}/ultimo`, newBlock);
    }
    else if (path === '/anexos') {
      const newAnexo = {
        id: tempId,
        paciente_id: body.paciente_id || body.pacienteId,
        atendimento_id: body.atendimento_id || body.atendimentoId || null,
        nome_arquivo: body.nome_arquivo || body.nomeArquivo || 'Documento',
        mime_type: body.mime_type || body.mimeType || 'application/pdf',
        tamanho_bytes: body.tamanho_bytes || body.tamanhoBytes || 0,
        criado_em: new Date().toISOString(),
        medico_nome: localStorage.getItem('userName') || 'Médico',
        dados_base64: body.dados_base64
      };

      const pId = newAnexo.paciente_id;

      await updateMatchingCaches(`/anexos/paciente/${pId}`, (list) => {
        if (Array.isArray(list)) {
          return [newAnexo, ...list];
        }
        return [newAnexo];
      });

      await cacheGetRequest(`/anexos/${tempId}`, newAnexo);
    }
    else if (path === '/receitas') {
      const newReceita = {
        id: tempId,
        paciente_id: body.paciente_id || body.pacienteId,
        medicamentos: body.medicamentos || '',
        observacoes: body.observacoes || '',
        criado_em: new Date().toISOString(),
        medico_nome: localStorage.getItem('userName') || 'Médico',
        medico_crm: localStorage.getItem('userCrm') || '',
        medico_especialidade: localStorage.getItem('userEspecialidade') || ''
      };

      const pId = newReceita.paciente_id;

      await updateMatchingCaches(`/receitas/paciente/${pId}`, (list) => {
        if (Array.isArray(list)) {
          return [newReceita, ...list];
        }
        return [newReceita];
      });

      await cacheGetRequest(`/receitas/${tempId}`, newReceita);
    }
  }
  else if (method === 'PUT') {
    if (path.startsWith('/pacientes/')) {
      const id = path.split('/')[2];

      // Atualiza detalhe
      await updateCacheEntry(`/pacientes/${id}`, (paciente) => ({ ...paciente, ...body }));

      // Atualiza listagens
      await updateMatchingCaches('/pacientes', (list) => {
        if (Array.isArray(list)) {
          return list.map(p => (p.id == id) ? { ...p, ...body } : p);
        }
        return list;
      });
    }
    else if (path.startsWith('/atendimentos/')) {
      const id = path.split('/')[2];

      // Atualiza detalhe
      await updateCacheEntry(`/atendimentos/${id}`, (item) => ({ ...item, ...body }));

      // Atualiza nas listas de todos os pacientes
      const keys = await getAllCachedKeys();
      for (const key of keys) {
        if (key.startsWith('/atendimentos/paciente/')) {
          await updateCacheEntry(key, (list) => {
            if (Array.isArray(list)) {
              return list.map(item => (item.id == id) ? { ...item, ...body } : item);
            }
            return list;
          });
        }
      }
    }
    else if (path.startsWith('/anamneses/')) {
      const id = path.split('/')[2];

      // Atualiza detalhe
      await updateCacheEntry(`/anamneses/${id}`, (item) => ({ ...item, ...body }));

      // Atualiza nas listas de todos os pacientes
      const keys = await getAllCachedKeys();
      for (const key of keys) {
        if (key.startsWith('/anamneses/paciente/')) {
          await updateCacheEntry(key, (list) => {
            if (Array.isArray(list)) {
              return list.map(item => (item.id == id) ? { ...item, ...body } : item);
            }
            return list;
          });
        }
      }
    }
  }
  else if (method === 'DELETE') {
    if (path.startsWith('/pacientes/')) {
      const parts = path.split('/');
      const id = parts[2];
      const isPermanent = parts[3] === 'permanente';

      const db = await initDB();
      if (isPermanent) {
        const tx = db.transaction('get_cache', 'readwrite');
        tx.objectStore('get_cache').delete(`/pacientes/${id}`);

        await updateMatchingCaches('/pacientes', (list) => {
          if (Array.isArray(list)) {
            return list.filter(p => p.id != id);
          }
          return list;
        });
      } else {
        // Desativação
        await updateCacheEntry(`/pacientes/${id}`, (p) => ({ ...p, ativo: false }));
        await updateMatchingCaches('/pacientes', (list) => {
          if (Array.isArray(list)) {
            return list.map(p => (p.id == id) ? { ...p, ativo: false } : p);
          }
          return list;
        });
      }
    }
    else if (path.startsWith('/atendimentos/')) {
      const id = path.split('/')[2];
      const db = await initDB();
      const tx = db.transaction('get_cache', 'readwrite');
      tx.objectStore('get_cache').delete(`/atendimentos/${id}`);

      const keys = await getAllCachedKeys();
      for (const key of keys) {
        if (key.startsWith('/atendimentos/paciente/')) {
          await updateCacheEntry(key, (list) => {
            if (Array.isArray(list)) {
              return list.filter(item => item.id != id);
            }
            return list;
          });
        }
      }
    }
    else if (path.startsWith('/anamneses/')) {
      const id = path.split('/')[2];
      const db = await initDB();
      const tx = db.transaction('get_cache', 'readwrite');
      tx.objectStore('get_cache').delete(`/anamneses/${id}`);

      const keys = await getAllCachedKeys();
      for (const key of keys) {
        if (key.startsWith('/anamneses/paciente/')) {
          await updateCacheEntry(key, (list) => {
            if (Array.isArray(list)) {
              return list.filter(item => item.id != id);
            }
            return list;
          });
        }
      }
    }
    else if (path.startsWith('/anexos/')) {
      const id = path.split('/')[2];
      const db = await initDB();
      const tx = db.transaction('get_cache', 'readwrite');
      tx.objectStore('get_cache').delete(`/anexos/${id}`);

      const keys = await getAllCachedKeys();
      for (const key of keys) {
        if (key.startsWith('/anexos/paciente/')) {
          await updateCacheEntry(key, (list) => {
            if (Array.isArray(list)) {
              return list.filter(item => item.id != id);
            }
            return list;
          });
        }
      }
    }
    else if (path.startsWith('/receitas/')) {
      const id = path.split('/')[2];
      const db = await initDB();
      const tx = db.transaction('get_cache', 'readwrite');
      tx.objectStore('get_cache').delete(`/receitas/${id}`);

      const keys = await getAllCachedKeys();
      for (const key of keys) {
        if (key.startsWith('/receitas/paciente/')) {
          await updateCacheEntry(key, (list) => {
            if (Array.isArray(list)) {
              return list.filter(item => item.id != id);
            }
            return list;
          });
        }
      }
    }
  }
}

// ==========================================
// SINCRONIZAÇÃO DE DADOS (REPLAY QUEUE)
// ==========================================

/**
 * Re-executa as requisições pendentes gravadas na fila offline.
 * Mapeia IDs temporários gerados offline para os IDs corretos do servidor.
 */
export async function syncOfflineQueue(apiInstance, onProgress = null) {
  const queue = await getQueue();
  if (queue.length === 0) return { success: true, count: 0 };

  const idMap = await getAllIdMappings();

  // Substitui IDs temporários por IDs reais em strings ou objetos
  const replaceTempIds = (value, map) => {
    if (!value) return value;
    let serialized = JSON.stringify(value);

    Object.keys(map).forEach(tempId => {
      const realId = map[tempId];
      // Substitui ocorrências do tempId na string JSON
      const regex = new RegExp(tempId, 'g');
      serialized = serialized.replace(regex, realId);
    });

    return JSON.parse(serialized);
  };

  let count = 0;
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];

    if (onProgress) {
      onProgress(i, queue.length, item);
    }

    const mappedPath = replaceTempIds(item.path, idMap);
    const mappedBody = replaceTempIds(item.body, idMap);

    try {
      let response;
      if (item.method === 'POST') {
        response = await apiInstance.post(mappedPath, mappedBody);
      } else if (item.method === 'PUT') {
        response = await apiInstance.put(mappedPath, mappedBody);
      } else if (item.method === 'DELETE') {
        response = await apiInstance.delete(mappedPath);
      }

      // Se for criação (POST) e tiver um tempId mapeado, salva o ID gerado pelo servidor
      if (item.method === 'POST' && item.tempId && response && response.id) {
        const realId = response.id;
        idMap[item.tempId] = realId;
        await addIdMapping(item.tempId, realId);
      }

      // Remove item da fila com sucesso
      await removeQueueItem(item.id);
      count++;
    } catch (error) {
      console.error('Erro ao reprocessar item da fila offline:', item, error);

      const isNetworkError = error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('network error') ||
        error.message.includes('Erro de conexão') ||
        error.message.includes('Failed to establish a new connection');

      if (isNetworkError) {
        throw new Error('Sincronização interrompida: sem conexão com o servidor.' + error, { cause: error });
      }

      // Em caso de outro erro (Ex: validação 400 ou conflito 409), remove da fila
      // para não travar o fluxo indefinidamente, registrando o problema.
      await removeQueueItem(item.id);
    }
  }

  return { success: true, count };
}
