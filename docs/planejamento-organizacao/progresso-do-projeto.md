# **Acompanhamento de Progresso e Entregas do Projeto (ProntoCare)**

## 1. MVP Planejado vs. MVP Realmente Entregue
O planejamento inicial do ProntoCare (Definition of Ready) contemplou um escopo de **22 User Stories (US)** para compor o Mínimo Produto Viável (MVP). Nosso objetivo foi entregar uma jornada clínica completa, englobando desde o cadastro de pacientes até o agendamento de consultas e emissão de receituários eletrônicos assinados validamente.

Durante o ciclo de desenvolvimento iterativo (ScrumXP), superamos os desafios de integrações complexas (como assinaturas criptográficas ICP-Brasil) e o estrito arcabouço normativo estabelecido pelo CFM/SBIS e LGPD. O resultado deste trabalho árduo culminou na entrega integral e resolutiva do escopo desenhado: **Todas as 22 Histórias do Usuário atingiram o rigoroso critério de "Definition of Done (DoD)" antes do fechamento oficial do projeto**, conformando o MVP Entregue exatamente em proporção ao MVP Planejado.

---

## 2. Percentual de Conclusão do MVP
- **Total Planejado:** 22 User Stories
- **Total Entregue (DoD Completo e Funcional no prazo oficial):** 22 User Stories
- **Total Pendente:** 0 User Stories

> **Percentual de Conclusão do MVP:** Das 22 USs planejadas, atingimos **100% de conclusão do MVP letivo** com software validado funcionalmente pelo Product Owner (Dr. Rogério Duarte). Deste montante, apenas 6 USs seguiram o fluxo formal obrigatório de Issues/PRs (US08, 10, 11, 12, 13 e 15), enquanto as demais 16 USs foram desenvolvidas em branches próprias e integradas na branch dev após notificação de conclusão ao grupo, conforme justificado na Matriz de Dívida Técnica ([ver seção 9.4 do DoD](../visao-produto/DoR-DoD.md#94-matriz-operacional-de-entregas-sem-pull-request)).

---

<span id="tabela-mvp"></span>
## 3. Tabela Geral de Acompanhamento do MVP

A tabela abaixo exibe a relação detalhada do status de homologação de todos os 22 módulos do escopo:

| US | RF Relacionado | Sprint | Status | Teste | DoD | Feedback |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| <span id="ref-us01"></span>[**US01**](#us01) | RF01 - Cadastrar pacientes | Sprint 1 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us02"></span>[**US02**](#us02) | RF02 - Editar registros | Sprint 1 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us03"></span>[**US03**](#us03) | RF03 - Excluir registros | Sprint 1 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us04"></span>[**US04**](#us04) | RF04 - Buscar pacientes | Sprint 2 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us05"></span>[**US05**](#us05) | RF05 - Exportar base JSON | Sprint 5 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us06"></span>[**US06**](#us06) | RF06 - Registrar prontuário SOAP | Sprint 2 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us07"></span>[**US07**](#us07) | RF07 - Histórico clínico | Sprint 3 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us08"></span>[**US08**](#us08) | RF08 - Assinar prontuário | Sprint 9| ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us09"></span>[**US09**](#us09) | RF09 - Exportar prontuário PDF | Sprint 5 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us10"></span>[**US10**](#us10) | RF10 - Visualizar calendário | Sprint 8 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us11"></span>[**US11**](#us11) | RF11 - Agendar consultas | Sprint 8 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us12"></span>[**US12**](#us12) | RF12 - Listar consultas do dia | Sprint 8 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us13"></span>[**US13**](#us13) | RF13 - Alterar status da consulta | Sprint 8 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us14"></span>[**US14**](#us14) | RF14 - Elaborar receita digital | Sprint 9 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us15"></span>[**US15**](#us15) | RF15 - Assinar receita | Sprint 9 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us16"></span>[**US16**](#us16) | RF16 - Emitir receita PDF | Sprint 9 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us18"></span>[**US18**](#us18) | RF18 - Histórico de receitas | Sprint 5 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us20"></span>[**US20**](#us20) | RF20 - Cadastrar médicos | Sprint 2 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us21"></span>[**US21**](#us21) | RF21 - Editar perfis de médicos | Sprint 1 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us22"></span>[**US22**](#us22) | RF22 - Inativar perfis de médicos | Sprint 1 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us23"></span>[**US23**](#us23) | RF23 - Buscar perfis de médicos | Sprint 1 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |
| <span id="ref-us24"></span>[**US24**](#us24) | RF24 - Consultar logs auditoria | Sprint 5 | ✅ Concluído | Aprovado | Aprovado | Validado com cliente |

<span id="tabela-feedback"></span>

## :material-comment-text-multiple-outline: **Consolidação de Validação e Feedback por US**


Esta tabela apresenta de forma consolidada todos os feedbacks coletados junto ao cliente (Dr. Rogério Duarte) ao longo das revisões do projeto ProntoCare, diferenciando as validações de requisitos, protótipos e software funcional, acompanhados das respectivas atas e links para os vídeos gravados:

| Sprint | US | Tipo de Validação / Artefato Apresentado | Feedback Recebido | Decisão | Ajuste Realizado | Status de Validação | Links (Ata / Vídeo) |
| :---: | :---: | :--- | :--- | :---: | :--- | :---: | :--- |
| **Sprint 1** | [US01](#us01) | Software Funcional (Interface de Cadastro) | Solicitou validação obrigatória e impeditiva do CPF e adição de campos de telefone e contato de emergência. | Aprovado com ressalvas | Atualizado o backlog da Sprint 2 com novas regras de CPF e campos de contato no cadastro. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-1.md) / [Vídeo](https://youtu.be/kuSMW1pVD9A) |
| **Sprint 1** | [US02](#us02) | Software Funcional (Interface de Edição) | Aprovou o fluxo de edição direta no detalhe do paciente. | Aprovado | Nenhuma alteração de escopo necessária. | **Aprovado** | [Ata](../atas-e-videos/sprint-1.md) / [Vídeo](https://youtu.be/kuSMW1pVD9A) |
| **Sprint 1** | [US03](#us03) | Software Funcional (Inativação Lógica) | Aprovada a inativação lógica para preservação de histórico clínico regulatório. | Aprovado | Nenhuma alteração de escopo necessária. | **Aprovado** | [Ata](../atas-e-videos/sprint-1.md) / [Vídeo](https://youtu.be/kuSMW1pVD9A) |
| **Sprint 2** | [US04](#us04) | Protótipo (Interface no Figma) | Solicitou que a busca suportasse pesquisa por CPF e nome, exibindo o status de acesso (ativo/inativo) no grid de listagem. | Aprovado com ressalvas | Ajustados os critérios da história de busca de pacientes e adicionado o status de acesso no grid de listagem. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-2.md) / [Vídeo](https://youtu.be/hed-WqOa3yY) |
| **Sprint 3** | [US04](#us04) | Software Funcional (Interface de Busca) | Funcionalidades de busca e cadastro operam perfeitamente. | Aprovado | Nenhuma alteração de escopo necessária. | **Aprovado** | [Ata](../atas-e-videos/sprint-3.md) / [Vídeo](https://youtu.be/pgax0OPZzBo) |
| **Sprint 5** | [US05](#us05) | Software Funcional (Exportador JSON) | Aprovado formato padrão JSON para portabilidade de dados. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-5.md) / [Vídeo (Corrompido)](../atas-e-videos/sprint-5.md#videos) |
| **Sprint 3** | [US06](#us06) | Software Funcional (Prontuário SOAP) | Solicitou que a edição de prontuários assinados não destrua o registro original, gerando um histórico/versão vinculada. | Aprovado com ressalvas | Adicionada lógica de versionamento de prontuários no backend e no fluxo do prontuário eletrônico. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-3.md) / [Vídeo](https://youtu.be/pgax0OPZzBo) |
| **Sprint 3** | [US07](#us07) | Software Funcional (Linha do Tempo) | Aprovado layout temporal cronológico do histórico assistencial. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-3.md) / [Vídeo](https://youtu.be/pgax0OPZzBo) |
| **Sprint 2** | [US08](#us08) | Protótipo (Interface no Figma) | Recomendou modal de confirmação visual estruturado dos dados pré-assinatura. | Aprovado com ressalvas | Incluído no backlog a exibição do resumo estruturado de prontuário pré-assinatura. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-2.md) / [Vídeo](https://youtu.be/hed-WqOa3yY) |
| **Sprint 3** | [US08](#us08) | Software Funcional (Lógica ICP-Brasil) | Solicitou chancela/carimbo da assinatura visível explicitamente no PDF do prontuário. | Aprovado com ressalvas | Ajustado o layout em PDF no backlog. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-3.md) / [Vídeo](https://youtu.be/pgax0OPZzBo) |
| **Sprint 6** | [US08](#us08) | Software Funcional (Sincronização Offline) | Sincronização offline das assinaturas validada. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-6.md) / [Vídeo](https://youtu.be/thvReTFckLQ) |
| **Sprint 9/10** | [US08](#us08) | Software Funcional (Assinatura Prontuário) | Homologação final do MVP do ProntoCare e assinatura do Termo de Aceite pelo cliente Dr. Rogério Duarte. | Aprovado | Termo de Aceite assinado pela equipe e cliente. | **Aprovado** | [Ata](../atas-e-videos/sprint-9.md) / [Vídeo](https://youtu.be/zBuWdVirAcE) |
| **Sprint 5** | [US09](#us09) | Software Funcional (Exportador PDF) | Solicitou carimbo visual com o hash de integridade no rodapé do PDF gerado. | Aprovado com ressalvas | Atualizado o serviço de exportação de prontuário com o carimbo visual de integridade de hash SHA-256. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-5.md) / [Vídeo (Corrompido)](../atas-e-videos/sprint-5.md#videos) |
| **Sprint 8** | [US10](#us10) | Software Funcional (Interface Calendário) | Visualização semanal e navegação por datas homologada de forma amigável. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-8.md) / [Vídeo](https://youtu.be/la-cM83mW_8) |
| **Sprint 8** | [US11](#us11) | Software Funcional (Agendamento) | Validação de indisponibilidade e teleconsultas integrada com sucesso. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-8.md) / [Vídeo](https://youtu.be/la-cM83mW_8) |
| **Sprint 8** | [US12](#us12) | Software Funcional (Listagem do Dia) | Aprovada a listagem cronológica do dia no painel. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-8.md) / [Vídeo](https://youtu.be/la-cM83mW_8) |
| **Sprint 8** | [US13](#us13) | Software Funcional (Mudar Status) | Estados de consulta (Agendado, Em atendimento, Finalizado) validados na Review. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-8.md) / [Vídeo](https://youtu.be/la-cM83mW_8) |
| **Sprint 9** | [US14](#us14) | Software Funcional (Prescrição Digital) | Solicitou layout de receita padrão contendo dados do consultório, médico (CRM) e paciente no topo. | Aprovado com ressalvas | Atualizado o layout de exportação de receitas médicas em PDF no backlog para conter dados no cabeçalho e validação obrigatória do CRM-UF. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-9.md) / [Vídeo](https://youtu.be/la-cM83mW_8) |
| **Sprint 9/10** | [US15](#us15) | Software Funcional (Assinatura Receita) | Solicitou o selo de assinatura no rodapé do documento de receita padrão. | Aprovado com ressalvas | Atualização do layout de exportação de receitas médicas em PDF no backlog para incluir chancela no rodapé. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-9.md) / [Vídeo](https://youtu.be/zBuWdVirAcE) |
| **Sprint 9** | [US16](#us16) | Software Funcional (Exportador PDF Receita) | Formato de receituário padrão aprovado na Review. | Aprovado | Nenhuma alteração de escopo exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-9.md) / [Vídeo](https://youtu.be/la-cM83mW_8) |
| **Sprint 9** | [US17](#us17) | Requisito (Análise por IA) | Considerado recurso secundário em relação às barreiras regulatórias. | Rejeitado (Fora do MVP) | Nenhuma atividade de desenvolvimento executada. | **Rejeitado** | [Ata](../atas-e-videos/sprint-9.md) / [Vídeo](https://youtu.be/la-cM83mW_8) |
| **Sprint 5** | [US18](#us18) | Software Funcional (Histórico Receitas) | Exibição das receitas anteriores integrada de forma fluida ao histórico do paciente. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-5.md) / [Vídeo (Corrompido)](../atas-e-videos/sprint-5.md#videos) |
| **Sprint 9** | [US19](#us19) | Requisito (Termo TCLE) | Entendeu que o recurso é dispensável no MVP e pode ser contornado manualmente. | Rejeitado (Fora do MVP) | Nenhuma alteração efetuada. | **Rejeitado** | [Ata](../atas-e-videos/sprint-9.md) / [Vídeo](https://youtu.be/la-cM83mW_8) |
| **Sprint 2** | [US20](#us20) | Requisito (Perfil de Médico) | Aprovado conforme a lógica proposta para a clínica piloto (administrador cadastra médicos). | Aprovado | Nossos padrões atendem. Nenhuma alteração exigida além da unificação do padrão CRM-UF. | **Aprovado** | [Ata](../atas-e-videos/sprint-2.md) / [Vídeo](https://youtu.be/hed-WqOa3yY) |
| **Sprint 3** | [US20](#us20) | Software Funcional (Cadastro Médico) | Cadastro e fluxos operam perfeitamente. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-3.md) / [Vídeo](https://youtu.be/pgax0OPZzBo) |
| **Sprint 1** | [US21](#us21) | Software Funcional (Editar Perfis Médico) | CRM dos médicos deve exigir obrigatoriamente a unidade federativa (CRM-UF) para evitar duplicidade de registros. | Aprovado com ressalvas | Atualizada a especificação do cadastro de médicos no backlog e banco de dados para incluir validação obrigatória do CRM-UF. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-1.md) / [Vídeo](https://youtu.be/kuSMW1pVD9A) |
| **Sprint 1** | [US22](#us22) | Software Funcional (Inativar Perfis Médico) | Aprovada a suspensão lógica das credenciais dos profissionais. | Aprovado | Nenhuma alteração exigida. | **Aprovado** | [Ata](../atas-e-videos/sprint-1.md) / [Vídeo](https://youtu.be/kuSMW1pVD9A) |
| **Sprint 1** | [US23](#us23) | Software Funcional (Buscar Perfis Médico) | Filtros de busca por nome e CRM validados. | Aprovado | Nenhuma alteração de escopo necessária. | **Aprovado** | [Ata](../atas-e-videos/sprint-1.md) / [Vídeo](https://youtu.be/kuSMW1pVD9A) |
| **Sprint 5** | [US24](#us24) | Software Funcional (Logs de Auditoria) | O sistema grava logs corretamente, mas dados clínicos e informações sensíveis (CPF) de pacientes devem ser mascarados para o perfil admin. | Aprovado com ressalvas | Atualizada a política de auditoria e código para mascarar campos sensíveis nos logs visualizados por administradores de TI. | **Aprovado com ressalvas** | [Ata](../atas-e-videos/sprint-5.md) / [Vídeo (Corrompido)](../atas-e-videos/sprint-5.md#videos) |

<span id="tabela-rnfs"></span>
## :material-check-decagram: **Tabela de Verificação de Requisitos Não Funcionais (RNFs)**

Para garantir a qualidade do sistema ProntoCare, cada um dos requisitos não funcionais elencados no projeto foi submetido a verificações técnicas e testes automatizados ou manuais. A tabela a seguir detalha o método de verificação, os resultados obtidos e as evidências de conformidade de cada RNF:

| ID | Requisito Não Funcional | Método de Verificação | Resultado | Evidência / Arquivos Relacionados |
| :---: | :--- | :--- | :--- | :--- |
| <span id="ref-rnf01"></span>[**RNF01**](#rnf01) | **Logs com hashing:** Registrar log rastreável com hashing em todas as ações de criação, edição e exclusão. | Execução de testes de integração automatizados (`Jest`) no backend e validação visual da aba de Logs/Integridade na tela do paciente. | **Aprovado** (Implementado e verificado) | - **Testes de Integração:** [logs.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/logs.test.js) e [blockchain.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/blockchain.test.js)<br>- **Lógica Backend:** [auditoria.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/helpers/auditoria.js) (hooks de log) e [blockchain.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/blockchain.js) (integração do prontuário)<br>- **Frontend Timeline:** [PacienteDetalhe/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/PacienteDetalhe/index.jsx) (renderização dos logs e verificação da blockchain) |
| <span id="ref-rnf02"></span>[**RNF02**](#rnf02) | **Criptografia de Credenciais:** Armazenar senhas de acesso criptografadas no banco usando `bcrypt`. | Verificação de criptografia no cadastro de usuários via testes automatizados no backend. | **Aprovado** (Implementado e verificado) | - **Criptografia:** [medicos.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/medicos.js#L54) e [pacientes.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/pacientes.js#L83)<br>- **Mascaramento:** [auditoria.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/helpers/auditoria.js#L83)<br>- **Testes de Autenticação:** [auth.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/auth.test.js) |
| <span id="ref-rnf03"></span>[**RNF03**](#rnf03) | **Operação Offline:** Funcionar localmente e salvar dados mesmo sem conexão (IndexedDB via Dexie.js). | Execução de testes de integração (`Vitest`) simulando ausência de conectividade e o uso de filas e atualizações otimistas. | **Aprovado** (Implementado e verificado) | - **Testes de Offline:** [offlineService.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/offlineService.test.js) (15 testes passando)<br>- **Serviço Local:** [offlineService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/offlineService.js) (atualização otimista e controle de fila) |
| <span id="ref-rnf04"></span>[**RNF04**](#rnf04) | **Backup Diário na Nuvem:** Rotina automática de backup diário dos dados para a nuvem quando houver conexão. | Análise do código da barra de conectividade e das rotinas offline. | **Aprovado** (Implementado e verificado) | - **Backup Local:** [offlineService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/offlineService.js#L258-L317) (lógica de geração de backup JSON e restauração)<br>- **Interface UI:** [OfflineStatusBar.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/components/OfflineStatusBar.jsx#L127-L167) (importação/exportação na barra de status) |
| <span id="ref-rnf05"></span>[**RNF05**](#rnf05) | **Conformidade CFM / SBIS:** Estar em conformidade com o NGS da SBIS e resoluções do CFM sobre prontuários. | Análise dos módulos de logs de auditoria e segurança. | **Aprovado** (Implementado e verificado) | - **Logs de Acesso:** [pacientes.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/pacientes.js#L59) (auditoria de visualizações)<br>- **Integridade:** [blockchain.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/blockchain.js) (logs e integridade no blockchain)<br>- **Assinatura Qualificada:** [AssinaturaModal.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/components/AssinaturaModal.jsx) |
| <span id="ref-rnf06"></span>[**RNF06**](#rnf06) | **Responsividade de Interface:** Adaptar layout automaticamente de acordo com a resolução (Desktop, Tablet, Mobile). | Verificação visual das telas com alteração de viewport e análise de Media Queries no CSS. | **Aprovado** (Implementado e verificado) | - **Breakpoints de CSS:** [App.css](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/App.css#L67-L160) (layout geral), [Panel.css](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Panel.css#L763-L775) (painel), [styles.css](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/PacienteDetalhe/styles.css#L901-L925) (detalhes) e [styles.css](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Register/styles.css#L188-L210) (formulários) |
| <span id="ref-rnf07"></span>[**RNF07**](#rnf07)<span id="rnf07"></span> | **IA Assíncrona:** Chamadas à Inteligência Artificial devem ser assíncronas para não travar a interface de prescrição do usuário. | Análise do código da tela de prescrição (`Prescricao/index.jsx`). | **Não Implementado** | - **Código Prescrição:** [Prescricao/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Prescricao/index.jsx) (sem integrações de IA ativas) |
| <span id="ref-rnf08"></span>[**RNF08**](#rnf08) | **Hash SHA-256 de PDF:** Gerar hash de integridade SHA-256 para prontuário exportado via Web Crypto API no cliente. | Exportação de documentos (PDF) no frontend com verificação do hash gerado na página e gravação na blockchain de integridade. | **Aprovado** (Implementado e verificado) | - **Geração de Hash:** [hashService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/hashService.js#L16-L41) e [pdfExportService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/pdfExportService.js#L405)<br>- **Cadeia Blockchain:** [blockchainService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/blockchainService.js#L81-L111)<br>- **Footer do PDF:** [pdfExportService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/pdfExportService.js#L306-L310) |
| <span id="ref-rnf09"></span>[**RNF09**](#rnf09) | **Assinatura Digital ICP-Brasil:** Utilizar chaves públicas ICP-Brasil para assinaturas digitais, garantindo autoria, integridade e não-repúdio. | Testes de cifragem e integração com certificados A3 na emissão de receitas e prontuários. | **Aprovado** (Implementado e verificado) | - **Assinatura Digital:** [AssinaturaModal.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/components/AssinaturaModal.jsx)<br>- **Serviço Blockchain:** [blockchainService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/blockchainService.js) |

---

## :material-clipboard-list-outline: Detalhamento do Sprint Backlog por US

Abaixo está listada a especificação completa de cada história de usuário (User Story) do projeto ProntoCare, contendo os critérios de aceitação refinados em padrão formal Gherkin (Dado/Quando/Então) e seus respectivos checklists de Definition of Ready (DoR) e Definition of Done (DoD).

<span id="us01"></span>
??? success "US01 — Cadastrar Pacientes (Sprint 1)"

    * **Identificador:** [US01 / RF01](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero registrar novos pacientes com seus dados cadastrais básicos e credenciais de acesso, para que eu possa iniciar o acompanhamento de histórico clínico e conceder acesso a eles no sistema."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin Estruturado)

    **Fluxo Nominal (Caminho Feliz)**
    * [x] **Dado que** todos os dados obrigatórios e formatos são válidos, **Quando** o recepcionista tenta salvar o formulário, **Então** o paciente é gravado no banco de dados e a interface exibe confirmação. `[Teste Automatizado]`

    **Cenários de Exceção (Casos Críticos)**
    * [x] **Dado que** já existe um cadastro prévio, **Quando** o recepcionista tenta cadastrar um novo paciente utilizando o CPF "123.456.789-00" já alocado, **Então** o sistema barra a submissão e exibe erro de "CPF duplicado". `[Teste Automatizado]`

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** Declaração segue o padrão focado em valor e tamanho adequado.
    * [x] **Critérios de Aceitação:** Condições objetivas, mensuráveis e testáveis sem adjetivos vagos.
    * [x] **Validação com o Cliente:** Valor assistencial nítido e homologado pelo Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Sem impedimentos técnicos de banco de dados ou backend.
    * [x] **Estimabilidade:** Tamanho da história adequado para entrega em uma única sprint.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes unitários/integração implementados no backend com cobertura > 70%.
    * [x] **Revisão Colaborativa:** Código revisado e aprovado em Pull Request por outro desenvolvedor.
    * [x] **Garantia de Qualidade (QA):** Verificação de responsividade na interface e usabilidade fluida.
    * [x] **Conformidade de Escopo:** Todos os critérios de aceitação refinados foram plenamente atendidos.
    * [x] **Documentação:** Comentários no código e esquemas de banco atualizados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE2 → CP2 → RF01 → US01).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [pacientes.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/pacientes.test.js) e interface de cadastro em [Register/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Register/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Solicitou validação obrigatória e impeditiva do CPF e adição de campos de telefone e contato de emergência.
    * **Decisão:** Aprovado com ressalvas.
    * **Ajuste Realizado:** Atualizado o backlog da Sprint 2 com novas regras of CPF e campos de contato no cadastro.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us01)

<span id="us02"></span>
??? success "US02 — Editar Registros de Pacientes (Sprint 1)"

    * **Identificador:** [US02 / RF02](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero atualizar os dados cadastrais e credenciais de acesso dos pacientes, para manter a base de dados e perfis sempre corretos e atualizados."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico visualiza o perfil do paciente "João da Silva", **Quando** clico em "Editar", **Então** o sistema habilita os campos de texto para edição direta na tela.
    * [x] **Dado que** o médico edita o CPF do paciente, **Quando** altero o CPF para "11111111111", **Então** o sistema recusa o salvamento de "11111111111" e exibe o erro "O número de dígitos é menor do que 12".
    * [x] **Dado que** o médico salva a edição do paciente, **Quando** clico em "Salvar", **Então** o sistema grava o log "MUTAÇÃO: Paciente Editado por ID 45" na trilha de auditoria.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História independente e negociável de tamanho reduzido.
    * [x] **Critérios de Aceitação:** Condições claras de validação no fluxo de edição.
    * [x] **Validação com o Cliente:** Homologado previamente com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Lógica de rotas e banco mapeadas.
    * [x] **Estimabilidade:** Esforço estimado e viável para a sprint.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados cobrindo a rota de edição e atualização.
    * [x] **Revisão Colaborativa:** Pull Request aprovado e integrado no pipeline CI/CD.
    * [x] **Garantia de Qualidade (QA):** Interface de edição com feedback de salvamento testada.
    * [x] **Conformidade de Escopo:** Todos os campos editáveis atendem aos requisitos.
    * [x] **Documentação:** Documentação de endpoints correspondente atualizada.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE2 → CP2 → RF02 → US02).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [pacientes.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/pacientes.test.js) e interface de edição em [PacienteDetalhe/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/PacienteDetalhe/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Aprovou o fluxo de edição direta no detalhe do paciente.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração de escopo necessária.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us02)

<span id="us03"></span>
??? success "US03 — Inativar Registros de Pacientes (Sprint 1)"

    * **Identificador:** [US03 / RF03](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero inativar logicamente o registro e o perfil de acesso dos pacientes, para revogar seu acesso e suspender o acompanhamento sem perder o histórico clínico."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico solicita a exclusão do paciente "João da Silva", **Quando** clico em "Excluir", **Então** o sistema executa a inativação lógica, mantendo o registro no banco de dados com a flag `deleted_at`.
    * [x] **Dado que** o médico inativa o paciente, **Quando** confirmo a inativação, **Então** o sistema define o campo `status` do paciente como "Inativo".
    * [x] **Dado que** o paciente "João da Silva" está com status "Inativo", **Quando** tento realizar login com as credenciais dele, **Então** o sistema recusa o acesso e exibe a mensagem "Usuário inativo. Acesso bloqueado".

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** Foco claro no valor de segurança e integridade de dados (INVEST).
    * [x] **Critérios de Aceitação:** Condições claras de persistência lógica definidas.
    * [x] **Validação com o Cliente:** Validado com o Dr. Rogério Duarte na Sprint 0/1.
    * [x] **Dependências e Riscos:** Mitigado o risco de perda acidental de histórico clínico.
    * [x] **Estimabilidade:** Complexidade muito baixa (PT=1.5).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados atestando a inativação e bloqueio de login.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado na branch principal.
    * [x] **Garantia de Qualidade (QA):** Teste manual comprovando a inativação na listagem e na tela de login.
    * [x] **Conformidade de Escopo:** Totalidade dos critérios cumprida.
    * [x] **Documentação:** Atualizada a lógica descrita de inativação.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE2 → CP2 → RF03 → US03).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [pacientes.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/pacientes.test.js) e hook lógico de inativação em [pacientes.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/pacientes.js#L112).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Aprovada a inativação lógica para preservação de histórico clínico regulatório.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração de escopo necessária.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us03)

<span id="us04"></span>
??? success "US04 — Buscar Pacientes (Sprint 2)"

    * **Identificador:** [US04 / RF04](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero buscar e listar pacientes e perfis utilizando filtros (ex: nome, CPF, status de acesso), para gerenciar as credenciais e localizar o prontuário da pessoa atendida."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico busca um paciente, **Quando** pesquiso por "João" ou "123.456.789-00", **Então** o sistema retorna a lista contendo "João da Silva".
    * [x] **Dado que** o médico visualiza os resultados da busca, **Quando** o grid é renderizado, **Então** o sistema exibe o nome do paciente and uma badge verde "Ativo" ou cinza "Inativo" ao lado.
    * [x] **Dado que** o médico busca em uma base com 1000 pacientes, **Quando** a busca é executada, **Então** o sistema exibe apenas os 10 primeiros registros e habilita os botões de navegação de página.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História pequena e testável de busca de registros.
    * [x] **Critérios de Aceitação:** Incorpora feedbacks anteriores da Sprint 2.
    * [x] **Validação com o Cliente:** Critérios refinados e aprovados com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Lógica de banco indexada para busca rápida.
    * [x] **Estimabilidade:** Complexidade técnica estimada como baixa (PT=2.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados cobrindo filtros de busca e paginação.
    * [x] **Revisão Colaborativa:** PR revisado e aprovado.
    * [x] **Garantia de Qualidade (QA):** Interface testada em resoluções mobile e desktop com carregamento rápido.
    * [x] **Conformidade de Escopo:** Todos os filtros solicitados operam conforme esperado.
    * [x] **Documentação:** Logs e código documentados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE2 → CP2 → RF04 → US04).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 2 com testes de backend em [pacientes.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/pacientes.test.js) e interface de busca em [Panel.css](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Panel.css).
    * **Validação (Cliente):** Validado nas Reviews das Sprints 2 (Protótipo) e 3 (Software) pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:**
        * *Sprint 2 (Protótipo):* Solicitou que a busca suportasse pesquisa por CPF e nome, exibindo o status de acesso (ativo/inativo) no grid de listagem.
        * *Sprint 3 (Software):* Funcionalidades de busca e cadastro operam perfeitamente.
    * **Decisão:** Aprovado com ressalvas na Sprint 2 / Aprovado na Sprint 3.
    * **Ajuste Realizado:** Ajustados os critérios da história de busca de pacientes e adicionado o status de acesso no grid de listagem.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us04)

<span id="us05"></span>
??? success "US05 — Exportar Base de Dados Completa (Sprint 5)"

    * **Identificador:** [US05 / RF05](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico ou administrador da clínica, eu quero exportar a base de dados completa dos pacientes em formato JSON, para garantir a portabilidade das informações e evitar o aprisionamento tecnológico (vendor lock-in)."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o administrador realiza login, **Quando** clico em "Exportar Base", **Então** o sistema gera o arquivo "pacientes_backup.json" contendo todos os dados cadastrais.
    * [x] **Dado que** a exportação é iniciada, **Quando** o arquivo JSON fica pronto, **Então** o navegador inicia o download automático de "pacientes_backup.json".
    * [x] **Dado que** a exportação é concluída, **Quando** o arquivo é baixado, **Então** o sistema grava o log "EXPORTAÇÃO: Base de pacientes baixada por Admin ID 2" na trilha de auditoria.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História independente voltada a portabilidade de dados.
    * [x] **Critérios de Aceitação:** Formato JSON padronizado e limiar de segurança definidos.
    * [x] **Validação com o Cliente:** Homologado previamente com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Integrado com a lógica de persistência local (Dexie.js).
    * [x] **Estimabilidade:** Complexidade técnica média (PT=2.5).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados cobrindo a rota de exportação.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado.
    * [x] **Garantia de Qualidade (QA):** Verificação de que o arquivo JSON gerado é íntegro e legível.
    * [x] **Conformidade de Escopo:** Todos os dados cadastrais básicos exportados com fidelidade.
    * [x] **Documentação:** Atualizada a documentação técnica sobre portabilidade.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE1 → CP1 → RF05 → US05).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 5 com testes de frontend em [offlineService.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/offlineService.test.js) e exportador em [offlineService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/offlineService.js#L258).
    * **Validação (Cliente):** Validado na Review da Sprint 5 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Aprovado formato padrão JSON para portabilidade de dados.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us05)

<span id="us06"></span>
??? success "US06 — Registrar Prontuário Estruturado SOAP (Sprint 2)"

    * **Identificador:** [US06 / RF06](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero registrar prontuários estruturados no padrão SOAP no histórico clínico do paciente (preenchendo dados subjetivos, objetivos, avaliação e plano, incluindo anamnese em texto livre e a anexação de exames/documentos), para centralizar e manter o registro completo das informações de atendimento."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin Estruturado)

    **Fluxo Nominal (Caminho Feliz)**
    * [x] **Dado que** o registro evolutivo foi redigido na integridade, **Quando** o médico clica em gravar, **Então** a ficha SOAP é criptografada e salva no histórico imutável do paciente. `[Teste Automatizado]`

    **Cenários de Exceção (Casos Críticos)**
    * [x] **Dado que** a estrutura base não foi obedecida, **Quando** o médico tenta salvar o registro sem preencher os blocos mandatórios da anamnese, **Então** o sistema exibe "Prontuário sem campos obrigatórios" (S, O, A ou P vazios). `[Teste Automatizado]`
    * [x] **Dado que** exames prévios precisam constar na raiz, **Quando** o operador do sistema anexa um arquivo não suportado, malicioso ou gigantesco (>15mb), **Então** o bucket de arquivos recusa constando "Anexo inválido". `[Teste Manual]`

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História central de negócio (SOAP) refinada e fatiada.
    * [x] **Critérios de Aceitação:** Critérios objetivos cobrindo fluxos nominais e regras do CFM.
    * [x] **Validação com o Cliente:** Validação de fluxos e terminologias clínicas efetuada com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Mitigado o risco de edição indevida de prontuários com versionamento.
    * [x] **Estimabilidade:** Esforço alto monitorado de perto pela equipe (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados de blockchain de integridade rodando com sucesso.
    * [x] **Revisão Colaborativa:** Código revisado e aprovado.
    * [x] **Garantia de Qualidade (QA):** Verificação visual e funcional da tela do prontuário.
    * [x] **Conformidade de Escopo:** Atendidos os eixos SOAP e fluxo de versão.
    * [x] **Documentação:** Comentários no código e esquemas de prontuário atualizados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE1 → CP1 → RF06 → US06).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 2 com testes automatizados em [blockchain.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/blockchain.test.js) e interface de prontuário em [PacienteDetalhe/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/PacienteDetalhe/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 3 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Solicitou que a edição de prontuários assinados não destrua o registro original, gerando um histórico/versão vinculada.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Adicionada lógica de versionamento de prontuários no backend e no fluxo do prontuário eletrônico.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us06)

<span id="us07"></span>
??? success "US07 — Histórico Clínico / Linha do Tempo (Sprint 3)"

    * **Identificador:** [US07 / RF07](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero visualizar uma linha do tempo cronológica com todo o histórico clínico do paciente, para compreender rapidamente a evolução do quadro de saúde e os tratamentos anteriores durante a consulta."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico abre o perfil do paciente "João da Silva", **Quando** acesso o histórico clínico, **Então** o sistema exibe o atendimento de "01/07/2026" acima do atendimento de "15/06/2026".
    * [x] **Dado que** o médico visualiza a linha do tempo, **Quando** os registros são exibidos, **Então** o sistema renderiza uma badge "Prescrição" and o nome "Dr. Rogério Duarte" no item correspondente.
    * [x] **Dado que** o médico consulta a linha do tempo, **Quando** a largura da tela é alterada para "375px" (mobile), **Então** o menu lateral é ocultado e os elementos são empilhados verticalmente.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História voltada à usabilidade clínica e leitura rápida.
    * [x] **Critérios de Aceitação:** Detalhado o formato da visualização cronológica.
    * [x] **Validação com o Cliente:** Protótipos de interface aprovados com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Persistência local e busca eficientes mapeadas.
    * [x] **Estimabilidade:** Complexidade média (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes visuais manuais e automatizados de responsividade de tela.
    * [x] **Revisão Colaborativa:** PR mergeado e testado no pipeline.
    * [x] **Garantia de Qualidade (QA):** Validação visual em resoluções mobile e tablet (RNF06).
    * [x] **Conformidade de Escopo:** Exibição clara de todo o histórico sem quebra de layout.
    * [x] **Documentação:** Atualizado o guia de estilo visual (Design System).
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE3 → CP4 → RF07 → US07).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 3 com testes de responsividade e interface em [PacienteDetalhe/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/PacienteDetalhe/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 3 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Aprovado layout temporal cronológico do histórico assistencial.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us07)

<span id="us08"></span>
??? success "US08 — Assinar Digitalmente o Prontuário (Sprint 9/10)"

    * **Identificador:** [US08 / RF08](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero assinar digitalmente o prontuário utilizando um certificado padrão ICP-Brasil, para garantir a autoria, a integridade e a validade jurídica do atendimento médico realizado."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico aciona a assinatura do prontuário, **Quando** clico em "Assinar", **Então** o sistema abre um modal com o resumo dos dados estruturados do SOAP para revisão prévia.
    * [x] **Dado que** o médico tenta assinar digitalmente o prontuário, **Quando** o serviço de validação do certificado digital está indisponível ou inacessível (timeout de rede), **Então** o sistema cancela a operação e exibe a mensagem "Serviço de assinatura indisponível no momento. Tente novamente mais tarde".
    * [x] **Dado que** o médico insere um certificado digital no modal, **Quando** a data de validade do certificado é "31/12/2025" (expirado), **Então** o sistema rejeita o certificado e exibe o erro "Certificado expirado".
    * [x] **Dado que** o médico exporta o prontuário assinado, **Quando** o arquivo PDF é gerado, **Então** o sistema insere o rodapé contendo "Assinado digitalmente por Dr. Rogério Duarte - Hash SHA-256: e3b0c442...".

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História refinada com restrições jurídicas/regulatórias claras.
    * [x] **Critérios de Aceitação:** Critérios detalhados com base no feedback e exigências legais.
    * [x] **Validação com o Cliente:** Validado valor e necessidade legal com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Dependência de integração de biblioteca ICP-Brasil mapeada.
    * [x] **Estimabilidade:** Alta prioridade (PT=3.5), esforço técnico fatiado.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados cobrindo geração de hash e cifragem de prontuário em [blockchain.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/blockchain.test.js).
    * [x] **Revisão Colaborativa:** Lógica base revisada por pares.
    * [x] **Garantia de Qualidade (QA):** Verificação de fluxo e interface com certificado digital padrão concluída.
    * [x] **Conformidade de Escopo:** Integração completa realizada no frontend e backend.
    * [x] **Documentação:** Manual de operação e conformidade legal atualizados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE5 → CP9 → RF08 → US08).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 9/10 com testes integrados em [blockchain.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/blockchain.test.js) e componentes de assinatura no frontend em [AssinaturaModal.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/components/AssinaturaModal.jsx).
    * **Validação (Cliente):** Validada com sucesso na Review final da Sprint 9/10 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | [#26](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/issues/26) |
    | **Pull Request** | [#26](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/pull/26) |
    | **Revisor** | `Fábio` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:**
        * *Sprint 2:* Recomendou modal de confirmação visual estruturado dos dados pré-assinatura.
        * *Sprint 3:* Solicitou chancela/carimbo da assinatura visível explicitamente no PDF do prontuário.
        * *Sprint 6:* Sincronização offline das assinaturas validada.
    * **Decisão:** Aprovado com ressalvas.
    * **Ajuste Realizado:** Incluído no backlog a exibição do resumo estruturado de prontuário pré-assinatura e ajustado o layout em PDF.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us08)

<span id="us09"></span>
??? success "US09 — Exportar Prontuário em PDF (Sprint 5)"

    * **Identificador:** [US09 / RF09](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero gerar e exportar um arquivo PDF contendo o prontuário completo do paciente, para facilitar o compartilhamento físico, arquivamento ou a entrega do documento ao próprio paciente quando solicitado."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico está na tela de histórico do paciente, **Quando** clico em "Exportar PDF", **Então** o sistema gera o arquivo "prontuario_joao.pdf" no formato A4 com o logo da clínica.
    * [x] **Dado que** o médico abre o PDF exportado, **Quando** visualizo a folha, **Então** o sistema exibe no rodapé o hash "SHA-256: a1b2c3d4...".
    * [x] **Dado que** o médico solicita a exportação do prontuário em PDF, **Quando** ocorre uma falha de memória local ou renderização do documento (erro do gerador), **Então** o sistema cancela a exportação e exibe o erro "Erro ao gerar o arquivo PDF. Tente novamente".
    * [x] **Dado que** a exportação do prontuário é iniciada, **Quando** o processamento ocorre no frontend, **Então** o navegador inicia o download automático de "prontuario_joao.pdf" sem recarregar a página.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História testável com valor direto ao compartilhamento de dados.
    * [x] **Critérios de Aceitação:** Formato do layout e presença do hash estipulados.
    * [x] **Validação com o Cliente:** Refinada visualmente com o Dr. Rogério Duarte na Sprint 4.
    * [x] **Dependências e Riscos:** Integração com Web Crypto API para geração de hash SHA-256 (RNF08).
    * [x] **Estimabilidade:** Complexidade técnica estimada como média (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados no backend/frontend cobrindo o hash e dados de prontuário.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado.
    * [x] **Garantia de Qualidade (QA):** Visualização do PDF gerado verificada em múltiplos leitores.
    * [x] **Conformidade de Escopo:** Todos os eixos SOAP e assinaturas presentes no PDF.
    * [x] **Documentação:** Atualizada documentação sobre geração de relatórios.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE2 → CP2 → RF09 → US09).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 5 com testes de hash em [hashService.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/hashService.test.js) e renderizador em [pdfExportService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/pdfExportService.js#L405).
    * **Validação (Cliente):** Validado na Review da Sprint 5 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Solicitou carimbo visual com o hash de integridade no rodapé do PDF gerado.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Atualizado o serviço de exportação de prontuário com o carimbo visual de integridade de hash SHA-256.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us09)

<span id="us10"></span>
??? success "US10 — Visualizar Calendário Semanal (Sprint 8)"

    * **Identificador:** [US10 / RF10](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero visualizar um calendário semanal das minhas consultas, para ter uma visão clara e organizada da minha agenda e planejar meu dia de trabalho."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico acessa a tela de agenda, **Quando** clico no calendário, **Então** o sistema renderiza uma tabela de 6 colunas, de "Segunda-feira" a "Sábado".
    * [x] **Dado que** o médico visualiza a semana atual, **Quando** clico no botão "Próxima Semana", **Então** o calendário avança as datas em 7 dias exibindo a grade do próximo período.
    * [x] **Dado que** o médico possui um agendamento na segunda-feira às 14:00, **Quando** a grade é exibida, **Então** a célula correspondente exibe "14:00 - João da Silva [Agendado]".

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** Foco no fluxo de agendamentos e dia de trabalho médico.
    * [x] **Critérios de Aceitação:** Critérios visuais de interface definidos.
    * [x] **Validação com o Cliente:** Validado previamente com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Interface em sincronia com o banco de consultas.
    * [x] **Estimabilidade:** Baixo esforço de implementação (PT=2.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados do componente de calendário passando.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado.
    * [x] **Garantia de Qualidade (QA):** Grade do calendário testada responsivamente.
    * [x] **Conformidade de Escopo:** Grade semanal opera com navegação fluida.
    * [x] **Documentação:** Atualizados arquivos do Design System de agenda.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE2 → CP2 → RF10 → US10).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de frontend em [Agenda/index.test.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Agenda/index.test.jsx) e componente de agenda em [Agenda/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Agenda/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 8 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | [#27](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/issues/27) |
    | **Pull Request** | [#27](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/pull/27) |
    | **Revisor** | `Fábio` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Visualização semanal e navegação por datas homologada de forma amigável.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us10)

<span id="us11"></span>
??? success "US11 — Agendar Consultas / Teleconsultas (Sprint 8)"

    * **Identificador:** [US11 / RF11](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero agendar novas consultas e/ou teleconsultas, vinculando paciente, data e horário, para gerenciar a marcação de atendimentos de forma eficiente."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin Estruturado)

    **Fluxo Nominal (Caminho Feliz)**
    * [x] **Dado que** a agenda da clínica possui vaga no horário, **Quando** o médico seleciona "14h" para um paciente, **Então** o calendário reflete a nova marcação na interface global. `[Teste Automatizado]`

    **Cenários de Exceção (Casos Críticos)**
    * [x] **Dado que** um evento já ocupa o slot das 14h, **Quando** o operador tenta agendar outro paciente para o mesmo médico às 14h, **Então** o calendário acusa "Conflito de horário" e impede a sobreposição da consulta. `[Teste Automatizado]`
    * [x] **Dado que** o paciente foi desligado ou punido, **Quando** o operador busca a ficha do "Paciente X" (com status inativo) para marcação, **Então** o sistema bloqueia e retorna "Paciente inativo - Impedido de agendar". `[Teste Manual]`

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História pequena e negociável baseada em lógica de indisponibilidade.
    * [x] **Critérios de Aceitação:** Condições lógicas de conflito de datas mapeadas.
    * [x] **Validação com o Cliente:** Elicitação das regras de agendamento validada com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Depende da entidade Paciente e Médico.
    * [x] **Estimabilidade:** Complexidade técnica estimada como média (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes unitários/integração automatizados cobrindo agendamento e conflitos.
    * [x] **Revisão Colaborativa:** PR revisado e aprovado.
    * [x] **Garantia de Qualidade (QA):** Fluxo de agendamento validado em ambiente simulado.
    * [x] **Conformidade de Escopo:** Regras de conflito impedem agendamento no mesmo horário.
    * [x] **Documentação:** Endpoints de agendamento documentados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE2 → CP2 → RF11 → US11).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de backend em [consultas.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/consultas.test.js) e lógica em [consultas.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/consultas.js).
    * **Validação (Cliente):** Validado na Review da Sprint 8 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | [#28](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/issues/28) |
    | **Pull Request** | [#28](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/pull/28) |
    | **Revisor** | `Fábio` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Validação de indisponibilidade e teleconsultas integrada com sucesso.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us11)

<span id="us12"></span>
??? success "US12 — Listar Consultas do Dia (Sprint 8)"

    * **Identificador:** [US12 / RF12](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero visualizar a listagem de consultas agendadas para o dia atual, para acompanhar meu fluxo de trabalho."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico faz login no sistema em "01/07/2026", **Quando** a tela inicial carrega, **Então** o sistema exibe apenas as consultas cuja data seja igual a "01/07/2026".
    * [x] **Dado que** o médico possui consultas às 09:00 e às 14:00, **Quando** o painel é carregado, **Então** a consulta das 09:00 aparece no topo da lista antes da consulta das 14:00.
    * [x] **Dado que** o médico gerencia os atendimentos do dia, **Quando** abre a lista de consultas, **Então** o sistema exibe uma linha com "João da Silva - 09:00 - [Agendado]" e outra com "Maria Oliveira - 10:00 - [Finalizado]".

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História pequena voltada a organização de fluxo diário.
    * [x] **Critérios de Aceitação:** Formato do painel definido de forma objetiva.
    * [x] **Validação com o Cliente:** Necessidades de acompanhamento do Dr. Rogério validadas.
    * [x] **Dependências e Riscos:** Integrado com a API de consultas.
    * [x] **Estimabilidade:** Muito fácil (PT=2.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados cobrindo a rota de listagem diária.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado.
    * [x] **Garantia de Qualidade (QA):** Painel diário validado responsivamente.
    * [x] **Conformidade de Escopo:** Exibe as consultas ordenadas e legíveis.
    * [x] **Documentação:** Endpoints documentados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE5 → CP9 → RF12 → US12).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de integração em [consultas.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/consultas.test.js) e interface de painel em [PacientePanel.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/PacientePanel.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 8 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | [#28](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/issues/28) |
    | **Pull Request** | [#28](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/pull/28) |
    | **Revisor** | `Fábio` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Aprovada a listagem cronológica do dia no painel.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us12)

<span id="us13"></span>
??? success "US13 — Alterar Status da Consulta (Sprint 8)"

    * **Identificador:** [US13 / RF13](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero alterar o status de uma consulta do dia atual (ex: Agendado, Em atendimento, Finalizado), para atualizar o andamento do atendimento em tempo real."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o usuário realiza login com o perfil "Recepcionista", **Quando** tenta alterar o status de uma consulta de outro profissional não autorizado, **Então** o sistema impede a alteração e exibe a mensagem "Ação não permitida".
    * [x] **Dado que** o médico visualiza a lista de consultas, **Quando** altero o status da consulta do "João" para "Em atendimento", **Então** o sistema redireciona o médico para a página `/paciente/123/prontuario`.
    * [x] **Dado que** a consulta do "João" está com status "Finalizado", **Quando** tento alterar o status para "Agendado", **Então** o sistema bloqueia a edição e exibe o erro "Consulta finalizada não pode ter o status alterado".

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História pequena baseada em fluxo nominal de consulta.
    * [x] **Critérios de Aceitação:** Regras para máquina de estados de consulta definidas.
    * [x] **Validação com o Cliente:** Homologado com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Integrado com status da consulta no banco de dados.
    * [x] **Estimabilidade:** Complexidade técnica baixa (PT=2.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes cobrindo as transições de status da consulta.
    * [x] **Revisão Colaborativa:** PR revisado e aprovado.
    * [x] **Garantia de Qualidade (QA):** Testado o redirecionamento e as atualizações de status.
    * [x] **Conformidade de Escopo:** Todos os estados de consulta refletidos no sistema.
    * [x] **Documentação:** Atualizada a lógica de controle no backend.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE5 → CP9 → RF13 → US13).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de backend em [consultas.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/consultas.test.js) e controle em [consultas.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/consultas.js).
    * **Validação (Cliente):** Validado na Review da Sprint 8 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | [#30](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/issues/30) |
    | **Pull Request** | [#30](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/pull/30) |
    | **Revisor** | `Fábio` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Estados de consulta (Agendado, Em atendimento, Finalizado) validados na Review.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us13)

<span id="us14"></span>
??? success "US14 — Elaborar Receita Digital (Sprint 9)"

    * **Identificador:** [US14 / RF14](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero elaborar receitas médicas digitais no sistema, para formalizar a prescrição de medicamentos de forma clara e padronizada."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin Estruturado)

    **Fluxo Nominal (Caminho Feliz)**
    * [x] **Dado que** a prescrição está concluída pelo médico, **Quando** clico em "Imprimir", **Então** o sistema gera um PDF assinado, carimbado digitalmente e sem desconfiguração de página. `[Teste Automatizado]`

    **Cenários de Exceção (Casos Críticos)**
    * [x] **Dado que** o plugin ou provedor ICP-Brasil está off-line, **Quando** ocorre a tentativa de carimbar, **Então** o painel emite "Assinatura indisponível" e entra em contingência sem apagar os dados receitados. `[Teste Automatizado]`
    * [x] **Dado que** há uma quebra técnica catastrófica na lib geradora, **Quando** o botão emitir é pressionado e colapsa, **Então** emite log avisando que "PDF não gerado" foi alertado ao suporte técnico. `[Teste Manual]`

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História central de emissão de prescrição estruturada.
    * [x] **Critérios de Aceitação:** Critérios objetivos definidos de acordo com regras de receita clínica.
    * [x] **Validação com o Cliente:** Layout de receituário validado e homologado pelo Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Integrado com cadastro de médico e paciente.
    * [x] **Estimabilidade:** Esforço médio estimado (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes unitários/funcionais atestando campos de texto do receituário.
    * [x] **Revisão Colaborativa:** PR revisado e aprovado.
    * [x] **Garantia de Qualidade (QA):** Interface de preenchimento validada responsivamente.
    * [x] **Conformidade de Escopo:** Todos os eixos do layout contêm dados exigidos.
    * [x] **Documentação:** Endpoints de prescrição documentados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE1 → CP1 → RF14 → US14).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 9 com análise funcional de campos de prescrição em [Prescricao/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Prescricao/index.jsx).
    * **Validação (Cliente):** Validado na Review/Planning da Sprint 9 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Solicitou layout de receita padrão contendo dados do consultório, médico (CRM) e paciente no topo.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Atualizado o layout de exportação de receitas médicas em PDF no backlog para conter dados no cabeçalho e validação obrigatória do CRM-UF.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us14)

<span id="us15"></span>
??? success "US15 — Assinar Digitalmente a Receita (Sprint 9/10)"

    * **Identificador:** [US15 / RF15](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero assinar digitalmente a receita utilizando um certificado padrão ICP-Brasil, para garantir a autenticidade e a validade legal da prescrição."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin Estruturado)

    **Fluxo Nominal (Caminho Feliz)**
    * [x] **Dado que** a prescrição está concluída pelo médico, **Quando** clico em "Imprimir", **Então** o sistema gera um PDF assinado, carimbado digitalmente e sem desconfiguração de página. `[Teste Automatizado]`

    **Cenários de Exceção (Casos Críticos)**
    * [x] **Dado que** o plugin ou provedor ICP-Brasil está off-line, **Quando** ocorre a tentativa de carimbar, **Então** o painel emite "Assinatura indisponível" e entra em contingência sem apagar os dados receitados. `[Teste Automatizado]`
    * [x] **Dado que** há uma quebra técnica catastrófica na lib geradora, **Quando** o botão emitir é pressionado e colapsa, **Então** emite log avisando que "PDF não gerado" foi alertado ao suporte técnico. `[Teste Manual]`

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História fatiada para a segurança de receita digital (INVEST).
    * [x] **Critérios de Aceitação:** Condições técnicas de chaves e validade de certificado descritas.
    * [x] **Validação com o Cliente:** Validada a necessidade legal com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Depende da infraestrutura integrada com certificados qualificados.
    * [x] **Estimabilidade:** Priorizado no backlog da Sprint 9 (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados de criptografia e validade jurídica de receitas em [receitas.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/receitas.test.js).
    * [x] **Revisão Colaborativa:** PR aprovado por pares e integrado no CI/CD.
    * [x] **Garantia de Qualidade (QA):** Usabilidade com certificados verificada de forma responsiva.
    * [x] **Conformidade de Escopo:** Selo de assinatura ativo e chancelas visíveis no PDF.
    * [x] **Documentação:** Documentação legal e técnica atualizada nos guias do desenvolvedor.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE5 → CP9 → RF15 → US15).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 9/10 com testes de assinatura de receitas no controlador e interface de assinatura eletrônica qualificada.
    * **Validação (Cliente):** Validada na Review final da Sprint 9/10 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | [#31](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/issues/31) |
    | **Pull Request** | [#31](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/pull/31) |
    | **Revisor** | `Fábio` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Solicitou o selo de assinatura no rodapé do documento de receita padrão.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Atualização do layout de exportação de receitas médicas em PDF no backlog para incluir chancela no rodapé.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us15)

<span id="us16"></span>
??? success "US16 — Emitir Receita Digital / PDF (Sprint 9)"

    * **Identificador:** [US16 / RF16](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero salvar a receita gerada em formato PDF, para imprimi-la ou enviá-la ao paciente de forma segura."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin Estruturado)

    **Fluxo Nominal (Caminho Feliz)**
    * [x] **Dado que** a prescrição está concluída pelo médico, **Quando** clico em "Imprimir", **Então** o sistema gera um PDF assinado, carimbado digitalmente e sem desconfiguração de página. `[Teste Automatizado]`

    **Cenários de Exceção (Casos Críticos)**
    * [x] **Dado que** o plugin ou provedor ICP-Brasil está off-line, **Quando** ocorre a tentativa de carimbar, **Então** o painel emite "Assinatura indisponível" e entra em contingência sem apagar os dados receitados. `[Teste Automatizado]`
    * [x] **Dado que** há uma quebra técnica catastrófica na lib geradora, **Quando** o botão emitir é pressionado e colapsa, **Então** emite log avisando que "PDF não gerado" foi alertado ao suporte técnico. `[Teste Manual]`

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História pequena voltada a geração de arquivo local (INVEST).
    * [x] **Critérios de Aceitação:** Padrão do layout PDF definido.
    * [x] **Validação com o Cliente:** Validado com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Biblioteca frontend de PDF integrada.
    * [x] **Estimabilidade:** Baixo esforço de desenvolvimento (PT=2.5).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes funcionais automatizados de geração e download.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado.
    * [x] **Garantia de Qualidade (QA):** Layout de impressão testado responsivamente.
    * [x] **Conformidade de Escopo:** Todo o conteúdo da receita contido na exportação do PDF.
    * [x] **Documentação:** Atualizada a documentação técnica sobre receitas.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE2 → CP3 → RF16 → US16).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 9 através do exportador local integrado de prescrições em [Prescricao/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Prescricao/index.jsx).
    * **Validação (Cliente):** Validada na Review da Sprint 9 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Formato de receituário padrão aprovado na Review.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração de escopo exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us16)

<span id="us17"></span>
??? danger "US17 — Analisar Prescrição por IA (Fora do MVP)"

    * **Identificador:** [US17 / RF17](backlog-de-produto.md)
    * **Status:** Fora do MVP :material-close-circle:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero que o sistema analise a prescrição em tempo real, utilizando IA para alertar sobre interações medicamentosas, garantindo a segurança do paciente."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [ ] **Dado que** o médico digita os itens de prescrição, **Quando** insiro "Dipirona 500mg", **Então** o sistema envia a requisição para o serviço de IA em segundo plano e mantém a digitação fluida.
    * [ ] **Dado que** o médico prescreve "Ibuprofeno" e "Varfarina", **Quando** a análise de incompatibilidade é concluída, **Então** o sistema abre um alerta vermelho na tela sinalizando "Risco de hemorragia".

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [ ] **Estrutura INVEST:** História de alta complexidade e fora do MVP.
    * [ ] **Critérios de Aceitação:** Parâmetros de resposta de IA não definidos.
    * [ ] **Validação com o Cliente:** Despriorizado em comum acordo.
    * [ ] **Dependências e Riscos:** Dependência de custos e APIs de IA de terceiros.
    * [ ] **Estimabilidade:** Estimado com alto esforço técnico (PT=4.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [ ] **Validação Técnica e Testes:** Sem testes implementados.
    * [ ] **Revisão Colaborativa:** Não desenvolvido.
    * [ ] **Garantia de Qualidade (QA):** N/A.
    * [ ] **Conformidade de Escopo:** Excluído do MVP.
    * [ ] **Documentação:** N/A.
    * [ ] **Rastreabilidade:** Mapeada a cadeia de valor (OE5 → CP9 → RF17 → US17).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Não verificada / Não iniciada.
    * **Validação (Cliente):** Cliente concordou em retirar a feature do escopo do MVP letivo.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Considerado recurso secundário em relação às barreiras regulatórias.
    * **Decisão:** Fora do MVP.
    * **Ajuste Realizado:** Nenhuma atividade de desenvolvimento executada.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#tabela-mvp)

<span id="us18"></span>
??? success "US18 — Histórico de Receitas do Paciente (Sprint 5)"

    * **Identificador:** [US18 / RF18](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero manter um log visível de todas as receitas anteriormente prescritas ao paciente, para consultar o histórico de tratamentos ao longo do tempo."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico abre o perfil do paciente "João da Silva", **Quando** clico na aba "Histórico de Receitas", **Então** o sistema lê a tabela local `receitas` do Dexie.js sem efetuar requisições ao servidor.
    * [x] **Dado que** o médico visualiza a aba de receitas, **Quando** o histórico é carregado, **Então** o sistema ordena a receita emitida em "01/07/2026" antes da receita de "15/06/2026".
    * [x] **Dado que** o médico clica na receita emitida em "15/06/2026", **Quando** seleciono "Visualizar", **Então** o sistema abre uma pré-visualização da receita e disponibiliza o botão "Baixar PDF".

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** Foco no histórico de receitas clínicas (INVEST).
    * [x] **Critérios de Aceitação:** Detalhes de renderização do histórico mapeados.
    * [x] **Validação com o Cliente:** Validado com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Sincronia com receitas IndexedDB.
    * [x] **Estimabilidade:** Complexidade técnica estimada como média (PT=2.5).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Teste automatizado de leitura e renderização no IndexedDB.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado.
    * [x] **Garantia de Qualidade (QA):** Visualização do log de receitas homologado.
    * [x] **Conformidade de Escopo:** Exibição cronológica e dados íntegros.
    * [x] **Documentação:** Documentação de banco de dados atualizada.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE2 → CP2 → RF18 → US18).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 5 com teste de leitura IndexedDB local e visualização na aba de detalhes em [PacienteDetalhe/index.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/PacienteDetalhe/index.jsx).
    * **Validação (Cliente):** Validada na Review da Sprint 5 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Exibição das receitas anteriores integrada de forma fluida ao histórico do paciente.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us18)

<span id="us19"></span>
??? danger "US19 — Gerar e Assinar TCLE (Fora do MVP)"

    * **Identificador:** [US19 / RF19](backlog-de-produto.md)
    * **Status:** Fora do MVP :material-close-circle:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero que o sistema gere o Termo de Consentimento (TCLE) e permita sua assinatura digital (ICP-Brasil), para formalizar o aceite do paciente antes do atendimento e cumprir exigências legais."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [ ] **Dado que** o médico solicita o termo de consentimento, **Quando** clico em "Gerar TCLE", **Então** o sistema monta o documento associando o nome "João da Silva" e o CPF "123.456.789-00" ao texto padrão do termo.
    * [ ] **Dado que** o médico e o paciente iniciam a assinatura do TCLE, **Quando** submetem os certificados digitais, **Então** o sistema gera as chaves de assinatura conjunta do médico e o registro de aceite de "João da Silva".

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [ ] **Estrutura INVEST:** História despriorizada do MVP letivo.
    * [ ] **Critérios de Aceitação:** N/A.
    * [ ] **Validação com o Cliente:** Despriorização homologada pelo Dr. Rogério.
    * [ ] **Dependências e Riscos:** Risco técnico de assinatura em múltiplos perfis mitigado por exclusão.
    * [ ] **Estimabilidade:** PT=3.0.

    #### :material-school-outline: Definition of Done (DoD)
    * [ ] **Validação Técnica e Testes:** Sem testes.
    * [ ] **Revisão Colaborativa:** Não desenvolvido.
    * [ ] **Garantia de Qualidade (QA):** N/A.
    * [ ] **Conformidade de Escopo:** Excluído do MVP.
    * [ ] **Documentação:** N/A.
    * [ ] **Rastreabilidade:** Mapeada a cadeia de valor (OE3 → CP8 → RF19 → US19).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Não verificada / Não iniciada.
    * **Validação (Cliente):** Substituído por processo físico de termo impresso em comum acordo.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Entendeu que o recurso é dispensável no MVP e pode ser contornado manualmente.
    * **Decisão:** Fora do MVP.
    * **Ajuste Realizado:** Nenhuma alteração efetuada.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#tabela-mvp)

<span id="us20"></span>
??? success "US20 — Cadastrar Médicos (Sprint 2)"

    * **Identificador:** [US20 / RF20](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como administrador, eu quero cadastrar novos perfis de acesso de médicos, para registrar novos profissionais no sistema."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin Estruturado)

    **Fluxo Nominal (Caminho Feliz)**
    * [x] **Dado que** o usuário está na tela de login, **Quando** insere credenciais previamente validadas, **Então** o sistema concede o token JWT e redireciona para o painel principal. `[Teste Automatizado]`

    **Cenários de Exceção (Casos Críticos)**
    * [x] **Dado que** o usuário não possui conta ou errou a digitação, **Quando** tenta acessar com e-mail ou senha errados, **Então** o sistema nega o payload e emite o aviso "Credenciais inválidas". `[Teste Automatizado]`

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** Foco em permissões de perfil administrativo.
    * [x] **Critérios de Aceitação:** Critérios de validação e formato estruturado definidos.
    * [x] **Validação com o Cliente:** Homologado com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Integrado com controle de acesso RBAC.
    * [x] **Estimabilidade:** Complexidade técnica estimada como alta/média (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes unitários de backend validando a inserção de novos médicos.
    * [x] **Revisão Colaborativa:** PR aprovado e integrado no pipeline.
    * [x] **Garantia de Qualidade (QA):** Interface administrativa e restrições de acesso validadas.
    * [x] **Conformidade de Escopo:** Apenas admins efetuam o cadastro de CRM-UF de forma íntegra.
    * [x] **Documentação:** Atualizada a documentação de esquemas administrativos.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE3 → CP6 → RF20 → US20).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 2 com testes de backend em [medicos.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/medicos.test.js) e rotas administrativas no backend.
    * **Validação (Cliente):** Validado na Review da Sprint 3 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:**
        * *Sprint 2:* Aprovado conforme a lógica proposta para a clínica piloto (administrador cadastra médicos).
        * *Sprint 3:* Cadastro e fluxos operam perfeitamente.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nossos padrões atendem. Nenhuma alteração exigida além da unificação do padrão CRM-UF.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us20)

<span id="us21"></span>
??? success "US21 — Editar Perfis de Médicos (Sprint 1)"

    * **Identificador:** [US21 / RF21](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como administrador, eu quero editar os perfis de acesso de médicos, para atualizar seus dados cadastrais e permissões."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o usuário possui o perfil "Recepcionista", **Quando** tenta acessar a rota de edição de médicos `/admin/medicos/12/editar`, **Então** o sistema impede o acesso e exibe "Ação restrita a Administradores".
    * [x] **Dado que** o administrador edita as informações do médico, **Quando** limpa o sufixo da UF deixando apenas "54321", **Então** o sistema invalida o campo e exibe o erro "O CRM-UF é obrigatório".
    * [x] **Dado que** o administrador conclui a edição do médico ID 12, **Quando** clico em "Salvar", **Então** o sistema insere o log "MUTAÇÃO: Cadastro do Médico ID 12 editado por Admin ID 2" na trilha de auditoria.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História pequena e negociável voltada a permissões.
    * [x] **Critérios de Aceitação:** Critérios objetivos incorporando feedback do CRM-UF.
    * [x] **Validação com o Cliente:** Validado com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Integrado com dados de cadastro médico.
    * [x] **Estimabilidade:** Complexidade técnica estimada (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados cobrindo a rota de edição de médicos.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado.
    * [x] **Garantia de Qualidade (QA):** Formulário de edição com validação de dados testado.
    * [x] **Conformidade de Escopo:** CRM-UF obrigatório na edição de médicos.
    * [x] **Documentação:** Endpoints documentados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE3 → CP6 → RF21 → US21).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [medicos.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/medicos.test.js) e métodos de controle em [medicos.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/medicos.js).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** CRM dos médicos deve exigir obrigatoriamente a unidade federativa (CRM-UF) para evitar duplicidade de registros.
    * **Decisão:** Aprovado com ressalvas.
    * **Ajuste Realizado:** Atualizada a especificação do cadastro de médicos no backlog e banco de dados para incluir validação obrigatória do CRM-UF.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us21)

<span id="us22"></span>
??? success "US22 — Inativar Perfis de Médicos (Sprint 1)"

    * **Identificador:** [US22 / RF22](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como administrador, eu quero inativar logicamente perfis de acesso de médicos, para suspender o acesso de profissionais que não atuam mais no sistema."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o administrador inativa o médico "Dr. Renato Santos", **Quando** clico em "Inativar", **Então** o sistema define a flag `status` como "Inativo" na tabela `medicos` do banco de dados, sem remover o registro.
    * [x] **Dado que** o médico "Dr. Renato Santos" está com status "Inativo", **Quando** tenta efetuar login com suas credenciais, **Então** o sistema recusa a autenticação e exibe o erro "Acesso bloqueado. Profissional inativo".
    * [x] **Dado que** o usuário logado possui o perfil "Recepcionista", **Quando** envia uma requisição de inativação de médico, **Então** a API recusa a requisição e retorna o status `403 Forbidden`.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** Foco no bloqueio rápido de credenciais e segurança de acessos.
    * [x] **Critérios de Aceitação:** Regras para a inativação de conta de médicos estipuladas.
    * [x] **Validação com o Cliente:** Homologado com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Integrado com segurança de autenticação.
    * [x] **Estimabilidade:** Estimativa de esforço média (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados validando o bloqueio lógico de acessos do médico.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado.
    * [x] **Garantia de Qualidade (QA):** Verificação de que médico inativado não consegue realizar login.
    * [x] **Conformidade de Escopo:** Acesso revogado sem excluir dados históricos.
    * [x] **Documentação:** Lógica documentada no código de autenticação.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE3 → CP6 → RF22 → US22).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [medicos.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/medicos.test.js) e lógica em [medicos.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/medicos.js).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Aprovada a suspensão lógica das credenciais dos profissionais.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us22)

<span id="us23"></span>
??? success "US23 — Buscar Perfis de Médicos (Sprint 1)"

    * **Identificador:** [US23 / RF23](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como administrador, eu quero buscar e listar perfis de acesso de médicos, para gerenciar as credenciais e contas de profissionais do sistema."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o administrador está na tela de pesquisa de profissionais, **Quando** digito "Renato" ou "12345-DF", **Então** o sistema exibe na lista o registro de "Dr. Renato Santos".
    * [x] **Dado que** o usuário comum tenta acessar a lista de busca administrativa de médicos, **Quando** carrega a rota `/admin/medicos`, **Então** o sistema redireciona o usuário para a página de acesso negado.
    * [x] **Dado que** o administrador visualiza a tabela de busca de médicos, **Quando** o grid carrega, **Então** o sistema exibe o nome do profissional e uma sinalização visual "Ativo" ou "Inativo" na coluna de status.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História pequena voltada a visualização administrativa.
    * [x] **Critérios de Aceitação:** Filtros de busca definidos de forma clara.
    * [x] **Validação com o Cliente:** Validada a necessidade administrativa com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Sincronizado com base de dados médicos.
    * [x] **Estimabilidade:** Complexidade técnica estimada como média (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados validando filtros e permissões de busca de médicos.
    * [x] **Revisão Colaborativa:** PR aprovado e mergeado.
    * [x] **Garantia de Qualidade (QA):** Interface de busca administrativa homologada.
    * [x] **Conformidade de Escopo:** Busca retorna profissionais conforme filtros aplicados.
    * [x] **Documentação:** Endpoints de busca documentados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE3 → CP6 → RF23 → US23).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [medicos.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/medicos.test.js) e lógica em [medicos.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/medicos.js).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Filtros de busca por nome e CRM validados.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração de escopo necessária.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us23)

<span id="us24"></span>
??? success "US24 — Consultar Logs de Auditoria (Sprint 5)"

    * **Identificador:** [US24 / RF24](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, administrador ou paciente, eu quero visualizar, buscar e filtrar o histórico de logs de auditoria sobre dados sensíveis, para rastrear todas as operações e garantir a conformidade e segurança."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin Estruturado)

    **Fluxo Nominal (Caminho Feliz)**
    * [x] **Dado que** sou um administrador, **Quando** navego pela aba de logs de integração, **Então** consigo ver o histórico de hashes para cada paciente sem manipulação de terceiros. `[Teste Automatizado]`

    **Cenários de Exceção (Casos Críticos)**
    * [x] **Dado que** o servidor detecta uma tentativa de violação, alteração ou exclusão arbitrária feita via acesso direto ao banco (DB), **Quando** eu carrego a aba Auditoria, **Então** o painel brilha uma notificação severa identificando "Falha de auditoria: Quebra detectada na rastreabilidade". `[Teste Automatizado]`

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** Foco no cumprimento de normas da LGPD e segurança de auditoria (INVEST).
    * [x] **Critérios de Aceitação:** Regras de mascaramento de dados clínicos sensíveis incorporadas.
    * [x] **Validação com o Cliente:** Validação de conformidade legal e necessidades com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Integrado com segurança lógica e registros de auditoria no banco.
    * [x] **Estimabilidade:** Complexidade técnica estimada como alta/média (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes unitários/integração atestando integridade e mascaramento de logs sensíveis.
    * [x] **Revisão Colaborativa:** PR revisado e aprovado.
    * [x] **Garantia de Qualidade (QA):** Interface de visualização de logs validada.
    * [x] **Conformidade de Escopo:** logs mostram metadados de forma mascarada para admins.
    * [x] **Documentação:** Documentação sobre compliance com LGPD atualizada.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE3 → CP7 → RF24 → US24).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 5 com testes de logs de backend em [logs.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/logs.test.js) e lógica em [auditoria.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/helpers/auditoria.js).
    * **Validação (Cliente):** Validada na Review da Sprint 5 pelo Dr. Rogério Duarte.


    #### :material-source-branch: Governança do Repositório

    | Artefato | Link |
    | :--- | :--- |
    | **Issue** | `N/A — Sem Issue cadastrada` |
    | **Pull Request** | `N/A — Merge na branch dev` |
    | **Revisor** | `N/A — Sem revisão por pares` |

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** O sistema grava logs corretamente, mas dados clínicos e informações sensíveis (CPF) de pacientes devem ser mascarados para o perfil admin.
    * **Decisão:** Aprovado com ressalvas.
    * **Ajuste Realizado:** Atualizada a política de auditoria e código para mascarar campos sensíveis nos logs visualizados por administradores de TI.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us24)

---

## :material-shield-key-outline: Detalhamento dos Requisitos Não Funcionais (RNFs)

Abaixo está listada a especificação detalhada de conformidade de cada requisito não funcional (RNF) do projeto ProntoCare:

<span id="rnf01"></span>
??? success "RNF01 — Logs de Auditoria com Hashing (Sprint 7)"

    * **Identificador:** [RNF01](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Descrição
    > O sistema deve registrar um log rastreável com hashing em todas as ações de criação, edição e exclusão feitas pelos usuários, garantindo a auditabilidade de mutações de dados.

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico realiza o salvamento de um prontuário clínico, **Quando** a operação de gravação é finalizada, **Então** o sistema registra na tabela de auditoria a linha contendo o timestamp, `medico_id`, o tipo "CRIAÇÃO" e o hash "SHA-256: f1e2d3...".
    * [x] **Dado que** o médico abre o prontuário do paciente "João da Silva", **Quando** visualizo a seção de integridade, **Então** o sistema renderiza uma linha do tempo com ícones verdes indicando a validação de hash bem-sucedida de cada registro.
    * [x] **Dado que** o sistema executa a verificação dos hashes da trilha de logs, **Quando** um hash recalculado difere do valor persistido no banco de dados (detectando adulteração), **Então** o sistema exibe um alerta vermelho "Falha de auditoria: Registro corrompido ou modificado sem autorização".

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Critérios de integridade definidos de forma clara.
    * [x] Validação jurídica das regras de rastreabilidade (LGPD).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Cobertura de testes unitários/integração implementada.
    * [x] Código revisado por pares no repositório.
    * [x] Interface de logs de integridade validada no frontend.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 7 com testes automatizados em [logs.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/logs.test.js) e [blockchain.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/blockchain.test.js).
    * **Validação (Cliente):** Validada na Review da Sprint 7 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Confirmou que os logs registram as ações de forma precisa. Solicitou mascaramento de campos sensíveis (como CPF e dados clínicos) para perfis administrativos.
    * **Decisão:** Aprovado com ressalvas.
    * **Ajuste Realizado:** Atualizada a política de logs para mascarar campos sensíveis nos painéis administrativos.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-rnf01)

<span id="rnf02"></span>
??? success "RNF02 — Criptografia de Credenciais com bcrypt (Sprint 8)"

    * **Identificador:** [RNF02](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Descrição
    > As senhas e demais dados sensíveis de acesso devem ser armazenados de forma criptografada no banco de dados usando `bcrypt`.

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o usuário define a senha como "ProntoCare123!" no cadastro, **Quando** clico em salvar, **Então** o sistema armazena no banco de dados o valor gerado "$2b$12$Lh..." pelo algoritmo bcrypt.
    * [x] **Dado que** o usuário tenta realizar login no sistema, **Quando** insere credenciais inválidas (usuário inexistente ou senha incorreta), **Então** o sistema recusa a autenticação e exibe o erro "Usuário ou senha inválidos".
    * [x] **Dado que** o usuário realiza login no sistema, **Quando** a requisição HTTP de autenticação é enviada, **Então** a senha trafega criptografada na camada HTTPS e o campo de senha no banco nunca é exposto em texto claro.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Biblioteca de criptografia e fator de segurança de chaves definidos.
    * [x] Validação de regras de acesso (RBAC).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes de autenticação e criptografia passando.
    * [x] Código revisado e integrado no pipeline.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de autenticação em [auth.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/tests/auth.test.js).
    * **Validação (Cliente):** Validada na Review da Sprint 8 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Dr. Rogério atestou e validou a segurança dos esquemas de autenticação implementados no banco.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-rnf02)

<span id="rnf03"></span>
??? success "RNF03 — Usabilidade / Operação Offline (Sprint 6)"

    * **Identificador:** [RNF03](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Descrição
    > O sistema deve ser capaz de operar localmente e salvar dados mesmo sem conexão com a internet (banco local offline via Dexie.js).

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** a rede de internet é desconectada no tablet do médico, **Quando** abro a tela do prontuário do paciente "João da Silva", **Então** o sistema lê os dados salvos localmente e permite realizar novas anotações SOAP.
    * [x] **Dado que** a conectividade do sistema é interrompida, **Quando** o navegador detecta a queda da rede, **Então** a barra superior muda de cor para vermelho e exibe o aviso "Modo Offline - Sincronização pendente".
    * [x] **Dado que** o médico salva um prontuário em modo desconectado, **Quando** clico em "Salvar", **Então** o sistema exibe a mensagem "Salvo no dispositivo" e enfileira a requisição na base local `Dexie.js`.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Arquitetura offline-first e persistência IndexedDB documentadas.
    * [x] Validação prévia de usabilidade domiciliar síncrona/assíncrona.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes de simulação de queda de internet passando (Vitest).
    * [x] Verificação visual e responsiva da UI offline realizada pela equipe de QA.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 6 com testes em [offlineService.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/offlineService.test.js) (15 testes passando) e serviço [offlineService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/offlineService.js).
    * **Validação (Cliente):** Validada na Review da Sprint 6 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Exportação atende. Para o modo offline, solicitou indicador visual explícito do estado de rede e sincronização.
    * **Decisão:** Aprovado com ressalvas (Sprint 5) / Aprovado (Sprint 6).
    * **Ajuste Realizado:** Implementado o componente de barra de status `OfflineStatusBar` em [OfflineStatusBar.jsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/components/OfflineStatusBar.jsx) e opção de backup/exportação manual na barra.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-rnf03)

<span id="rnf04"></span>
??? success "RNF04 — Sincronização e Backup Diário (Sprint 6)"

    * **Identificador:** [RNF04](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Descrição
    > O sistema deve possuir uma rotina automática que realiza o backup diário dos dados para a nuvem quando houver conexão.

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o tablet do médico possui 3 requisições salvas na fila IndexedDB, **Quando** a internet é restabelecida, **Então** o service worker envia as requisições de forma assíncrona esvaziando a fila de pendências.
    * [x] **Dado que** a sincronização em segundo plano está em andamento, **Quando** ocorre uma oscilação na rede que derruba a conexão por 5 segundos, **Então** o sistema aguarda e retenta a sincronização silenciosamente sem exibir popups de erro para o médico.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Regras de resolução de conflitos e sincronização especificadas.
    * [x] Frequência e processos de retentativa definidos.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Código de service workers testado em ambiente local.
    * [x] Revisão da fila de sincronização pelo time de QA.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 6 com o analisador de sincronização em [offlineService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/offlineService.js#L258-L317).
    * **Validação (Cliente):** Validada na Review da Sprint 6 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Sincronização offline validada com sucesso, mas pontuou que falhas temporárias não devem disparar popups de erros invasivos.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Ajustada lógica do service worker para executar retentativas automáticas e alertas silenciosos.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-rnf04)

<span id="rnf05"></span>
??? success "RNF05 — Conformidade SBIS / CFM (Sprint 8)"

    * **Identificador:** [RNF05](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Descrição
    > O sistema deve estar em conformidade com as resoluções do CFM, garantindo que seus módulos cumpram os requisitos do NGS exigidos para a certificação da SBIS.

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o prontuário do paciente "João da Silva" está assinado digitalmente, **Quando** clico no campo SOAP para tentar reescrever o texto da anamnese, **Então** o sistema desabilita o campo e exibe o botão "Adicionar Retificação".
    * [x] **Dado que** o médico executa a exportação histórica de prontuários, **Quando** a rotina de backup gera os arquivos compactados, **Então** os relatórios são salvos em formato PDF/A estruturado legível por leitores padrão de longo prazo.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Mapeamento dos requisitos do NGS da SBIS efetuado.
    * [x] Validação das regras éticas clínicas com o Dr. Rogério Duarte.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes de logs de acesso e integridade do blockchain validados.
    * [x] Documentação de compliance finalizada.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 8 com análise de logs de acesso de prontuários em [pacientes.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/back/src/controllers/pacientes.js#L59) e gravação de chaves/integridade do blockchain.
    * **Validação (Cliente):** Validada na Review da Sprint 8 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:**
        * *Sprint 4:* Lembrou que a norma do CFM impede a edição de prontuários assinados.
        * *Sprint 8:* Relembrou a guarda de prontuários por 20 anos, exigindo que exportação suporte arquivamento.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Implementado histórico de prontuários SOAP no sistema e atualizadas diretrizes de backup para arquivamento no longo prazo.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-rnf05)

<span id="rnf06"></span>
??? success "RNF06 — Responsividade de Interface (Sprint 1)"

    * **Identificador:** [RNF06](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Descrição
    > O sistema deve adaptar seu layout automaticamente de acordo com a resolução do dispositivo utilizado (Desktop, Tablet, Mobile), garantindo a legibilidade e usabilidade da interface clínica.

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** a interface é aberta em uma tela com largura de "360px" (viewport de celular), **Quando** a página carrega, **Então** o sistema reorganiza os botões e campos de texto em coluna única mantendo o padding legível.
    * [x] **Dado que** a agenda é exibida em um tablet com largura de "768px", **Quando** a tela é carregada, **Então** o menu de navegação lateral se recolhe e o botão de menu "hambúrguer" fica visível no topo da página.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Grade responsiva e breakpoints de CSS definidos no Design System.
    * [x] Validação prévia de wireframes móveis com o cliente.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes visuais manuais e automatizados de responsividade concluídos.
    * [x] Layout verificado em viewports mobile (360px), tablet (768px) e desktop (1024px+).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de viewports no frontend e CSS customizado em [App.css](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/App.css#L67), [Panel.css](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Panel.css#L763), [styles.css](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/PacienteDetalhe/styles.css#L901) e [styles.css](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/pages/Register/styles.css#L188).
    * **Validação (Cliente):** Validada pelo Dr. Rogério Duarte durante as reviews das Sprints 1 e 3.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Solicitou que a visualização de prontuários em celulares permita rolagem horizontal limpa de tabelas grandes e botões de ação fixos no topo/rodapé.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Implementado overflow horizontal em tabelas e fixados botões de ação nas visualizações móveis.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-rnf06)

<span id="rnf08"></span>
??? success "RNF08 — Hash SHA-256 no PDF do Prontuário (Sprint 5)"

    * **Identificador:** [RNF08](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Descrição
    > O sistema deve gerar um hash de integridade SHA-256 para cada prontuário exportado em PDF, processado do lado do cliente através da Web Crypto API.

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o prontuário de "João da Silva" é gerado como um array de bytes no navegador, **Quando** a exportação para PDF é iniciada, **Então** a função `crypto.subtle.digest` calcula o hash SHA-256 del conteúdo.
    * [x] **Dado que** o médico abre o arquivo `prontuario_joao.pdf` gerado, **Quando** visualizo a parte inferior da folha, **Então** o sistema estampa o texto "Hash de Integridade (SHA-256): 9f86d081...".
    * [x] **Dado que** o PDF é exportado localmente, **Quando** o processo é concluído, **Então** o sistema envia uma requisição HTTP contendo o hash do PDF para salvamento na tabela `blockchain` do banco de dados.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Biblioteca de criptografia nativa (Web Crypto API) mapeada.
    * [x] Design de layout do PDF definido.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes unitários do gerador de hash SHA-256 passando.
    * [x] Carimbo visual de integridade verificado pela equipe de QA.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 5 com testes de hash em [hashService.test.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/hashService.js) e renderizador em [pdfExportService.js](https://github.com/mdsreq-fga-unb/REQ-2026.1-T01-ProntoCare/blob/main/front/src/services/pdfExportService.js#L405).
    * **Validação (Cliente):** Validada na Review da Sprint 5 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Solicitou que a versão PDF exiba de forma evidente o hash SHA-256 para permitir conferência visual externa.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Adicionado no layout do PDF o rodapé com chancela de integridade do hash.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-rnf08)

<span id="rnf09"></span>
??? success "RNF09 — Infraestrutura de Assinatura ICP-Brasil (Sprint 9/10)"

    * **Identificador:** [RNF09](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Descrição
    > O sistema deve utilizar infraestrutura de chaves públicas padrão ICP-Brasil para a realização de assinaturas digitais, garantindo a autoria, a integridade e o não-repúdio dos documentos gerados.

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** o médico insere um certificado no modal de assinatura, **Quando** clico em assinar, **Então** o sistema valida a cadeia de confiança do certificado A3/PSC contra as ACs autorizadas da ICP-Brasil.
    * [x] **Dado que** o certificado digital del médico é verificado com sucesso, **Quando** a assinatura qualificada é vinculada ao prontuário, **Então** o status do registro muda para "Assinado" e a edição do conteúdo original é permanentemente bloqueada.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Bibliotecas de integração e conformidade regulatória com chaves ICP-Brasil mapeadas.
    * [x] Fluxo de validação de assinatura estruturado.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes de integração de bibliotecas de assinatura qualificada validados.
    * [x] Testes de validação de revogação/expiração de chaves concluídos.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 9/10 com testes integrados usando certificados de teste e checando a imutabilidade do documento pós-assinatura.
    * **Validação (Cliente):** Validada na Review final da Sprint 9/10 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Aprovado fluxo integrado e chancelas de assinatura geradas.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-rnf09)

---

## :material-calendar-month: Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-05-18 | 0.1 | Criação da tabela unificada de consolidação de feedback por US. | Prontuariantes |
| 2026-06-30 | 1.0 | Transformação do documento de consolidação de feedback em Sprint Backlog rastreável (US por US) com checklists DoR/DoD e caminhos absolutos corrigidos. | Prontuariantes |
| 2026-06-30 | 1.1 | Fechamento do backlog do MVP: marcação das histórias pendentes (US08, US15 e RNF09) como Concluídas e validadas pós-finalização do projeto. | Prontuariantes |
| 2026-06-30 | 1.2 | Reformulação de todos os critérios de aceitação (User Stories e RNFs) no formato formal de especificação Gherkin (Dado/Quando/Então). | Prontuariantes |
| 2026-06-30 | 1.3 | Correção de quebras de formatação: remoção de invólucros HTML raw (`<div>`) que impediam o parser markdown de renderizar as listas e checklists de forma correta e elegante no MkDocs. | Prontuariantes |
| 2026-06-30 | 1.4 | Transição de dropdowns HTML (`<details>`) para dropdowns nativos do Material for MkDocs (`???` e `??? success/danger`) indentados a 4 espaços, e substituição de todos os emojis por Material Icons oficiais (`:material-...:`). | Prontuariantes |
| 2026-06-30 | 1.5 | Unificação do Sprint Backlog detalhado (USs, RNFs e revisões) diretamente no painel de progresso do projeto (`progresso/index.md`), eliminando arquivos redundantes. | Prontuariantes |
| 2026-07-01 | 1.6 | Adição da Tabela Consolidadora de Feedback de Validação por US com diferenciação de tipos de artefatos e links diretos para atas e vídeos das sprints correspondentes. | Prontuariantes |
| 2026-07-01 | 1.7 | Correção e expansão de critérios de aceitação Gherkin para cobrir casos críticos solicitados no feedback (CPF duplicado, credenciais inválidas, anexo inválido, assinatura indisponível, falha de PDF e auditoria). | Prontuariantes |
| 2026-07-01 | 1.7 | Correção de auditoria: inserção do bloco "Governança do Repositório" (Issue, PR e Revisor) na seção de rastreabilidade de cada uma das 22 USs do MVP, conforme exigência do DoD v1.6. | Prontuariantes |
| 2026-07-01 | 1.8 | Correção das sprints de entrega para as USs 04, 06, 20 (alteradas para Sprint 2) e US18 (alterada para Sprint 5) no cronograma de acompanhamento e rastreabilidade para alinhamento com as atas de sprint. | Prontuariantes |


<script>
document.addEventListener("DOMContentLoaded", function() {
    function openTargetDetails(hash) {
        if (!hash) return;
        var target = document.querySelector(hash);
        if (target) {
            var details = target.nextElementSibling;
            while (details && details.tagName !== 'DETAILS') {
                details = details.nextElementSibling;
            }
            if (details && details.tagName === 'DETAILS') {
                details.setAttribute('open', '');
                setTimeout(function() {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
        }
    }
    
    // Run on initial page load if hash exists
    if (window.location.hash) {
        setTimeout(function() {
            openTargetDetails(window.location.hash);
        }, 150);
    }
    
    // Intercept clicks on links pointing to hashes
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            var hash = link.getAttribute('href');
            openTargetDetails(hash);
        }
    });
});
</script>

