# **Acompanhamento de US e RNF**

Esta página apresenta as tabelas e especificações detalhadas de progresso, verificação e validação das Histórias de Usuário (US) e Requisitos Não Funcionais (RNFs) planejados para o MVP do ProntoCare.

<span id="tabela-mvp"></span>
### Tabela Geral de Acompanhamento do MVP

| ID da US | Requisito Relacionado | Sprint de Entrega | PT | Status |
| :---: | :--- | :---: | :---: | :---: |
| <span id="ref-us01"></span>[**US01**](#us01) | **RF01** - Cadastrar pacientes | Sprint 1 | 2.0 | **Concluído** |
| <span id="ref-us02"></span>[**US02**](#us02) | **RF02** - Editar registros | Sprint 1 | 2.0 | **Concluído** |
| <span id="ref-us03"></span>[**US03**](#us03) | **RF03** - Excluir registros | Sprint 1 | 1.5 | **Concluído** |
| <span id="ref-us04"></span>[**US04**](#us04) | **RF04** - Buscar pacientes | Sprint 3 | 2.0 | **Concluído** |
| <span id="ref-us05"></span>[**US05**](#us05) | **RF05** - Exportar base JSON | Sprint 5 | 2.5 | **Concluído** |
| <span id="ref-us06"></span>[**US06**](#us06) | **RF06** - Registrar prontuário SOAP | Sprint 3 | 3.0 | **Concluído** |
| <span id="ref-us07"></span>[**US07**](#us07) | **RF07** - Histórico clínico | Sprint 3 | 3.0 | **Concluído** |
| <span id="ref-us08"></span>[**US08**](#us08) | **RF08** - Assinar prontuário | Sprint 9/10 | 3.5 | **Concluído** |
| <span id="ref-us09"></span>[**US09**](#us09) | **RF09** - Exportar prontuário PDF | Sprint 5 | 3.0 | **Concluído** |
| <span id="ref-us10"></span>[**US10**](#us10) | **RF10** - Visualizar calendário | Sprint 8 | 2.0 | **Concluído** |
| <span id="ref-us11"></span>[**US11**](#us11) | **RF11** - Agendar consultas | Sprint 8 | 3.0 | **Concluído** |
| <span id="ref-us12"></span>[**US12**](#us12) | **RF12** - Listar consultas do dia | Sprint 8 | 2.0 | **Concluído** |
| <span id="ref-us13"></span>[**US13**](#us13) | **RF13** - Alterar status da consulta | Sprint 8 | 2.0 | **Concluído** |
| <span id="ref-us14"></span>[**US14**](#us14) | **RF14** - Elaborar receita digital | Sprint 9 | 3.0 | **Concluído** |
| <span id="ref-us15"></span>[**US15**](#us15) | **RF15** - Assinar receita | Sprint 9/10 | 3.0 | **Concluído** |
| <span id="ref-us16"></span>[**US16**](#us16) | **RF16** - Emitir receita PDF | Sprint 9 | 2.5 | **Concluído** |
| <span id="ref-us18"></span>[**US18**](#us18) | **RF18** - Histórico de receitas | Sprint 9 | 2.5 | **Concluído** |
| <span id="ref-us20"></span>[**US20**](#us20) | **RF20** - Cadastrar médicos | Sprint 3 | 3.0 | **Concluído** |
| <span id="ref-us21"></span>[**US21**](#us21) | **RF21** - Editar perfis de médicos | Sprint 1 | 3.0 | **Concluído** |
| <span id="ref-us22"></span>[**US22**](#us22) | **RF22** - Inativar perfis de médicos | Sprint 1 | 3.0 | **Concluído** |
| <span id="ref-us23"></span>[**US23**](#us23) | **RF23** - Buscar perfis de médicos | Sprint 1 | 3.0 | **Concluído** |
| <span id="ref-us24"></span>[**US24**](#us24) | **RF24** - Consultar logs auditoria | Sprint 5 | 3.0 | **Concluído** |

<span id="tabela-rnfs"></span>
## :material-check-decagram: **Tabela de Verificação de Requisitos Não Funcionais (RNFs)**

Para garantir a qualidade do sistema ProntoCare, cada um dos requisitos não funcionais elencados no projeto foi submetido a verificações técnicas e testes automatizados ou manuais. A tabela a seguir detalha o método de verificação, os resultados obtidos e as evidências de conformidade de cada RNF:

| ID | Requisito Não Funcional | Método de Verificação | Resultado | Evidência / Arquivos Relacionados |
| :---: | :--- | :--- | :--- | :--- |
| <span id="ref-rnf01"></span>[**RNF01**](#rnf01) | **Logs com hashing:** Registrar log rastreável com hashing em todas as ações de criação, edição e exclusão. | Execução de testes de integração automatizados (`Jest`) no backend e validação visual da aba de Logs/Integridade na tela do paciente. | **Aprovado** (Implementado e verificado) | - **Testes de Integração:** [logs.test.js](/REQ-2026.1-T01-ProntoCare/back/tests/logs.test.js) e [blockchain.test.js](/REQ-2026.1-T01-ProntoCare/back/tests/blockchain.test.js)<br>- **Lógica Backend:** [auditoria.js](/REQ-2026.1-T01-ProntoCare/back/src/helpers/auditoria.js) (hooks de log) e [blockchain.js](/REQ-2026.1-T01-ProntoCare/back/src/controllers/blockchain.js) (integração do prontuário)<br>- **Frontend Timeline:** [PacienteDetalhe/index.jsx](/REQ-2026.1-T01-ProntoCare/front/src/pages/PacienteDetalhe/index.jsx) (renderização dos logs e verificação da blockchain) |
| <span id="ref-rnf02"></span>[**RNF02**](#rnf02) | **Criptografia de Credenciais:** Armazenar senhas de acesso criptografadas no banco usando `bcrypt`. | Verificação de criptografia no cadastro de usuários via testes automatizados no backend. | **Aprovado** (Implementado e verificado) | - **Criptografia:** [medicos.js](/REQ-2026.1-T01-ProntoCare/back/src/controllers/medicos.js#L54) e [pacientes.js](/REQ-2026.1-T01-ProntoCare/back/src/controllers/pacientes.js#L83)<br>- **Mascaramento:** [auditoria.js](/REQ-2026.1-T01-ProntoCare/back/src/helpers/auditoria.js#L83)<br>- **Testes de Autenticação:** [auth.test.js](/REQ-2026.1-T01-ProntoCare/back/tests/auth.test.js) |
| <span id="ref-rnf03"></span>[**RNF03**](#rnf03) | **Operação Offline:** Funcionar localmente e salvar dados mesmo sem conexão (IndexedDB via Dexie.js). | Execução de testes de integração (`Vitest`) simulando ausência de conectividade e o uso de filas e atualizações otimistas. | **Aprovado** (Implementado e verificado) | - **Testes de Offline:** [offlineService.test.js](/REQ-2026.1-T01-ProntoCare/front/src/services/offlineService.test.js) (15 testes passando)<br>- **Serviço Local:** [offlineService.js](/REQ-2026.1-T01-ProntoCare/front/src/services/offlineService.js) (atualização otimista e controle de fila) |
| <span id="ref-rnf04"></span>[**RNF04**](#rnf04) | **Backup Diário na Nuvem:** Rotina automática de backup diário dos dados para a nuvem quando houver conexão. | Análise do código da barra de conectividade e das rotinas offline. | **Aprovado** (Implementado e verificado) | - **Backup Local:** [offlineService.js](/REQ-2026.1-T01-ProntoCare/front/src/services/offlineService.js#L258-L317) (lógica de geração de backup JSON e restauração)<br>- **Interface UI:** [OfflineStatusBar.jsx](/REQ-2026.1-T01-ProntoCare/front/src/components/OfflineStatusBar.jsx#L127-L167) (importação/exportação na barra de status) |
| <span id="ref-rnf05"></span>[**RNF05**](#rnf05) | **Conformidade CFM / SBIS:** Estar em conformidade com o NGS da SBIS e resoluções do CFM sobre prontuários. | Análise dos módulos de logs de auditoria e segurança. | **Aprovado** (Implementado e verificado) | - **Logs de Acesso:** [pacientes.js](/REQ-2026.1-T01-ProntoCare/back/src/controllers/pacientes.js#L59) (auditoria de visualizações)<br>- **Integridade:** [blockchain.js](/REQ-2026.1-T01-ProntoCare/back/src/controllers/blockchain.js) (logs e integridade no blockchain)<br>- **Assinatura Qualificada:** [AssinaturaModal.jsx](/REQ-2026.1-T01-ProntoCare/front/src/components/AssinaturaModal.jsx) |
| <span id="ref-rnf06"></span>[**RNF06**](#rnf06) | **Responsividade de Interface:** Adaptar layout automaticamente de acordo com a resolução (Desktop, Tablet, Mobile). | Verificação visual das telas com alteração de viewport e análise de Media Queries no CSS. | **Aprovado** (Implementado e verificado) | - **Breakpoints de CSS:** [App.css](/REQ-2026.1-T01-ProntoCare/front/src/App.css#L67-L160) (layout geral), [Panel.css](/REQ-2026.1-T01-ProntoCare/front/src/pages/Panel.css#L763-L775) (painel), [styles.css](/REQ-2026.1-T01-ProntoCare/front/src/pages/PacienteDetalhe/styles.css#L901-L925) (detalhes) e [styles.css](/REQ-2026.1-T01-ProntoCare/front/src/pages/Register/styles.css#L188-L210) (formulários) |
| <span id="ref-rnf07"></span>[**RNF07**](#rnf07)<span id="rnf07"></span> | **IA Assíncrona:** Chamadas à Inteligência Artificial devem ser assíncronas para não travar a interface de prescrição do usuário. | Análise do código da tela de prescrição (`Prescricao/index.jsx`). | **Não Implementado** | - **Código Prescrição:** [Prescricao/index.jsx](/REQ-2026.1-T01-ProntoCare/front/src/pages/Prescricao/index.jsx) (sem integrações de IA ativas) |
| <span id="ref-rnf08"></span>[**RNF08**](#rnf08) | **Hash SHA-256 de PDF:** Gerar hash de integridade SHA-256 para prontuário exportado via Web Crypto API no cliente. | Exportação de documentos (PDF) no frontend com verificação do hash gerado na página e gravação na blockchain de integridade. | **Aprovado** (Implementado e verificado) | - **Geração de Hash:** [hashService.js](/REQ-2026.1-T01-ProntoCare/front/src/services/hashService.js#L16-L41) e [pdfExportService.js](/REQ-2026.1-T01-ProntoCare/front/src/services/pdfExportService.js#L405)<br>- **Cadeia Blockchain:** [blockchainService.js](/REQ-2026.1-T01-ProntoCare/front/src/services/blockchainService.js#L81-L111)<br>- **Footer do PDF:** [pdfExportService.js](/REQ-2026.1-T01-ProntoCare/front/src/services/pdfExportService.js#L306-L310) |
| <span id="ref-rnf09"></span>[**RNF09**](#rnf09) | **Assinatura Digital ICP-Brasil:** Utilizar chaves públicas ICP-Brasil para assinaturas digitais, garantindo autoria, integridade e não-repúdio. | Testes de cifragem e integração com certificados A3 na emissão de receitas e prontuários. | **Aprovado** (Implementado e verificado) | - **Assinatura Digital:** [AssinaturaModal.jsx](/REQ-2026.1-T01-ProntoCare/front/src/components/AssinaturaModal.jsx)<br>- **Serviço Blockchain:** [blockchainService.js](/REQ-2026.1-T01-ProntoCare/front/src/services/blockchainService.js) |

---

## :material-clipboard-list-outline: Detalhamento do Sprint Backlog por US

Abaixo está listada a especificação completa de cada história de usuário (User Story) do projeto ProntoCare, contendo os critérios de aceitação refinados em padrão formal Gherkin (Dado/Quando/Então) e seus respectivos checklists de Definition of Ready (DoR) e Definition of Done (DoD).

<span id="us01"></span>
??? success "US01 — Cadastrar Pacientes (Sprint 1)"

    * **Identificador:** [US01 / RF01](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero registrar novos pacientes com seus dados cadastrais básicos e credenciais de acesso, para que eu possa iniciar o acompanhamento de histórico clínico e conceder acesso a eles no sistema."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um médico na tela de cadastro, **Quando** insiro um CPF com formato ou dígito verificador inválido, **Então** o sistema impede o salvamento e exibe um erro de validação.
    * [x] **Dado que** sou um médico na tela de cadastro, **Quando** preencho os dados do paciente, **Então** o sistema exige obrigatoriamente os campos de telefone e contato de emergência.
    * [x] **Dado que** sou um médico salvando um cadastro, **Quando** defino o status de acesso do paciente, **Então** o sistema permite selecionar entre "Ativo" ou "Inativo" no fluxo de criação.
    * [x] **Dado que** sou um médico concluindo o cadastro, **Quando** o paciente é salvo com sucesso, **Então** o sistema gera credenciais de acesso seguras e iniciais para o perfil dele.

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
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [pacientes.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/pacientes.test.js) e interface de cadastro em [Register/index.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/Register/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um médico visualizando o perfil de um paciente, **Quando** clico em editar, **Então** o sistema permite a edição direta de seus dados na mesma tela.
    * [x] **Dado que** sou um médico editando os dados do paciente, **Quando** altero o CPF para um formato inválido, **Então** o sistema recusa o salvamento e valida o formato do dígito.
    * [x] **Dado que** sou um médico salvando a edição, **Quando** confirmo as alterações, **Então** o sistema grava um log de auditoria associado ao ID do usuário que realizou a alteração.

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
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [pacientes.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/pacientes.test.js) e interface de edição em [PacienteDetalhe/index.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/PacienteDetalhe/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um médico efetuando uma exclusão, **Quando** solicito excluir um paciente, **Então** o sistema realiza a inativação lógica do registro no banco de dados sem removê-lo fisicamente.
    * [x] **Dado que** sou um médico inativando um paciente, **Quando** confirmo a inativação, **Então** o sistema altera o status do perfil de acesso dele para "Inativo".
    * [x] **Dado que** sou um paciente inativo, **Quando** tento efetuar login no sistema, **Então** o sistema bloqueia meu acesso de imediato.

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
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [pacientes.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/pacientes.test.js) e hook lógico de inativação em [pacientes.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/src/controllers/pacientes.js#L112).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Aprovada a inativação lógica para preservação de histórico clínico regulatório.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração de escopo necessária.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us03)

<span id="us04"></span>
??? success "US04 — Buscar Pacientes (Sprint 3)"

    * **Identificador:** [US04 / RF04](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero buscar e listar pacientes e perfis utilizando filtros (ex: nome, CPF, status de acesso), para gerenciar as credenciais e localizar o prontuário da pessoa atendida."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um médico na tela de busca, **Quando** pesquiso por nome parcial, nome completo ou CPF exato, **Então** o sistema retorna a listagem de pacientes correspondentes.
    * [x] **Dado que** sou um médico visualizando a listagem de busca, **Quando** o sistema carrega os resultados, **Então** ele exibe claramente o status de acesso (Ativo/Inativo) de cada paciente no grid principal.
    * [x] **Dado que** sou um médico consultando uma base volumosa de pacientes, **Quando** realizo uma busca, **Então** o sistema exibe os resultados com paginação ou carregamento sob demanda para otimizar a performance.

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
    * **Verificação (Equipe):** Verificado na Sprint 3 com testes de backend em [pacientes.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/pacientes.test.js) e interface de busca em [Panel.css](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/Panel.css).
    * **Validação (Cliente):** Validado nas Reviews das Sprints 2 (Protótipo) e 3 (Software) pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um médico ou administrador autenticado, **Quando** solicito a exportação de dados, **Então** o sistema gera um arquivo JSON estruturado contendo a base completa dos pacientes.
    * [x] **Dado que** sou um usuário exportando a base, **Quando** clico no botão de exportação, **Então** o navegador inicia localmente o download imediato do arquivo JSON.
    * [x] **Dado que** sou um usuário gerando uma exportação de dados, **Quando** a exportação é concluída, **Então** o sistema registra um log de auditoria no banco de dados com a identificação de quem realizou a ação.

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
    * **Verificação (Equipe):** Verificado na Sprint 5 com testes de frontend em [offlineService.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/services/offlineService.test.js) e exportador em [offlineService.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/services/offlineService.js#L258).
    * **Validação (Cliente):** Validado na Review da Sprint 5 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Aprovado formato padrão JSON para portabilidade de dados.
    * **Decisão:** Aprovado.
    * **Ajuste Realizado:** Nenhuma alteração exigida.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-us05)

<span id="us06"></span>
??? success "US06 — Registrar Prontuário Estruturado SOAP (Sprint 3)"

    * **Identificador:** [US06 / RF06](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero registrar prontuários estruturados no padrão SOAP no histórico clínico do paciente (preenchendo dados subjetivos, objetivos, avaliação e plano, incluindo anamnese em texto livre e a anexação de exames/documentos), para centralizar e manter o registro completo das informações de atendimento."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um médico registrando um atendimento, **Quando** preencho a ficha clínica, **Então** o sistema exige e valida a inserção de dados nos eixos estruturados do SOAP (Subjetivo, Objetivo, Avaliação, Plano).
    * [x] **Dado que** sou um médico acessando um prontuário assinado, **Quando** tento editar ou excluir o documento diretamente, **Então** o sistema bloqueia a ação para garantir a imutabilidade do registro original.
    * [x] **Dado que** sou um médico necessitando retificar um prontuário já assinado, **Quando** gravo uma alteração, **Então** o sistema cria uma nova versão/aditivo vinculada, mantendo o histórico de versões anteriores intacto no banco de dados.

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
    * **Verificação (Equipe):** Verificado na Sprint 3 com testes automatizados em [blockchain.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/blockchain.test.js) e interface de prontuário em [PacienteDetalhe/index.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/PacienteDetalhe/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 3 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um médico visualizando o prontuário do paciente, **Quando** acesso o histórico clínico, **Então** o sistema exibe os atendimentos e registros organizados por data de forma decrescente (do mais recente ao mais antigo).
    * [x] **Dado que** sou um médico consultando o histórico clínico, **Quando** visualizo as entradas da linha do tempo, **Então** o sistema identifica claramente o tipo de registro (SOAP, Prescrição, Anexo) e o médico autor de cada ação.
    * [x] **Dado que** sou um médico consultando a linha do tempo em múltiplos dispositivos, **Quando** a tela é redimensionada, **Então** a interface adapta seu layout responsivamente sem perda de conteúdo.

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
    * **Verificação (Equipe):** Verificado na Sprint 3 com testes de responsividade e interface em [PacienteDetalhe/index.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/PacienteDetalhe/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 3 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um médico acionando a assinatura de um prontuário, **Quando** clico em assinar, **Então** o sistema apresenta um modal de confirmação com a visualização estruturada dos dados clínicos antes de solicitar o acionamento da senha do certificado.
    * [x] **Dado que** sou um médico assinando o documento, **Quando** submeto o certificado ICP-Brasil, **Então** o sistema valida sua vigência e recusa a assinatura se o certificado estiver expirado ou revogado.
    * [x] **Dado que** sou um médico com prontuário assinado, **Quando** realizo a exportação do prontuário para PDF, **Então** o sistema estampa no rodapé a chancela visual da assinatura digital qualificada e o hash de integridade.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História refinada com restrições jurídicas/regulatórias claras.
    * [x] **Critérios de Aceitação:** Critérios detalhados com base no feedback e exigências legais.
    * [x] **Validação com o Cliente:** Validado valor e necessidade legal com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Dependência de integração de biblioteca ICP-Brasil mapeada.
    * [x] **Estimabilidade:** Alta prioridade (PT=3.5), esforço técnico fatiado.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados cobrindo geração de hash e cifragem de prontuário em [blockchain.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/blockchain.test.js).
    * [x] **Revisão Colaborativa:** Lógica base revisada por pares.
    * [x] **Garantia de Qualidade (QA):** Verificação de fluxo e interface com certificado digital padrão concluída.
    * [x] **Conformidade de Escopo:** Integração completa realizada no frontend e backend.
    * [x] **Documentação:** Manual de operação e conformidade legal atualizados.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE5 → CP9 → RF08 → US08).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 9/10 com testes integrados em [blockchain.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/blockchain.test.js) e componentes de assinatura no frontend em [AssinaturaModal.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/components/AssinaturaModal.jsx).
    * **Validação (Cliente):** Validada com sucesso na Review final da Sprint 9/10 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um médico solicitando a exportação, **Quando** escolho baixar o prontuário, **Então** o sistema gera um arquivo PDF estruturado de acordo com o padrão clínico da clínica.
    * [x] **Dado que** sou um médico visualizando o prontuário exportado, **Quando** verifico as páginas do PDF, **Então** o sistema estampa o hash SHA-256 de integridade e a chancela da assinatura digital qualificada no rodapé.
    * [x] **Dado que** sou um médico exportando o PDF do prontuário, **Quando** a exportação é iniciada, **Então** o sistema realiza o processamento local do PDF através do navegador com a biblioteca frontend.

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
    * **Verificação (Equipe):** Verificado na Sprint 5 com testes de hash em [hashService.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/services/hashService.test.js) e renderizador em [pdfExportService.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/services/pdfExportService.js#L405).
    * **Validação (Cliente):** Validado na Review da Sprint 5 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um médico na tela de agenda, **Quando** acesso o calendário, **Então** o sistema exibe os compromissos em uma grade semanal com escala de segunda-feira a sábado.
    * [x] **Dado que** sou um médico gerenciando meus horários, **Quando** clico nos botões de navegação, **Então** o sistema alterna o calendário entre a semana atual, semanas anteriores e semanas posteriores.
    * [x] **Dado que** sou um médico olhando os blocos do calendário, **Quando** há consultas agendadas, **Então** o sistema renderiza o nome do paciente, horário de início e o status atual da consulta na célula correspondente.

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
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de frontend em [Agenda/index.test.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/Agenda/index.test.jsx) e componente de agenda em [Agenda/index.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/Agenda/index.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 8 pelo Dr. Rogério Duarte.

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

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um médico efetuando uma marcação, **Quando** tento agendar uma consulta para uma data e horário em que já há outro agendamento ativo, **Então** o sistema rejeita a operação devido ao conflito de horários.
    * [x] **Dado que** sou um médico na tela de agendamento, **Quando** crio uma consulta, **Então** o sistema permite selecionar se o atendimento será presencial ou por telemedicina (teleconsulta).
    * [x] **Dado que** sou um médico agendando um compromisso, **Quando** preencho o paciente, **Então** o sistema exige que ele seja selecionado de forma vinculada a partir da base de pacientes cadastrados.

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
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de backend em [consultas.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/consultas.test.js) e lógica em [consultas.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/src/controllers/consultas.js).
    * **Validação (Cliente):** Validado na Review da Sprint 8 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um médico na tela inicial do sistema, **Quando** faço login na dashboard, **Então** o sistema carrega automaticamente a listagem de consultas do dia atual.
    * [x] **Dado que** sou um médico visualizando as consultas do dia, **Quando** a lista é exibida, **Então** o sistema ordena os agendamentos cronologicamente a partir do horário de atendimento.
    * [x] **Dado que** sou um médico gerenciando o fluxo diário, **Quando** olho o grid de consultas, **Então** o sistema exibe os dados do paciente e o status de andamento (Agendado, Em atendimento, Finalizado).

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
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de integração em [consultas.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/consultas.test.js) e interface de painel em [PacientePanel.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/PacientePanel.jsx).
    * **Validação (Cliente):** Validado na Review da Sprint 8 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um usuário tentando alterar uma consulta, **Quando** tento modificar seu status, **Então** o sistema valida minhas permissões e recusa se eu não for o médico responsável ou uma secretária autorizada da clínica.
    * [x] **Dado que** sou um médico iniciando um atendimento, **Quando** altero o status da consulta para "Em atendimento", **Então** o sistema me redireciona automaticamente para a tela do prontuário clínico estruturado do paciente.
    * [x] **Dado que** sou um médico concluindo uma consulta, **Quando** mudo o status para "Finalizado", **Então** o sistema bloqueia novas alterações de status para esse agendamento.

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
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de backend em [consultas.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/consultas.test.js) e controle em [consultas.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/src/controllers/consultas.js).
    * **Validação (Cliente):** Validado na Review da Sprint 8 pelo Dr. Rogério Duarte.

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

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um médico gerando uma receita, **Quando** preencho a prescrição, **Então** o sistema exibe obrigatoriamente meu CRM no formato `CRM-UF` no topo do documento.
    * [x] **Dado que** sou um médico gerando uma receita, **Quando** o layout é montado, **Então** o sistema insere o cabeçalho estruturado com dados do consultório, do médico e dados de identificação do paciente.
    * [x] **Dado que** sou um médico redigindo a receita, **Quando** prescrevo os itens, **Então** o sistema exige o preenchimento detalhado do medicamento, da dosagem e das vias de administração.

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
    * **Verificação (Equipe):** Verificado na Sprint 9 com análise funcional de campos de prescrição em [Prescricao/index.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/Prescricao/index.jsx).
    * **Validação (Cliente):** Validado na Review/Planning da Sprint 9 pelo Dr. Rogério Duarte.

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

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um médico assinando a receita, **Quando** aciono a assinatura com certificado ICP-Brasil, **Então** o sistema estampa o carimbo/selo de assinatura eletrônica qualificada no rodapé do PDF gerado.
    * [x] **Dado que** sou um médico executando a assinatura da receita, **Quando** submeto o certificado, **Então** o sistema valida sua autenticidade e status ativo junto à ICP-Brasil.
    * [x] **Dado que** sou um médico com receita assinada digitalmente, **Quando** o processo é concluído, **Então** o sistema bloqueia qualquer modificação ou edição no corpo do documento de receita.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] **Estrutura INVEST:** História fatiada para a segurança de receita digital (INVEST).
    * [x] **Critérios de Aceitação:** Condições técnicas de chaves e validade de certificado descritas.
    * [x] **Validação com o Cliente:** Validada a necessidade legal com o Dr. Rogério Duarte.
    * [x] **Dependências e Riscos:** Depende da infraestrutura integrada com certificados qualificados.
    * [x] **Estimabilidade:** Priorizado no backlog da Sprint 9 (PT=3.0).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] **Validação Técnica e Testes:** Testes automatizados de criptografia e validade jurídica de receitas em [receitas.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/receitas.test.js).
    * [x] **Revisão Colaborativa:** PR aprovado por pares e integrado no CI/CD.
    * [x] **Garantia de Qualidade (QA):** Usabilidade com certificados verificada de forma responsiva.
    * [x] **Conformidade de Escopo:** Selo de assinatura ativo e chancelas visíveis no PDF.
    * [x] **Documentação:** Documentação legal e técnica atualizada nos guias do desenvolvedor.
    * [x] **Rastreabilidade:** Mapeada a cadeia de valor (OE5 → CP9 → RF15 → US15).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 9/10 com testes de assinatura de receitas no controlador e interface de assinatura eletrônica qualificada.
    * **Validação (Cliente):** Validada na Review final da Sprint 9/10 pelo Dr. Rogério Duarte.

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

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um médico solicitando a emissão, **Quando** exporto a receita para PDF, **Então** o sistema gera um arquivo estruturado compatível com o tamanho padrão A4.
    * [x] **Dado que** sou um médico baixando a receita, **Quando** clico em exportar, **Então** o navegador inicia automaticamente o download do arquivo PDF.
    * [x] **Dado que** sou um médico visualizando o PDF gerado da receita, **Quando** o arquivo é aberto, **Então** ele exibe o carimbo da chancela visual de assinatura eletrônica qualificada no rodapé.

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
    * **Verificação (Equipe):** Verificado na Sprint 9 através do exportador local integrado de prescrições em [Prescricao/index.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/Prescricao/index.jsx).
    * **Validação (Cliente):** Validada na Review da Sprint 9 pelo Dr. Rogério Duarte.

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
    * [ ] **Dado que** sou um médico prescrevendo medicamentos, **Quando** insiro os itens clínicos no formulário, **Então** o sistema realiza chamadas assíncronas para a API de IA farmacológica sem travar a interface.
    * [ ] **Dado que** sou um médico prescrevendo múltiplos medicamentos, **Quando** há alguma incompatibilidade medicamentosa grave, **Então** o sistema exibe alertas visuais em destaque na tela de prescrição.

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
??? success "US18 — Histórico de Receitas do Paciente (Sprint 9)"

    * **Identificador:** [US18 / RF18](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como médico, eu quero manter um log visível de todas as receitas anteriormente prescritas ao paciente, para consultar o histórico de tratamentos ao longo do tempo."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um médico acessando o prontuário, **Quando** abro a aba de histórico de receitas, **Então** o sistema lê todas as receitas cadastradas a partir do banco de dados local IndexedDB.
    * [x] **Dado que** sou um médico visualizando a aba de receitas, **Quando** a lista é exibida, **Então** o sistema exibe as prescrições organizadas em ordem cronológica de emissão.
    * [x] **Dado que** sou um médico consultando o histórico de receitas, **Quando** clico em uma receita antiga, **Então** o sistema permite a visualização detalhada de seus dados e a re-emissão de seu PDF.

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
    * **Verificação (Equipe):** Verificado na Sprint 9 com teste de leitura IndexedDB local e visualização na aba de detalhes em [PacienteDetalhe/index.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/PacienteDetalhe/index.jsx).
    * **Validação (Cliente):** Validada na Review da Sprint 9 pelo Dr. Rogério Duarte.

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
    * [ ] **Dado que** sou um médico agendando um procedimento, **Quando** solicito a criação do termo de consentimento, **Então** o sistema gera o texto do TCLE estruturado com os dados de identificação do paciente.
    * [ ] **Dado que** sou um médico e paciente na sessão clínica, **Quando** assinamos o documento digitalmente, **Então** o sistema gera a trilha de chaves de assinatura conjunta do médico e aceite do paciente.

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
??? success "US20 — Cadastrar Médicos (Sprint 3)"

    * **Identificador:** [US20 / RF20](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Declaração INVEST
    > "Como administrador, eu quero cadastrar novos perfis de acesso de médicos, para registrar novos profissionais no sistema."

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um usuário no painel administrativo, **Quando** tento cadastrar um perfil médico, **Então** o sistema verifica minhas permissões e recusa se meu perfil não for Administrador.
    * [x] **Dado que** sou um administrador cadastrando um médico, **Quando** insiro os dados, **Então** o sistema exige obrigatoriamente o CRM no formato `CRM-UF`.
    * [x] **Dado que** sou um administrador salvando o cadastro de médico, **Quando** confirmo o formulário, **Então** o sistema valida o CPF e CRM do profissional impedindo duplicidades na base de dados.

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
    * **Verificação (Equipe):** Verificado na Sprint 3 com testes de backend em [medicos.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/medicos.test.js) e rotas administrativas no backend.
    * **Validação (Cliente):** Validado na Review da Sprint 3 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um usuário no sistema, **Quando** tento editar as informações de um perfil médico, **Então** o sistema valida minhas credenciais e impede o acesso se eu não for Administrador.
    * [x] **Dado que** sou um administrador editando o cadastro de médico, **Quando** altero as informações, **Então** o sistema exige o formato obrigatório `CRM-UF` para o registro de conselho de classe.
    * [x] **Dado que** sou um administrador salvando as alterações de perfil médico, **Quando** a edição é concluída, **Então** o sistema grava os logs de mutação cadastral na trilha de auditoria.

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
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [medicos.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/medicos.test.js) e métodos de controle em [medicos.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/src/controllers/medicos.js).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um administrador removendo um profissional, **Quando** inativo o perfil de um médico, **Então** o sistema realiza a inativação lógica do registro no banco de dados sem deletar fisicamente.
    * [x] **Dado que** sou um médico com perfil inativado pelo administrador, **Quando** tento efetuar login no sistema, **Então** o sistema bloqueia meu acesso de imediato.
    * [x] **Dado que** sou um usuário sem perfil administrador, **Quando** tento inativar a conta de um médico, **Então** o sistema recusa e bloqueia a operação.

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
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [medicos.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/medicos.test.js) e lógica em [medicos.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/src/controllers/medicos.js).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um administrador no painel de busca de profissionais, **Quando** filtro por nome ou número de conselho (CRM), **Então** o sistema exibe a lista de médicos cadastrados correspondentes.
    * [x] **Dado que** sou um usuário comum do consultório, **Quando** tento buscar perfis médicos de forma administrativa, **Então** o sistema recusa o acesso de busca por restrição de perfil.
    * [x] **Dado que** sou um administrador visualizando o grid de busca médica, **Quando** os resultados são carregados, **Então** o sistema exibe de forma destacada o status ativo/inativo de cada profissional listado.

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
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de backend em [medicos.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/medicos.test.js) e lógica em [medicos.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/src/controllers/medicos.js).
    * **Validação (Cliente):** Validado na Review da Sprint 1 pelo Dr. Rogério Duarte.

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

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um administrador visualizando logs de auditoria, **Quando** o sistema exibe o histórico, **Então** todas as informações clínicas confidenciais e CPFs de pacientes aparecem mascarados, exibindo apenas metadados técnicos de acesso.
    * [x] **Dado que** sou um usuário consultando os logs de auditoria, **Quando** realizo buscas e aplico filtros por data/timestamp, usuário ou tipo de mutação, **Então** o sistema retorna os logs correspondentes.
    * [x] **Dado que** sou um médico ou auditor consultando a trilha, **Quando** o sistema grava os logs de auditoria, **Então** ele gera hashes criptográficos associados para provar a integridade da trilha de logs de mutação de dados.

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
    * **Verificação (Equipe):** Verificado na Sprint 5 com testes de logs de backend em [logs.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/logs.test.js) e lógica em [auditoria.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/src/helpers/auditoria.js).
    * **Validação (Cliente):** Validada na Review da Sprint 5 pelo Dr. Rogério Duarte.

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
    * [x] **Dado que** sou um usuário realizando operações cadastrais ou clínicas, **Quando** insiro, edito ou excluo registros, **Então** o sistema grava automaticamente um registro contendo timestamp, ID do usuário, tipo de alteração e hash SHA-256 do estado anterior e atual.
    * [x] **Dado que** sou um médico visualizando o histórico do paciente, **Quando** acesso o prontuário, **Então** o sistema integra os logs no frontend permitindo verificar visualmente a integridade da blockchain.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Critérios de integridade definidos de forma clara.
    * [x] Validação jurídica das regras de rastreabilidade (LGPD).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Cobertura de testes unitários/integração implementada.
    * [x] Código revisado por pares no repositório.
    * [x] Interface de logs de integridade validada no frontend.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 7 com testes automatizados em [logs.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/logs.test.js) e [blockchain.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/blockchain.test.js).
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
    * [x] **Dado que** sou um usuário criando ou alterando credenciais, **Quando** digito minha senha, **Então** o sistema a armazena aplicando o algoritmo bcrypt com salt e fator de custo seguro.
    * [x] **Dado que** sou um usuário trafegando dados, **強 Quando** a senha de acesso é enviada ou salva, **Então** o sistema garante que ela nunca seja exibida ou transmitida em texto legível.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Biblioteca de criptografia e fator de segurança de chaves definidos.
    * [x] Validação de regras de acesso (RBAC).

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes de autenticação e criptografia passando.
    * [x] Código revisado e integrado no pipeline.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 8 com testes de autenticação em [auth.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/tests/auth.test.js).
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
    * [x] **Dado que** sou um médico atendendo em local sem internet, **Quando** acesso o prontuário eletrônico do paciente, **Então** o sistema permite a leitura e inserção de dados localmente de forma ininterrupta.
    * [x] **Dado que** sou um usuário operando o ProntoCare, **Quando** o estado de conectividade muda, **Então** o sistema exibe na tela um indicador visual claro (barra de status) com o estado de rede e sincronização.
    * [x] **Dado que** sou um médico inserindo dados em modo desconectado, **Quando** salvo o prontuário, **Então** o sistema realiza atualizações otimistas na tela e salva temporariamente os registros na fila local do IndexedDB.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Arquitetura offline-first e persistência IndexedDB documentadas.
    * [x] Validação prévia de usabilidade domiciliar síncrona/assíncrona.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes de simulação de queda de internet passando (Vitest).
    * [x] Verificação visual e responsiva da UI offline realizada pela equipe de QA.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 6 com testes em [offlineService.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/services/offlineService.test.js) (15 testes passando) e serviço [offlineService.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/services/offlineService.js).
    * **Validação (Cliente):** Validada na Review da Sprint 6 pelo Dr. Rogério Duarte.

    #### :material-comment-text-multiple-outline: Consolidação do Feedback
    * **Feedback do Cliente:** Exportação atende. Para o modo offline, solicitou indicador visual explícito do estado de rede e sincronização.
    * **Decisão:** Aprovado com ressalvas (Sprint 5) / Aprovado (Sprint 6).
    * **Ajuste Realizado:** Implementado o componente de barra de status `OfflineStatusBar` em [OfflineStatusBar.jsx](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/components/OfflineStatusBar.jsx) e opção de backup/exportação manual na barra.

    [:material-arrow-up-circle-outline: Voltar para a tabela](#ref-rnf03)

<span id="rnf04"></span>
??? success "RNF04 — Sincronização e Backup Diário (Sprint 6)"

    * **Identificador:** [RNF04](backlog-de-produto.md)
    * **Status:** Concluído :material-check-decagram:

    #### :material-lightbulb-outline: Descrição
    > O sistema deve possuir uma rotina automática que realiza o backup diário dos dados para a nuvem quando houver conexão.

    #### :material-scale-balance: Critérios de Aceitação (Gherkin)
    * [x] **Dado que** sou um médico com dados pendentes de sincronização, **Quando** a conexão com a internet é restabelecida, **Então** o sistema executa automaticamente a sincronização da fila IndexedDB em segundo plano com o servidor.
    * [x] **Dado que** sou um médico com dados em sincronização, **Quando** ocorrem falhas temporárias de rede, **Então** o sistema retenta a transmissão silenciosamente em segundo plano sem disparar popups invasivos de erro.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Regras de resolução de conflitos e sincronização especificadas.
    * [x] Frequência e processos de retentativa definidos.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Código de service workers testado em ambiente local.
    * [x] Revisão da fila de sincronização pelo time de QA.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 6 com o analisador de sincronização em [offlineService.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/services/offlineService.js#L258-L317).
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
    * [x] **Dado que** sou um médico com prontuário assinado eletronicamente, **Quando** tento alterar ou retificar dados desse prontuário, **Então** o sistema impede a edição direta e exige a criação de uma nova versão vinculada (histórico).
    * [x] **Dado que** sou um médico necessitando do arquivamento legal, **Quando** exporto prontuários ou backups, **Então** o sistema gera arquivos estruturados de longo prazo suportando a norma de guarda por 20 anos.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Mapeamento dos requisitos do NGS da SBIS efetuado.
    * [x] Validação das regras éticas clínicas com o Dr. Rogério Duarte.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes de logs de acesso e integridade do blockchain validados.
    * [x] Documentação de compliance finalizada.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 8 com análise de logs de acesso de prontuários em [pacientes.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/back/src/controllers/pacientes.js#L59) e gravação de chaves/integridade do blockchain.
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
    * [x] **Dado que** sou um profissional de saúde acessando o ProntoCare de um celular, tablet ou desktop, **Quando** redimensiono o navegador ou alterno entre dispositivos, **Então** o layout se reorganiza responsivamente sem cortar elements ou quebrar textos.
    * [x] **Dado que** sou um médico visualizando prontuários ou agendas, **Quando** acesso o painel em telas menores, **Então** o sistema oculta menus laterais em um menu hambúrguer para otimizar a área útil de leitura.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Grade responsiva e breakpoints de CSS definidos no Design System.
    * [x] Validação prévia de wireframes móveis com o cliente.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes visuais manuais e automatizados de responsividade concluídos.
    * [x] Layout verificado em viewports mobile (360px), tablet (768px) e desktop (1024px+).

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 1 com testes de viewports no frontend e CSS customizado em [App.css](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/App.css#L67), [Panel.css](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/Panel.css#L763), [styles.css](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/PacienteDetalhe/styles.css#L901) e [styles.css](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/pages/Register/styles.css#L188).
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
    * [x] **Dado que** sou um médico exportando um prontuário clínico, **Quando** solicito a geração do PDF, **Então** o sistema computa localmente o hash SHA-256 do arquivo através da Web Crypto API do navegador.
    * [x] **Dado que** sou um médico abrindo o PDF exportado, **Quando** visualizo a página gerada, **Então** o sistema estampa o hash de integridade de forma legível no rodapé (footer) do documento.
    * [x] **Dado que** sou um médico concluindo a exportação, **Quando** o PDF do prontuário é gerado, **Então** o sistema registra o hash correspondente na blockchain de integridade para fins de auditabilidade.

    #### :material-clipboard-check-outline: Definition of Ready (DoR)
    * [x] Biblioteca de criptografia nativa (Web Crypto API) mapeada.
    * [x] Design de layout do PDF definido.

    #### :material-school-outline: Definition of Done (DoD)
    * [x] Testes unitários do gerador de hash SHA-256 passando.
    * [x] Carimbo visual de integridade verificado pela equipe de QA.

    #### :material-shield-check-outline: Rastreabilidade, Verificação e Validação
    * **Verificação (Equipe):** Verificado na Sprint 5 com testes de hash em [hashService.test.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/services/hashService.js) e renderizador em [pdfExportService.js](file:///home/eduradolm/Documents/REQ-2026.1-T01-ProntoCare/front/src/services/pdfExportService.js#L405).
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
    * [x] **Dado que** sou um médico efetuando assinaturas válidas, **Quando** assino digitalmente uma receita ou prontuário, **Então** o sistema exige e valida o uso de certificados digitais do padrão ICP-Brasil (A3/PSC).
    * [x] **Dado que** sou um médico concluindo uma assinatura, **Quando** o certificado é validado e aplicado ao documento, **Então** o sistema sela as chaves e impede qualquer alteração posterior no conteúdo assinado.

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

