# Requisitos de Software

## **8 Requisitos de software**

Esta lista de requisitos foi elaborada a partir de um processo colaborativo e estruturado de construção do backlog, conduzido pela equipe ao longo da Sprint 0. Diferente de abordagens que focam apenas na listagem de funcionalidades, o processo investiu na compreensão profunda do problema a ser resolvido e das necessidades reais do usuário, garantindo que cada item do backlog contribua diretamente para a entrega de valor. No contexto do ProntoCare, a equipe utilizou um **quadro colaborativo no Figma (FigmaBoard)** como artefato central de organização — um painel visual que conecta os Objetivos Específicos (OEs) do produto às Características do Produto (CPs), e destas aos requisitos funcionais e não funcionais, user stories e critérios de aceitação. Essa cadeia de rastreabilidade (OE → CP → RF/RNF → US → critério de aceitação) assegura que nenhum requisito exista de forma isolada: cada funcionalidade listada abaixo pode ser rastreada até um objetivo de negócio concreto, validado junto ao Dr. Rogério durante as sessões de elicitação e priorização.

A elicitação dos requisitos combinou múltiplas técnicas — entrevistas estruturadas com o cliente, brainstorming com a equipe, análise do domínio clínico (fluxo SOAP, protocolos do eSUS PEC, normas do CFM) e priorização MoSCoW com participação direta do stakeholder principal — para garantir que o backlog reflita tanto as necessidades operacionais reais do consultório quanto as restrições regulatórias e de segurança inerentes ao tratamento de dados clínicos sensíveis. Os requisitos foram então organizados em dois grupos complementares: **requisitos funcionais (RFs)**, que descrevem as capacidades e comportamentos que o sistema deve oferecer, e **requisitos não funcionais (RNFs)**, que estabelecem os atributos de qualidade, segurança, desempenho e conformidade que condicionam a operação do sistema. A seção 8.3 apresenta a **Matriz Síntese de Rastreabilidade**, que mapeia explicitamente a relação entre cada objetivo específico, característica do produto e requisito, permitindo verificar a cobertura completa do escopo e a consistência do backlog.


### **8.1 Requisitos Funcionais**
Os requisitos funcionais descrevem as ações, comportamentos e informações que o sistema deve fornecer em resposta a entradas específicas.

| Identificador | Descrição |
| :--- | :--- |
| **RF01** | **Cadastrar pacientes:** O sistema deve permitir o registro de novos pacientes com seus dados cadastrais básicos. |
| **RF02** | **Editar registros de pacientes:** O sistema deve permitir a atualização de dados de registros de pacientes. |
| **RF03** | **Excluir registros de pacientes:** O sistema deve permitir a exclusão (ou inativação lógica) de registros de pacientes. |
| **RF04** | **Buscar pacientes:** O sistema deve fornecer uma listagem de pacientes com filtros de busca (ex: nome, CPF). |
| **RF05** | **Exportar base de dados dos usuários:** O sistema deve permitir a exportação completa da base de dados dos pacientes em formato JSON. |
| **RF06** | **Criar prontuário estruturado SOAP:** O sistema deve permitir a criação de prontuários com campos estruturados para preenchimento. |
| **RF07** | **Registrar anamnese:** O sistema deve possuir uma área de texto livre para o registro detalhado da anamnese. |
| **RF08** | **Anexar documentos ao prontuário:** O sistema deve permitir o upload e a anexação de arquivos (ex: exames em PDF/imagem) à anamnese. |
| **RF09** | **Exibir histórico clínico:** O sistema deve exibir uma linha do tempo cronológica com todo o histórico clínico do paciente. |
| **RF10** | **Assinar digitalmente o prontuário:** O sistema deve permitir que o médico assine digitalmente o prontuário médico utilizando um certificado padrão ICP-Brasil. |
| **RF11** | **Exportar prontuário:** O sistema deve permitir a geração de um arquivo PDF contendo o prontuário completo. |
| **RF12** | **Exibir calendário semanal de consultas:** O sistema deve exibir uma interface de calendário detalhando a semana de consultas. |
| **RF13** | **Agendar consultas e/ou teleconsultas:** O sistema deve permitir o agendamento de novas consultas, vinculando paciente, data e horário. |
| **RF14** | **Gerenciar consultas do dia e seus status:** O sistema deve listar as consultas do dia atual, permitindo alterar o status (ex: Agendado, Em atendimento, Finalizado). |
| **RF15** | **Elaborar receita digital:** O sistema deve permitir a elaboração de receitas médicas digitais. |
| **RF16** | **Assinar digitalmente a receita:** O sistema deve permitir que o médico assine digitalmente a receita médica e o termo de consentimento utilizando um certificado padrão ICP-Brasil. |
| **RF17** | **Emitir receita digital:** O sistema deve permitir salvar a receita gerada em formato PDF para impressão ou envio. |
| **RF18** | **Analisar interações medicamentosas por IA:** O sistema deve permitir analisar a prescrição do medicamento em tempo real, utilizando inteligência artificial para consultar bases farmacológicas (ex: dados da ANVISA). |
| **RF19** | **Manter histórico de prescrições do paciente:** O sistema deve manter um log visível de todas as receitas anteriormente prescritas ao paciente. |
| **RF20** | **Gerar e assinar Termo de Consentimento (TCLE):** O sistema deve gerar o Termo de Consentimento (TCLE), permitindo a assinatura digital ICP-Brasil pelo médico e o registro de aceite do paciente antes do atendimento. |
| **RF21** | **Gerenciar perfis de médicos:** O sistema deve permitir que usuários com perfil de administrador realizem a edição completa dos perfis de acesso de médicos do sistema. |
| **RF22** | **Gerenciar perfis de pacientes:** O sistema deve permitir que usuários com perfil de administrador realizem a edição completa dos perfis de acesso de pacientes do sistema. |
| **RF23** | **Consultar logs de auditoria:** O sistema deve fornecer uma interface que permita ao médico visualizar, buscar e filtrar o histórico de todas as operações realizadas sobre dados sensíveis (incluindo identificação do usuário, timestamp, registro acessado e tipo de ação executada). |

### **8.2 Requisitos Não Funcionais**

Os requisitos não funcionais especificam critérios que determinam a operação e restrições de segurança, desempenho, usabilidade e arquitetura do sistema.

| Identificador | Categoria / Descrição |
| :--- | :--- |
| **RNF01** | **Segurança:** O sistema deve registrar um log rastreável com hashing em todas as ações de criação, edição e exclusão feitas pelos usuários. |
| **RNF02** | **Segurança:** As senhas e demais dados sensíveis de saúde devem ser armazenados de forma criptografada no banco de dados usando `bcrypt`. |
| **RNF03** | **Usabilidade:** O sistema deve ser capaz de operar localmente e salvar dados mesmo sem conexão com a internet (backup offline). |
| **RNF04** | **Usabilidade:** O sistema deve possuir uma rotina automática que realiza o backup diário dos dados para a nuvem quando houver conexão. |
| **RNF05** | **Segurança:** O sistema deve estar em conformidade com as resoluções do CFM, garantindo que seus módulos cumpram os requisitos do NGS exigidos para a certificação da SBIS. |
| **RNF06** | **Usabilidade:** A interface da aplicação deve se adaptar perfeitamente a diferentes tamanhos de tela (computadores, tablets e smartphones). |
| **RNF07** | **Desempenho:** As requisições para a Inteligência Artificial devem ocorrer de forma assíncrona para não travar a interface de prescrição do usuário. |
| **RNF08** | **Segurança:** O sistema deve gerar um hash de integridade SHA-256 para cada prontuário exportado em PDF, processado do lado do cliente através da Web Crypto API. |


## **8.3 Matriz Síntese de Rastreabilidade**

| Contribuição principal | Contribuição secundária | CP | VN | RFs relacionados | RNFs relacionados |
| :---: | :---: | :---: | :---: | :---: | :---: |
| OE1 | OE2, OE3 | CP1 | VN1 | RF05, RF06, RF07, RF08, RF15 | \- |
| OE4 | OE1 | CP2 | VN2 | RF01, RF02, RF03, RF04, RF11, RF12, RF13, RF19 | RNF06 |
| OE2 | OE5 | CP3 | VN3 | RF17 | RNF07 |
| OE3 | OE5 | CP4 | VN4 | RF09 | RNF08 |
| OE4 | OE3 | CP5 | VN5 | \- | RNF03, RNF04 |
| OE3 | OE1 | CP6 | VN6 | RF21, RF22 | RNF02 |
| OE3 | OE2 | CP7 | VN7 | RF23 | RNF01 |
| OE3 | OE5 | CP8 | VN8 | RF20 | RNF05 |
| OE5 | OE1, OE2 | CP9 | VN9 | RF10,RF14,RF16, RF18 | \- |

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-05-18 | 0.1 | Elaboração e revisão da lista de requisitos funcionais, não funcionais e Matriz Síntese de Rastreabilidade. | Prontuariantes |

