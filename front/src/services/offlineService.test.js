import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  cacheGetRequest,
  getCachedRequest,
  getAllCachedKeys,
  queueWriteRequest,
  getQueue,
  getQueueSize,
  removeQueueItem,
  clearQueue,
  addIdMapping,
  getIdMapping,
  getAllIdMappings,
  clearIdMappings,
  getOfflineStateBackup,
  restoreOfflineStateBackup,
  applyOptimisticUpdate,
  syncOfflineQueue
} from './offlineService';

// ==========================================
// SIMULADORES E MOCKS DE APIs DO NAVEGADOR
// ==========================================

const mockStores = {
  get_cache: new Map(),
  offline_queue: new Map(),
  temp_id_map: new Map()
};

let queueAutoIncrement = 1;

class MockRequest {
  constructor() {
    this.onsuccess = null;
    this.onerror = null;
    this.onupgradeneeded = null;
  }
}

class MockTransaction {
  constructor(stores, mode) {
    this.stores = stores;
    this.mode = mode;
    this.oncomplete = null;
    this.onerror = null;
  }
  objectStore(name) {
    return new MockObjectStore(name, this.stores[name]);
  }
}

class MockObjectStore {
  constructor(name, dataMap) {
    this.name = name;
    this.dataMap = dataMap;
  }

  get(key) {
    const req = new MockRequest();
    setTimeout(() => {
      req.result = this.dataMap.get(key) || null;
      if (req.onsuccess) req.onsuccess({ target: req });
    }, 0);
    return req;
  }

  put(value) {
    const req = new MockRequest();
    setTimeout(() => {
      const key = this.name === 'get_cache' ? value.path : (this.name === 'temp_id_map' ? value.tempId : value.id);
      this.dataMap.set(key, value);
      req.result = key;
      if (req.onsuccess) req.onsuccess({ target: req });
    }, 0);
    return req;
  }

  add(value) {
    const req = new MockRequest();
    setTimeout(() => {
      const id = value.id || queueAutoIncrement++;
      value.id = id;
      this.dataMap.set(id, value);
      req.result = id;
      if (req.onsuccess) req.onsuccess({ target: req });
    }, 0);
    return req;
  }

  delete(key) {
    const req = new MockRequest();
    setTimeout(() => {
      // IndexedDB deletes keys. For numbers represented as string keys, we check both.
      this.dataMap.delete(key);
      this.dataMap.delete(Number(key));
      if (req.onsuccess) req.onsuccess({ target: req });
    }, 0);
    return req;
  }

  clear() {
    const req = new MockRequest();
    setTimeout(() => {
      this.dataMap.clear();
      if (req.onsuccess) req.onsuccess({ target: req });
    }, 0);
    return req;
  }

  getAll() {
    const req = new MockRequest();
    setTimeout(() => {
      req.result = Array.from(this.dataMap.values());
      if (req.onsuccess) req.onsuccess({ target: req });
    }, 0);
    return req;
  }

  getAllKeys() {
    const req = new MockRequest();
    setTimeout(() => {
      req.result = Array.from(this.dataMap.keys());
      if (req.onsuccess) req.onsuccess({ target: req });
    }, 0);
    return req;
  }
}

class MockDB {
  constructor(stores) {
    this.stores = stores;
    this.objectStoreNames = {
      contains: () => true
    };
  }
  transaction(storeNames, mode) {
    const tx = new MockTransaction(this.stores, mode);
    setTimeout(() => {
      if (tx.oncomplete) tx.oncomplete();
    }, 5);
    return tx;
  }
}

// Configura o indexedDB globalmente nos testes
globalThis.indexedDB = {
  open: () => {
    const req = new MockRequest();
    setTimeout(() => {
      req.result = new MockDB(mockStores);
      if (req.onsuccess) req.onsuccess({ target: req });
    }, 0);
    return req;
  }
};

// Configura localStorage global
globalThis.localStorage = {
  getItem: vi.fn((key) => {
    if (key === 'userId') return 'medico_123';
    return null;
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

// Configura navigator global
Object.defineProperty(globalThis, 'navigator', {
  value: { onLine: true },
  writable: true,
  configurable: true
});

// Configura window global
Object.defineProperty(globalThis, 'window', {
  value: {
    dispatchEvent: vi.fn(),
    location: { reload: vi.fn() }
  },
  writable: true,
  configurable: true
});


// ==========================================
// TESTES UNITÁRIOS E DE INTEGRAÇÃO LOCAL
// ==========================================

describe('offlineService', () => {
  beforeEach(() => {
    mockStores.get_cache.clear();
    mockStores.offline_queue.clear();
    mockStores.temp_id_map.clear();
    queueAutoIncrement = 1;
    vi.clearAllMocks();
  });

  describe('Gerenciamento de Cache (GET)', () => {
    it('deve armazenar e recuperar respostas GET com sucesso', async () => {
      const path = '/pacientes?nome=joao';
      const testData = [{ id: 1, nome: 'João da Silva' }];

      await cacheGetRequest(path, testData);
      const retrieved = await getCachedRequest(path);

      expect(retrieved).toEqual(testData);
    });

    it('deve retornar null se o recurso não estiver cacheado', async () => {
      const retrieved = await getCachedRequest('/inexistente');
      expect(retrieved).toBeNull();
    });

    it('deve listar todas as chaves cacheadas', async () => {
      await cacheGetRequest('/p1', { a: 1 });
      await cacheGetRequest('/p2', { b: 2 });

      const keys = await getAllCachedKeys();
      expect(keys).toContain('/p1');
      expect(keys).toContain('/p2');
    });
  });

  describe('Fila de Gravação Offline (Queue)', () => {
    it('deve enfileirar requisições e reportar o tamanho correto da fila', async () => {
      await queueWriteRequest('POST', '/pacientes', { nome: 'Maria' }, 'temp_1');
      await queueWriteRequest('PUT', '/pacientes/2', { ativo: false });

      const size = await getQueueSize();
      expect(size).toBe(2);

      const queue = await getQueue();
      expect(queue[0].method).toBe('POST');
      expect(queue[0].tempId).toBe('temp_1');
      expect(queue[1].method).toBe('PUT');
    });

    it('deve remover itens individuais da fila por ID', async () => {
      const id1 = await queueWriteRequest('POST', '/pacientes', { nome: 'Test' });
      const id2 = await queueWriteRequest('PUT', '/pacientes/2', { nome: 'Test2' });

      await removeQueueItem(id1);
      const queue = await getQueue();

      expect(queue.length).toBe(1);
      expect(queue[0].id).toBe(id2);
    });

    it('deve limpar toda a fila com sucesso', async () => {
      await queueWriteRequest('POST', '/pacientes', { a: 1 });
      await queueWriteRequest('POST', '/atendimentos', { b: 2 });

      await clearQueue();
      const size = await getQueueSize();
      expect(size).toBe(0);
    });
  });

  describe('Mapeamento de IDs temporários para reais', () => {
    it('deve registrar e retornar mapeamento de IDs', async () => {
      await addIdMapping('temp_paciente_123', 45);

      const realId = await getIdMapping('temp_paciente_123');
      expect(realId).toBe(45);

      const allMaps = await getAllIdMappings();
      expect(allMaps['temp_paciente_123']).toBe(45);
    });

    it('deve limpar mapeamentos', async () => {
      await addIdMapping('temp_pac_1', 12);
      await clearIdMappings();

      const realId = await getIdMapping('temp_pac_1');
      expect(realId).toBeNull();
    });
  });

  describe('Atualizações Otimistas (Optimistic Updates)', () => {
    it('deve aplicar optimistic updates em listagem de pacientes no POST', async () => {
      // Configura cache prévio de listagem
      const cacheKey = '/pacientes';
      const initialList = [{ id: 1, nome: 'João da Silva', ativo: true }];
      await cacheGetRequest(cacheKey, initialList);

      // Executa POST offline
      const body = { nome: 'Maria Souza', cpf: '000.000.000-00' };
      const tempId = 'temp_pacientes_999';
      await applyOptimisticUpdate('POST', '/pacientes', body, tempId);

      // Verifica se a lista foi atualizada com o novo paciente no topo
      const updatedList = await getCachedRequest(cacheKey);
      expect(updatedList.length).toBe(2);
      expect(updatedList[0].id).toBe(tempId);
      expect(updatedList[0].nome).toBe('Maria Souza');

      // Verifica se o detalhe do paciente também foi criado individualmente
      const detail = await getCachedRequest(`/pacientes/${tempId}`);
      expect(detail).toBeDefined();
      expect(detail.nome).toBe('Maria Souza');
    });

    it('deve aplicar optimistic updates no PUT de paciente', async () => {
      // Configura cache prévio
      await cacheGetRequest('/pacientes/45', { id: 45, nome: 'Pedro', ativo: true });
      await cacheGetRequest('/pacientes', [{ id: 45, nome: 'Pedro', ativo: true }]);

      // Executa PUT
      await applyOptimisticUpdate('PUT', '/pacientes/45', { nome: 'Pedro Alterado' });

      const detail = await getCachedRequest('/pacientes/45');
      expect(detail.nome).toBe('Pedro Alterado');

      const list = await getCachedRequest('/pacientes');
      expect(list[0].nome).toBe('Pedro Alterado');
    });

    it('deve aplicar desativação (soft delete) no DELETE de paciente', async () => {
      await cacheGetRequest('/pacientes/45', { id: 45, nome: 'Pedro', ativo: true });
      await cacheGetRequest('/pacientes', [{ id: 45, nome: 'Pedro', ativo: true }]);

      await applyOptimisticUpdate('DELETE', '/pacientes/45');

      const detail = await getCachedRequest('/pacientes/45');
      expect(detail.ativo).toBe(false);

      const list = await getCachedRequest('/pacientes');
      expect(list[0].ativo).toBe(false);
    });

    it('deve aplicar optimistic updates no POST e DELETE de anexo', async () => {
      const cacheKey = '/anexos/paciente/10';
      await cacheGetRequest(cacheKey, []);

      // POST anexo
      const body = { pacienteId: 10, nome_arquivo: 'laudo.pdf', dados_base64: 'base64data' };
      const tempId = 'temp_anexos_999';
      await applyOptimisticUpdate('POST', '/anexos', body, tempId);

      const list = await getCachedRequest(cacheKey);
      expect(list.length).toBe(1);
      expect(list[0].id).toBe(tempId);
      expect(list[0].nome_arquivo).toBe('laudo.pdf');

      const detail = await getCachedRequest(`/anexos/${tempId}`);
      expect(detail).toBeDefined();
      expect(detail.dados_base64).toBe('base64data');

      // DELETE anexo
      await applyOptimisticUpdate('DELETE', `/anexos/${tempId}`);
      const listAfterDelete = await getCachedRequest(cacheKey);
      expect(listAfterDelete.length).toBe(0);
    });

    it('deve aplicar optimistic updates no POST e DELETE de receita', async () => {
      const cacheKey = '/receitas/paciente/10';
      await cacheGetRequest(cacheKey, []);

      // POST receita
      const body = { pacienteId: 10, medicamentos: 'Dipirona 500mg', observacoes: 'Tomar de 6/6h' };
      const tempId = 'temp_receitas_888';
      await applyOptimisticUpdate('POST', '/receitas', body, tempId);

      const list = await getCachedRequest(cacheKey);
      expect(list.length).toBe(1);
      expect(list[0].id).toBe(tempId);
      expect(list[0].medicamentos).toBe('Dipirona 500mg');

      const detail = await getCachedRequest(`/receitas/${tempId}`);
      expect(detail).toBeDefined();
      expect(detail.medicamentos).toBe('Dipirona 500mg');

      // DELETE receita
      await applyOptimisticUpdate('DELETE', `/receitas/${tempId}`);
      const listAfterDelete = await getCachedRequest(cacheKey);
      expect(listAfterDelete.length).toBe(0);
    });
  });

  describe('Sincronização de Fila Offline (Replay)', () => {
    it('deve reprocessar a fila, traduzir IDs temporários e limpar itens processados', async () => {
      // Enfileira duas requisições dependentes
      // 1. Criação do paciente offline (retornará ID real 99)
      const tempPatientId = 'temp_pacientes_1';
      await queueWriteRequest('POST', '/pacientes', { nome: 'Paciente Offline' }, tempPatientId);

      // 2. Criação do atendimento fazendo referência ao paciente offline
      await queueWriteRequest('POST', '/atendimentos', { pacienteId: tempPatientId, notas: 'Consulta 1' });

      // Mock da API
      const mockApi = {
        post: vi.fn()
          .mockResolvedValueOnce({ id: 99, nome: 'Paciente Offline' }) // retorna ID 99 pro primeiro POST
          .mockResolvedValueOnce({ id: 200, pacienteId: 99, notas: 'Consulta 1' }) // segundo POST
      };

      const result = await syncOfflineQueue(mockApi);

      expect(result.success).toBe(true);
      expect(result.count).toBe(2);

      // O primeiro POST deve ter sido feito normalmente
      expect(mockApi.post).toHaveBeenNthCalledWith(1, '/pacientes', { nome: 'Paciente Offline' });

      // O segundo POST deve ter sido chamado com o ID traduzido (99 ao invés de temp_pacientes_1)
      expect(mockApi.post).toHaveBeenNthCalledWith(2, '/atendimentos', { pacienteId: '99', notas: 'Consulta 1' });

      // Fila deve estar limpa
      const remainingQueue = await getQueue();
      expect(remainingQueue.length).toBe(0);

      // ID mapeado deve persistir no IndexedDB
      const realId = await getIdMapping(tempPatientId);
      expect(realId).toBe(99);
    });
  });

  describe('Backup e Restauração', () => {
    it('deve exportar todo o estado das tabelas e restaurá-los com sucesso', async () => {
      // Popula dados
      await cacheGetRequest('/p1', { val: 100 });
      await queueWriteRequest('POST', '/pacientes', { nome: 'B1' });
      await addIdMapping('temp_x', 99);

      // Gera backup
      const backup = await getOfflineStateBackup();
      expect(backup.get_cache.length).toBe(1);
      expect(backup.offline_queue.length).toBe(1);
      expect(backup.temp_id_map.length).toBe(1);

      // Limpa dados atuais
      mockStores.get_cache.clear();
      mockStores.offline_queue.clear();
      mockStores.temp_id_map.clear();

      // Restaura do backup
      await restoreOfflineStateBackup(backup);

      // Verifica dados restaurados
      const cached = await getCachedRequest('/p1');
      expect(cached.val).toBe(100);

      const queue = await getQueue();
      expect(queue[0].body.nome).toBe('B1');

      const realId = await getIdMapping('temp_x');
      expect(realId).toBe(99);
    });
  });
});
