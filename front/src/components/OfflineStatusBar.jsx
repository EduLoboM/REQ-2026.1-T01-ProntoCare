import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../api';
import {
  getQueueSize,
  syncOfflineQueue,
  getOfflineStateBackup,
  restoreOfflineStateBackup
} from '../services/offlineService';
import './OfflineStatusBar.css';

export default function OfflineStatusBar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const updateQueueSize = useCallback(async () => {
    try {
      const size = await getQueueSize();
      setQueueSize(size);
    } catch (e) {
      console.error('Erro ao ler tamanho da fila offline:', e);
    }
  }, []);

  const handleSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress('Iniciando sincronização...');
    setStatusMessage('');

    try {
      const result = await syncOfflineQueue(api, (current, total) => {
        setSyncProgress(`Sincronizando: ${current + 1} de ${total} alteração(ões)...`);
      });

      if (result.success) {
        setQueueSize(0);
        setStatusMessage(result.count > 0 ? 'Sincronização concluída!' : '');
        setSyncProgress('');
        
        if (result.count > 0) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Falha na sincronização:', error);
      setStatusMessage(error.message || 'Erro ao sincronizar com o servidor.');
      setSyncProgress('');
    } finally {
      setIsSyncing(false);
      updateQueueSize();
    }
  }, [isSyncing, updateQueueSize]);

  const triggerAutoSync = useCallback(async () => {
    const size = await getQueueSize();
    if (size > 0 && !isSyncing) {
      handleSync();
    }
  }, [isSyncing, handleSync]);

  useEffect(() => {
    setTimeout(() => {
      updateQueueSize();
    }, 0);

    const handleOnline = () => {
      setIsOnline(true);
      triggerAutoSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleQueueChanged = () => {
      updateQueueSize();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offline-queue-changed', handleQueueChanged);

    const interval = setInterval(() => {
      updateQueueSize();
      if (navigator.onLine !== isOnline) {
        setIsOnline(navigator.onLine);
        if (navigator.onLine) triggerAutoSync();
      }
    }, 5000);

    if (navigator.onLine) {
      setTimeout(() => {
        triggerAutoSync();
      }, 0);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-queue-changed', handleQueueChanged);
      clearInterval(interval);
    };
  }, [isOnline, updateQueueSize, triggerAutoSync]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleExportBackup = async () => {
    try {
      const backup = await getOfflineStateBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `prontocare_backup_offline_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      setStatusMessage('Backup baixado com sucesso!');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (e) {
      alert('Erro ao exportar backup: ' + e.message);
    }
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmacao = window.confirm(
      'Aviso: A restauração de um backup substituirá todos os dados offline e a fila atual por este arquivo. Deseja continuar?'
    );
    if (!confirmacao) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        await restoreOfflineStateBackup(backup);
        alert('Backup offline importado com sucesso! A aplicação será recarregada.');
        window.location.reload();
      } catch (err) {
        console.error('Erro ao importar backup:', err);
        alert('Erro ao restaurar backup: Arquivo inválido ou corrompido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="offline-status-container" ref={dropdownRef}>
      <div 
        className={`offline-status-badge ${isOnline ? 'online' : 'offline'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isOnline ? '● Conectado' : '● Offline'}
      </div>

      {isExpanded && (
        <div className="offline-dropdown-card">
          <div className="offline-dropdown-header">
            <h3 className="offline-dropdown-title">
              {isOnline ? 'Conectado ao Servidor' : 'Trabalhando Offline'}
            </h3>
            {queueSize === 0 ? (
              <p className="offline-dropdown-subtitle">Todos os dados locais estão sincronizados.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Existem <strong>{queueSize}</strong> alteração(ões) pendente(s) localmente.
                </p>
                {isOnline ? (
                  <button className="btn-offline-sync" onClick={handleSync} disabled={isSyncing}>
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                  </button>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--danger)', fontStyle: 'italic' }}>
                    Aguardando conexão para sincronizar...
                  </p>
                )}
              </div>
            )}

            {isSyncing && <p className="offline-dropdown-msg">{syncProgress}</p>}
            {statusMessage && <p className="offline-dropdown-msg">{statusMessage}</p>}
          </div>

          <div className="offline-dropdown-footer">
            <button className="btn-offline-secundario" onClick={handleExportBackup}>
              Baixar Backup Offline
            </button>
            <button className="btn-offline-secundario" onClick={() => fileInputRef.current?.click()}>
              Restaurar Backup Offline
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportBackup} 
              accept=".json" 
              style={{ display: 'none' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
