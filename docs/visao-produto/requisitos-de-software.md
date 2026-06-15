# Requisitos de Software

## **8 Requisitos de software**

Esta lista de requisitos foi elaborada a partir de um processo colaborativo e estruturado de construção do backlog, conduzido pela equipe ao longo da Sprint 0. Diferente de abordagens que focam apenas na listagem de funcionalidades, o processo investiu na compreensão profunda do problema a ser resolvido e das necessidades reais do usuário, garantindo que cada item do backlog contribua diretamente para a entrega de valor. No contexto do ProntoCare, a equipe utilizou um **quadro colaborativo no Figma (FigmaBoard)** como artefato central de organização — um painel visual que conecta os Objetivos Específicos (OEs) do produto às Características do Produto (CPs), e destas aos requisitos funcionais e não funcionais, user stories e critérios de aceitação. Essa cadeia de rastreabilidade (OE → CP → RF/RNF → US → critério de aceitação) assegura que nenhum requisito exista de forma isolada: cada funcionalidade listada abaixo pode ser rastreada até um objetivo de negócio concreto, validado junto ao Dr. Rogério durante as sessões de elicitação e priorização.

A elicitação dos requisitos combinou múltiplas técnicas — entrevistas estruturadas com o cliente, brainstorming com a equipe, análise do domínio clínico (fluxo SOAP, protocolos do eSUS PEC, normas do CFM) e priorização MoSCoW com participação direta do stakeholder principal — para garantir que o backlog reflita tanto as necessidades operacionais reais do consultório quanto as restrições regulatórias e de segurança inerentes ao tratamento de dados clínicos sensíveis. Os requisitos foram então organizados em dois grupos complementares: **requisitos funcionais (RFs)**, que descrevem as capacidades e comportamentos que o sistema deve oferecer, e **requisitos não funcionais (RNFs)**, que estabelecem os atributos de qualidade, segurança, desempenho e conformidade que condicionam a operação do sistema. A seção 8.3 apresenta a **Matriz Síntese de Rastreabilidade**, que mapeia explicitamente a relação entre cada objetivo específico, característica do produto e requisito, permitindo verificar a cobertura completa do escopo e a consistência do backlog.

#### **Matriz de Rastreabilidade**

![](../../assets/visao-produto/matriz-de-rastreabilidade.png)

##### **Visualização disponivel no Figma JamBoard do projeto**

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/board/0vnXsFutjGoQcCT6oQQ2lX/Prontuariantes?node-id=0-1&embed-host=share" allowfullscreen></iframe>

> :octicons-link-external-16: Você também pode visualizar o board em tela cheia diretamente no Figma clicando [aqui](https://www.figma.com/board/0vnXsFutjGoQcCT6oQQ2lX/Prontuariantes?node-id=0-1&t=7WDzylophLcdH6TL-1).


### **8.1 Requisitos Funcionais**
Os requisitos funcionais descrevem as ações, comportamentos e informações que o sistema deve fornecer em resposta a entradas específicas.

| Identificador | Descrição |
| :--- | :--- |
| **RF01** | **Cadastrar pacientes:** O sistema deve permitir o registro de novos pacientes com seus dados cadastrais básicos e credenciais de acesso ao sistema (perfil do paciente). |
| **RF02** | **Editar registros de pacientes:** O sistema deve permitir a atualização de dados cadastrais e credenciais de acesso de registros de pacientes. |
| **RF03** | **Excluir registros de pacientes:** O sistema deve permitir a exclusão (ou inativação lógica) de registros de pacientes, revogando também seu acesso ao sistema. |
| **RF04** | **Buscar pacientes:** O sistema deve fornecer uma listagem de pacientes e seus perfis com filtros de busca (ex: nome, CPF, status de acesso). |
| **RF05** | **Exportar base de dados dos usuários:** O sistema deve permitir a exportação completa da base de dados dos pacientes em formato JSON. |
| **RF06** | **Registrar prontuário estruturado SOAP no histórico clínico:** O sistema deve permitir o registro de atendimentos contendo campos estruturados no padrão SOAP (Subjetivo, Objetivo, Avaliação, Plano), incluindo uma área de texto livre para a anamnese e a anexação de documentos (ex: exames em PDF/imagem), integrando essas informações ao histórico clínico do paciente. |
| **RF07** | **Exibir histórico clínico:** O sistema deve exibir uma linha do tempo cronológica com todo o histórico clínico do paciente. |
| **RF08** | **Assinar digitalmente o prontuário:** O sistema deve permitir que o médico assine digitalmente o prontuário médico utilizando um certificado padrão ICP-Brasil. |
| **RF09** | **Exportar prontuário:** O sistema deve permitir a geração de um arquivo PDF contendo o prontuário completo. |
| **RF10** | **Exibir calendário semanal de consultas:** O sistema deve exibir uma interface de calendário detalhando a semana de consultas. |
| **RF11** | **Agendar consultas e/ou teleconsultas:** O sistema deve permitir o agendamento de novas consultas, vinculando paciente, data e horário. |
| **RF12** | **Listar consultas do dia:** O sistema deve listar as consultas agendadas para o dia atual. |
| **RF13** | **Alterar status de consultas do dia:** O sistema deve permitir a alteração do status de uma consulta do dia atual (ex: Agendado, Em atendimento, Finalizado). |
| **RF14** | **Elaborar receita digital:** O sistema deve permitir a elaboração de receitas médicas digitais. |
| **RF15** | **Assinar digitalmente a receita:** O sistema deve permitir que o médico assine digitalmente a receita médica e o termo de consentimento utilizando um certificado padrão ICP-Brasil. |
| **RF16** | **Emitir receita digital:** O sistema deve permitir salvar a receita gerada em formato PDF para impressão ou envio. |
| **RF17** | **Analisar interações medicamentosas por IA:** O sistema deve permitir analisar a prescrição do medicamento em tempo real, utilizando inteligência artificial para consultar bases farmacológicas (ex: dados da ANVISA). |
| **RF18** | **Manter histórico de prescrições do paciente:** O sistema deve manter um log visível de todas as receitas anteriormente prescritas ao paciente. |
| **RF19** | **Gerar e assinar Termo de Consentimento (TCLE):** O sistema deve gerar o Termo de Consentimento (TCLE), permitindo a assinatura digital ICP-Brasil pelo médico e o registro de aceite do paciente antes do atendimento. |
| **RF20** | **Cadastrar perfis de médicos:** O sistema deve permitir que usuários com perfil de administrador realizem o cadastro de novos perfis de acesso de médicos do sistema. |
| **RF21** | **Editar perfis de médicos:** O sistema deve permitir que usuários com perfil de administrador realizem a edição de perfis de acesso de médicos do sistema. |
| **RF22** | **Inativar perfis de médicos:** O sistema deve permitir que usuários com perfil de administrador realizem a inativação lógica de perfis de acesso de médicos do sistema. |
| **RF23** | **Buscar perfis de médicos:** O sistema deve permitir que usuários com perfil de administrador realizem a busca e listagem de perfis de acesso de médicos do sistema. |
| **RF24** | **Consultar logs de auditoria:** O sistema deve fornecer uma interface que permita ao médico visualizar, buscar e filtrar o histórico de todas as operações realizadas sobre dados sensíveis (incluindo identificação do usuário, timestamp, registro acessado e tipo de ação executada). |

### **8.2 Requisitos Não Funcionais**

Os requisitos não funcionais especificam critérios que determinam a operação e restrições de segurança, desempenho, usabilidade e arquitetura do sistema.

| Identificador | Categoria / Descrição | Escopo / Justificativa |
| :--- | :--- | :--- |
| **RNF01** | **Segurança:** O sistema deve registrar um log rastreável com hashing em todas as ações de criação, edição e exclusão feitas pelos usuários. | **Específico (Mutação de Dados):** Vinculado estritamente a requisitos que realizam inserção, modificação ou remoção de dados cadastrais, clínicos ou de acesso de usuários para garantir auditabilidade. |
| **RNF02** | **Segurança:** As senhas e demais dados sensíveis de saúde devem ser armazenados de forma criptografada no banco de dados usando `bcrypt`. | **Específico (Segurança de Acesso):** Aplicado aos requisitos de gerenciamento de credenciais e contas de acesso de médicos e pacientes. |
| **RNF03** | **Usabilidade:** O sistema deve ser capaz de operar localmente e salvar dados mesmo sem conexão com a internet (backup offline). | **Global (Arquitetura):** Aplica-se sistemicamente a toda a aplicação frontend (PWA/Dexie.js), dispensando mapeamento individual em cada funcionalidade. |
| **RNF04** | **Usabilidade:** O sistema deve possuir uma rotina automática que realiza o backup diário dos dados para a nuvem quando houver conexão. | **Global (Infraestrutura):** Rotina interna automatizada de sincronização em segundo plano que opera independente da interação direta do usuário com funções específicas. |
| **RNF05** | **Segurança:** O sistema deve estar em conformidade com as resoluções do CFM, garantindo que seus módulos cumpram os requisitos do NGS exigidos para a certificação da SBIS. | **Específico (Conformidade Clínica):** Restrito às funcionalidades que lidam com prontuários, receitas digitais e termos de consentimento médico de valor legal. |
| **RNF06** | **Usabilidade:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo, sem perda de conteúdo, quebra de elementos ou exibição de barra de rolagem horizontal. | **Global (Interface/UX):** Padrão de design responsivo aplicável de forma uniforme a todas as telas e componentes visuais do sistema. |
| **RNF07** | **Desempenho:** As requisições para a Inteligência Artificial devem ocorrer de forma assíncrona para não travar a interface de prescrição do usuário. | **Específico (Desempenho IA):** Vinculado especificamente ao recurso de análise de interações medicamentosas por IA (RF17) para evitar gargalos na interface. |
| **RNF08** | **Segurança:** O sistema deve gerar um hash de integridade SHA-256 para cada prontuário exportado em PDF, processado do lado do cliente através da Web Crypto API. | **Específico (Integridade de Exportação):** Vinculado exclusivamente ao requisito de geração de PDF do prontuário (RF09) para atestar que o arquivo exportado não foi adulterado. |


## **8.3 Matriz Síntese de Rastreabilidade**

<div class="rastreabilidade-table-container" markdown="1">

| Contribuição principal | Contribuição secundária | CP | VN | RFs relacionados | RNFs relacionados |
| :---: | :---: | :---: | :---: | :---: | :---: |
| OE1 | OE2, OE3 | CP1 | VN1 | RF05, RF06, RF14 | \- |
| OE4 | OE1 | CP2 | VN2 | RF01, RF02, RF03, RF04, RF09, RF10, RF11, RF18 | RNF06 |
| OE2 | OE5 | CP3 | VN3 | RF16 | RNF07 |
| OE3 | OE5 | CP4 | VN4 | RF07 | RNF08 |
| OE4 | OE3 | CP5 | VN5 | \- | RNF03, RNF04 |
| OE3 | OE1 | CP6 | VN6 | RF20, RF21, RF22, RF23 | RNF02 |
| OE3 | OE2 | CP7 | VN7 | RF24 | RNF01 |
| OE3 | OE5 | CP8 | VN8 | RF19 | RNF05 |
| OE5 | OE1, OE2 | CP9 | VN9 | RF08, RF12, RF13, RF15, RF17 | \- |

</div>

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-05-18 | 0.1 | Elaboração e revisão da lista de requisitos funcionais, não funcionais e Matriz Síntese de Rastreabilidade. | Prontuariantes |
| 2026-06-13 | 0.2 | Decomposição dos requisitos agregados de consultas e perfis para garantir consistência de abstração. | Prontuariantes |
| 2026-06-13 | 0.3 | Fusão dos requisitos de prontuário, anamnese e anexos em RF06 integrados ao histórico clínico para conformidade do domínio. | Prontuariantes |
| 2026-06-13 | 0.4 | Refinamento dos vínculos RNF ↔ RF na matriz, definindo escopo e justificativas para RNFs globais e específicos. | Prontuariantes |
| 2026-06-13 | 0.5 | Unificação dos requisitos funcionais de cadastro e perfil de acesso de pacientes (RF01-RF04 com RF24-RF27), e reordenação dos logs de auditoria para RF24. | Prontuariantes |

