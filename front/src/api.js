import {
  cacheGetRequest,
  getCachedRequest,
  queueWriteRequest,
  applyOptimisticUpdate
} from './services/offlineService';

const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function req(method, path, body) {
  const isOnline = navigator.onLine;

  // Intercepta imediatamente se o navegador estiver offline
  if (!isOnline) {
    if (path === '/auth/login') {
      throw new Error('Não é possível realizar login em modo offline.');
    }

    if (method === 'GET') {
      const cached = await getCachedRequest(path);
      if (cached !== null) return cached;
      throw new Error('Sem conexão. Este recurso não está disponível offline.');
    } else {
      let tempId = null;
      if (method === 'POST') {
        const resource = path.split('/')[1] || 'resource';
        tempId = `temp_${resource}_${Date.now()}`;
      }

      await queueWriteRequest(method, path, body, tempId);
      await applyOptimisticUpdate(method, path, body, tempId);

      // Dispara um evento global para notificar alterações na fila offline
      window.dispatchEvent(new Event('offline-queue-changed'));

      return method === 'POST'
        ? { id: tempId, ...body, _offline: true }
        : { ...body, _offline: true };
    }
  }

  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401 && path !== '/auth/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw new Error(data.erro || data.message || 'Erro');
    }

    // Se a chamada GET foi bem sucedida online, atualizamos o cache local
    if (method === 'GET') {
      await cacheGetRequest(path, data);
      
      // Auto-cache individual items to support offline editing
      if (Array.isArray(data)) {
        const resource = path.split('/')[1]; // ex: 'atendimentos', 'pacientes'
        if (resource) {
          for (const item of data) {
            if (item && item.id) {
              await cacheGetRequest(`/${resource}/${item.id}`, item);
            }
          }
        }
      }
    }

    return data;
  } catch (error) {
    // Intercepta falhas de conexão de rede físicas (ex. servidor fora do ar)
    const isNetworkError = error.message.includes('Failed to fetch') || 
                           error.message.includes('NetworkError') || 
                           error.message.includes('network error') ||
                           error.message.includes('Failed to establish a new connection') ||
                           error instanceof TypeError;

    if (isNetworkError) {
      if (path === '/auth/login') {
        throw new Error('Erro de conexão com o servidor. Login impossível.', { cause: error });
      }

      if (method === 'GET') {
        const cached = await getCachedRequest(path);
        if (cached !== null) return cached;
        throw new Error('Erro de conexão. Recurso não disponível offline.', { cause: error });
      } else {
        let tempId = null;
        if (method === 'POST') {
          const resource = path.split('/')[1] || 'resource';
          tempId = `temp_${resource}_${Date.now()}`;
        }

        await queueWriteRequest(method, path, body, tempId);
        await applyOptimisticUpdate(method, path, body, tempId);

        window.dispatchEvent(new Event('offline-queue-changed'));

        return method === 'POST'
          ? { id: tempId, ...body, _offline: true }
          : { ...body, _offline: true };
      }
    }

    throw error;
  }
}

export const api = {
  get:    (path)        => req('GET',    path),
  post:   (path, body)  => req('POST',   path, body),
  put:    (path, body)  => req('PUT',    path, body),
  delete: (path)        => req('DELETE', path),
};