# Cronograma e entregas

### 6 Cronograma e entregas

A partir da estratégia de desenvolvimento ScrumXP estabelecida, tem-se a seguinte proposta de cronograma. Cada sprint entrega um incremento funcional **integrado e testado** — não há sprints dedicadas exclusivamente a integração ou testes. Os RNFs críticos (segurança, privacidade, auditoria, integridade, conformidade) são tratados de forma **transversal** desde a Sprint 2, incorporados em cada funcionalidade à medida que são desenvolvidas.

<div class="cronograma-table-container" markdown="1">

| Sprint | Início | Fim | Objetivo principal | CPs | Entregas esperadas | RNFs transversais nesta sprint | Validação do cliente |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Sprint 0 | 19/04/26 | 02/05/26 | Configuração e arquitetura inicial | - | Ambiente configurado. Arquitetura inicial. | - | N/A (Validação interna) |
| Sprint 1 | 03/05/26 | 09/05/26 | Cadastro de pacientes | CP1, CP6 | Cadastro de pacientes com autenticação. **Entrega parcial 1:** módulo de cadastro funcional. | Controle de acesso básico; dados sensíveis protegidos no cadastro. | Validação do fluxo de cadastro e controle de acesso com o Dr. Rogério. |
| Sprint 2 | 10/05/26 | 16/05/26 | Prontuário SOAP (Estrutura base) | CP1 | Estrutura SOAP inicial. Integração com cadastro. | Privacidade (acesso restrito ao perfil autorizado). | Feedback sobre estrutura base do SOAP. |
| Sprint 3 | 17/05/26 | 23/05/26 | Histórico clínico e protocolos | CP3 | Campos guiados por protocolos (CID-10). **Entrega parcial 2:** prontuário SOAP funcional. | Início da auditoria de acesso aos registros. | Feedback sobre campos clínicos e fluxo de consulta. |
| Sprint 4 | 24/05/26 | 30/05/26 | Integridade documental (Cadeia criptográfica) | CP4 | Cadeia de integridade criptográfica. | Integridade documental verificável. | Validação da verificação de integridade. |
| Sprint 5 | 31/05/26 | 06/06/26 | Exportação de dados e Auditoria | CP7, CP9 | Exportação de dados do prontuário (JSON, PDF). Log completo de auditoria. | Rastreabilidade completa de operações; não repúdio. | Validação dos logs de auditoria e exportação com o Dr. Rogério. |
| Sprint 6 | 07/06/26 | 13/06/26 | Operação offline (Armazenamento local) | CP5 | Armazenamento local (PWA/Dexie.js). | Privacidade no armazenamento local. | Validação do funcionamento básico offline. |
| Sprint 7 | 14/06/26 | 20/06/26 | Sincronização automática | CP2 | Sincronização automática. Acesso em múltiplos contextos. **Entrega parcial 3:** operação offline funcional. | Integridade mantida offline; conflitos de sincronização tratados. | Teste do fluxo offline → online com o Dr. Rogério; validação em cenário de atendimento domiciliar. |
| Sprint 8 | 21/06/26 | 27/06/26 | Agenda, Consultas e Segurança | CP2, CP6 | Interface de calendário semanal (RF10), agendamento (RF11), painel diário (RF12), status de consultas (RF13), criptografia bcrypt (RNF02) e conformidade CFM/SBIS (RNF05). Módulo de consultas e segurança funcional. | RNF02, RNF05 | Validação do fluxo de agendamento e controles de privacidade com o Dr. Rogério. |
| Sprint 9 | 28/06/26 | 02/07/26 | Emissão de documentos, Homologação e Entrega Final | Todas | Emissão e assinatura digital de receitas (RF15) e prontuários (RF08) com ICP-Brasil. Homologação formal e encerramento do MVP. **Entrega final:** MVP homologado e integrado (Encerramento da disciplina dia 02/07). | RNF09, RNF05, RNF08 | Homologação final e termo de aceite de entrega com o Dr. Rogério. |

</div>

**Princípios do cronograma**

- **Duração padronizada**: a Sprint 0 tem duração de 2 semanas (para ambientação e infraestrutura inicial). As sprints 1 a 8 têm duração fixa de exata 1 semana, e a Sprint 9 possui duração reduzida de 5 dias devido ao encerramento da disciplina em 02/07/26, data da entrega final do MVP homologado.
- **Integração contínua**: cada sprint entrega código integrado ao sistema existente, testado e funcional — não há sprint de "integração de módulos".
- **Testes a cada sprint**: TDD e testes de integração são executados em todas as sprints, não apenas ao final. A Sprint 9 foca em testes, validação de segurança e de aceitação com o cliente.
- **RNFs transversais**: segurança, privacidade, auditoria, integridade e conformidade são incorporados em cada funcionalidade desde a Sprint 1. A coluna "RNFs transversais" explicita quais aspectos são tratados em cada sprint.
- **Validação clínica contínua**: o Dr. Rogério valida funcionalidades ao final de cada sprint, não apenas na homologação final.
- **Cobertura das CPs**: todas as características de produto (CP1–CP9) estão mapeadas nas sprints, garantindo rastreabilidade entre o cronograma e a seção 2.3.

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 26-02-10 | 0.1 | Elaboração inicial da visão do produto e projeto. | Prontuariantes |
| 26-02-24 | 0.2 | Refinamento do escopo após reuniões de elicitação com o cliente. | Prontuariantes |
| 26-03-10 | 0.3 | Definição da arquitetura documental e cadeia de autenticidade. | Prontuariantes |
| 26-03-25 | 0.4 | Delimitação do escopo reduzido do MVP e revisão geral. | Prontuariantes |
| 26-04-11 | 0.5 | Correções conforme revisão do professor; inclusão das seções 2.4 a 6. | Prontuariantes |
| 26-04-13 | 0.6 | Últimas revisões antes da primeira entrega. | Prontuariantes |
| 26-05-03 | 0.7 | Reestruturação do cronograma: cobertura de todas as CPs, RNFs transversais, eliminação de mini-cascata, integração e testes contínuos. | Prontuariantes |
| 26-05-03 | 0.8 | Ajuste de datas das sprints (19/04 a 13/07) para se adequar ao semestre letivo atual. | Prontuariantes |
| 26-05-03 | 0.9 | Condensação para 6 sprints de 2 semanas exatas, para manter consistência com as regras da equipe. | Prontuariantes |
| 2026-05-04 | 1.0 | Ajuste para sprints de 1 semana (exceto Sprint 0 com 2 semanas). | Prontuariantes |
| 2026-06-29 | 1.1 | Ajuste do cronograma para encerramento da disciplina em 02/07/26 (redução para 9 Sprints). | Prontuariantes |