CREATE TABLE IF NOT EXISTS medicos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  crm VARCHAR(20) NOT NULL UNIQUE,
  especialidade VARCHAR(100),
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pacientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  data_nascimento DATE,
  sexo VARCHAR(1),
  nome_mae VARCHAR(150),
  email VARCHAR(150) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  cep VARCHAR(10),
  numero VARCHAR(20),
  senha_hash VARCHAR(255) NOT NULL,
  medico_id INT REFERENCES medicos(id) ON DELETE SET NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_medicos_atualizado ON medicos;
CREATE TRIGGER trg_medicos_atualizado
  BEFORE UPDATE ON medicos
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

DROP TRIGGER IF EXISTS trg_pacientes_atualizado ON pacientes;
CREATE TRIGGER trg_pacientes_atualizado
  BEFORE UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE IF NOT EXISTS atendimentos (
  id SERIAL PRIMARY KEY,
  paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  medico_id INT NOT NULL REFERENCES medicos(id) ON DELETE CASCADE,
  peso NUMERIC(5,2),
  altura NUMERIC(4,2),
  imc NUMERIC(5,2),
  subjetivo TEXT,
  objetivo TEXT,
  avaliacao TEXT,
  plano TEXT,
  finalizado BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_atendimentos_atualizado ON atendimentos;
CREATE TRIGGER trg_atendimentos_atualizado
  BEFORE UPDATE ON atendimentos
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- Log de auditoria: registra cada alteração campo a campo
CREATE TABLE IF NOT EXISTS log_alteracoes (
  id SERIAL PRIMARY KEY,
  paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  entidade VARCHAR(30) NOT NULL,          -- 'paciente', 'atendimento'
  entidade_id INT NOT NULL,               -- id do registro alterado
  acao VARCHAR(20) NOT NULL,              -- 'criacao', 'edicao', 'exclusao', 'desativacao', 'reativacao'
  campo VARCHAR(80),                      -- nome do campo alterado (null para criacao/exclusao)
  valor_anterior TEXT,                    -- valor antigo (null para criacao)
  valor_novo TEXT,                        -- valor novo (null para exclusao)
  usuario_id INT,                         -- quem fez a alteração
  usuario_nome VARCHAR(150),              -- nome legível de quem fez
  usuario_role VARCHAR(20),               -- 'medico', 'admin'
  ip VARCHAR(45),                         -- IP de onde fez a alteração (suporta IPv6)
  user_agent TEXT,                        -- Navegador / User Agent de onde fez a alteração
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_log_paciente ON log_alteracoes (paciente_id, criado_em DESC);

-- Tabela de Anamnese
CREATE TABLE IF NOT EXISTS anamneses (
  id SERIAL PRIMARY KEY,
  paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  medico_id INT NOT NULL REFERENCES medicos(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_anamneses_atualizado ON anamneses;
CREATE TRIGGER trg_anamneses_atualizado
  BEFORE UPDATE ON anamneses
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- RNF08: Blockchain de integridade de prontuários
-- Cada bloco armazena o hash SHA-256 do conteúdo do prontuário e do PDF exportado,
-- vinculado ao bloco anterior formando uma cadeia imutável.
-- Edições geram novos blocos (versionados) mantendo o histórico completo.
CREATE TABLE IF NOT EXISTS prontuario_blockchain (
  id SERIAL PRIMARY KEY,
  paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  indice INT NOT NULL,                         -- posição na cadeia do paciente
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- momento de criação do bloco
  tipo VARCHAR(20) NOT NULL,                   -- 'genesis', 'exportacao', 'edicao'
  entidade VARCHAR(30),                        -- 'atendimento', 'anamnese'
  entidade_id INT,                             -- id do registro (atendimento ou anamnese)
  versao INT NOT NULL DEFAULT 1,               -- versão do documento
  dados_hash VARCHAR(64) NOT NULL,             -- SHA-256 do conteúdo canônico do prontuário
  pdf_hash VARCHAR(64),                        -- SHA-256 do arquivo PDF exportado
  hash_anterior VARCHAR(64) NOT NULL,          -- hash do bloco anterior na cadeia
  hash VARCHAR(64) NOT NULL,                   -- hash SHA-256 deste bloco
  bloco_original_id INT,                       -- referência ao bloco original (para edições)
  usuario_id INT,
  usuario_nome VARCHAR(150),
  usuario_role VARCHAR(20),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blockchain_paciente ON prontuario_blockchain (paciente_id, indice);
CREATE INDEX IF NOT EXISTS idx_blockchain_entidade ON prontuario_blockchain (entidade, entidade_id);

-- Alterações para o RNF05: Garante colunas de IP e navegador em bancos existentes
ALTER TABLE log_alteracoes ADD COLUMN IF NOT EXISTS ip VARCHAR(45);
ALTER TABLE log_alteracoes ADD COLUMN IF NOT EXISTS user_agent TEXT;