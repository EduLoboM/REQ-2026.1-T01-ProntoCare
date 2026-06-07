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

  const updateQueueSize = useCallback(async () => {
    try {
      const size = await getQueueSize();
      setQueueSize(size);
      if (size > 0) {
        // Auto-expande se tiver itens pendentes
        setIsExpanded(true);
      }
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
        
        // Se houve itens sincronizados, recarrega a página para atualizar os IDs e dados
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
    // Atualiza o tamanho inicial da fila
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateQueueSize();

    const handleOnline = () => {
      setIsOnline(true);
      // Sincroniza automaticamente ao reconectar
      triggerAutoSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Auto-expande para alertar o usuário sobre o modo offline
      setIsExpanded(true);
    };

    const handleQueueChanged = () => {
      updateQueueSize();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offline-queue-changed', handleQueueChanged);

    // Periodicamente verifica a fila e conectividade
    const interval = setInterval(() => {
      updateQueueSize();
      // Se a conexão voltou mas o evento não disparou
      if (navigator.onLine !== isOnline) {
        setIsOnline(navigator.onLine);
        if (navigator.onLine) triggerAutoSync();
      }
    }, 5000);

    // Se iniciar online com fila pendente, tenta sincronizar
    if (navigator.onLine) {
      triggerAutoSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-queue-changed', handleQueueChanged);
      clearInterval(interval);
    };
  }, [isOnline, updateQueueSize, triggerAutoSync]);

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

  // Se estiver online e sem alterações pendentes, renderiza um botão minimalista expansível
  if (!isExpanded && isOnline && queueSize === 0) {
    return (
      <div 
        className="offline-status-pill online" 
        onClick={() => setIsExpanded(true)}
        title="Clique para ver opções de backup offline"
      >
        <span className="dot online-dot"></span>
        <span className="pill-text">Online</span>
      </div>
    );
  }

  return (
    <div className={`offline-status-bar ${isOnline ? 'online' : 'offline'}`}>
      <div className="status-bar-header">
        <div className="status-indicator" onClick={() => queueSize === 0 && isOnline && setIsExpanded(false)}>
          <span className={`dot ${isOnline ? 'online-dot' : 'offline-dot'}`}></span>
          <span className="status-title">
            {isOnline ? 'Conectado ao Servidor' : 'Trabalhando Offline (Sem Conexão)'}
          </span>
        </div>
        
        {isOnline && queueSize === 0 && (
          <button className="btn-minimize" onClick={() => setIsExpanded(false)}>
            Recolher
          </button>
        )}
      </div>

      <div className="status-bar-body">
        {queueSize > 0 ? (
          <div className="sync-section">
            <span className="sync-count-text">
              Existem <strong>{queueSize}</strong> alteração(ões) pendente(s) localmente.
            </span>
            {isOnline ? (
              <button 
                className="btn-sync" 
                onClick={handleSync} 
                disabled={isSyncing}
              >
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
              </button>
            ) : (
              <span className="sync-waiting-text">Aguardando conexão para sincronizar...</span>
            )}
          </div>
        ) : (
          <span className="sync-ok-text">Todos os dados locais estão sincronizados.</span>
        )}

        {isSyncing && <div className="sync-progress">{syncProgress}</div>}
        {statusMessage && <div className="status-feedback">{statusMessage}</div>}

        <div className="backup-actions">
          <button className="btn-backup-action" onClick={handleExportBackup} title="Exporta todo o cache e fila atual como JSON">
            Baixar Backup Offline
          </button>
          
          <button className="btn-backup-action" onClick={() => fileInputRef.current?.click()} title="Importa dados de cache de um arquivo JSON">
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
    </div>
  );
}
