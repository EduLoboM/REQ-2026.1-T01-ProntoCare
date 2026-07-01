/**
 * sw.js — RNF03
 * Service Worker para habilitar o carregamento offline da aplicação (PWA).
 * 
 * Cacheia arquivos estáticos (HTML, JS, CSS, imagens) no navegador,
 * ignorando chamadas de API (/api/*) para evitar interferência com a camada de dados local.
 */

const CACHE_NAME = 'prontocare-static-cache-v1';

// Recursos iniciais a serem cacheados durante o registro (opcional)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/FAVICON.png',
  '/MASCOTE.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Erro ao pré-cachear arquivos estáticos iniciais:', err);
      });
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Ignora requisições de API (gerenciadas por api.js via IndexedDB)
  // Ignora métodos de escrita (POST, PUT, DELETE)
  // Ignora extensões de navegador ou URLs externas (não pertencentes ao mesmo domínio)
  if (
    url.pathname.startsWith('/api/') || 
    e.request.method !== 'GET' || 
    !e.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  // Estratégia: Network First (Tenta rede, se falhar cai no cache)
  // Essencial para ambiente de desenvolvimento e produção receber atualizações
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Se for uma requisição de navegação de página (SPA routes), serve o index.html cacheado
          if (e.request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          
          return new Response('Sem conexão: Recurso estático indisponível offline.', {
            status: 503,
            statusText: 'Service Unavailable (Offline)'
          });
        });
      })
  );
});
