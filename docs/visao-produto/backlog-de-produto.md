## **10 Backlog**

Esta seção apresenta o **Backlog de Produto** do ProntoCare, construído como resultado direto do processo colaborativo de organização do backlog conduzido pela equipe durante a Sprint 0 e descrito na seção 8. O backlog constitui a lista priorizada e continuamente refinada de todas as funcionalidades, melhorias e entregas planejadas para o sistema, traduzindo os requisitos funcionais e não funcionais em **User Stories** acionáveis pela equipe de desenvolvimento. Cada user story foi derivada a partir da cadeia de rastreabilidade do projeto (OE → CP → RF → US), estruturada no **quadro colaborativo do Figma (FigmaBoard)**, garantindo que toda funcionalidade planejada esteja ancorada em um objetivo de negócio concreto e em uma necessidade validada pelo Dr. Rogério durante as sessões de elicitação e grooming. A estrutura do backlog reflete a natureza iterativa e incremental do ScrumXP: os itens são detalhados progressivamente ao longo das sprints, e sua priorização é reavaliada a cada ciclo com base no valor clínico, na complexidade técnica e no feedback do cliente. A seção 10.1 apresenta o backlog geral com todas as user stories e seus RNFs relacionados, enquanto a seção 10.2 detalha o modelo quantitativo de priorização adotado para orientar a construção do **Produto Mínimo Viável (MVP)** — o subconjunto funcional que entrega o máximo de valor com o menor custo técnico, viabilizando uma entrega coerente e funcional dentro do prazo acadêmico.



### **10.1 Backlog Geral**

| **RF** | **User Story Derivada** | **RNFs relacionados** |
| :---: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------: |
| RF01 | Como médico, eu quero registrar novos pacientes com seus dados cadastrais básicos, para que eu possa iniciar e manter o acompanhamento do histórico clínico deles no sistema. | RNF01, RNF03, RNF06 |
| RF02 | Como médico, eu quero atualizar os dados cadastrais dos pacientes, para manter a base de dados sempre correta e atualizada. | RNF01, RNF03, RNF06 |
| RF03 | Como médico, eu quero excluir ou inativar logicamente o registro de pacientes, para remover pacientes que não são mais acompanhados sem perder o histórico clínico. | RNF01, RNF03, RNF06 |
| RF04 | Como médico, eu quero visualizar uma listagem e buscar pacientes utilizando filtros (ex: nome, CPF), para localizar rapidamente o prontuário da pessoa que estou atendendo. | RNF03, RNF06 |
| RF05 | Como médico ou administrador da clínica, eu quero exportar a base de dados completa dos pacientes em formato JSON, para garantir a portabilidade das informações e evitar o aprisionamento tecnológico (vendor lock-in). | RNF01, RNF06 |
| RF06 | Como médico, eu quero criar prontuários preenchendo campos estruturados no padrão SOAP, para padronizar o registro assistencial e facilitar a interpretação segura do histórico clínico em consultas futuras. | RNF01, RNF03, RNF06 |
| RF07 | Como médico, eu quero ter uma área de texto livre para o registro detalhado da anamnese, para complementar a avaliação do paciente com relatos e observações que não se encaixam nos campos estruturados. | RNF01, RNF03, RNF06 |
| RF08 | Como médico, eu quero fazer o upload e anexar arquivos, como imagens e exames em PDF, diretamente à anamnese, para centralizar todos os laudos e resultados relevantes no mesmo ambiente do prontuário. | RNF01, RNF03, RNF06 |
| RF09 | Como médico, eu quero visualizar uma linha do tempo cronológica com todo o histórico clínico do paciente, para compreender rapidamente a evolução do quadro de saúde e os tratamentos anteriores durante a consulta. | RNF03, RNF06 |
| RF10 | Como médico, eu quero assinar digitalmente o prontuário utilizando um certificado padrão ICP-Brasil, para garantir a autoria, a integridade e a validade jurídica do atendimento médico realizado. | RNF01, RNF05 |
| RF11 | Como médico, eu quero gerar e exportar um arquivo PDF contendo o prontuário completo do paciente, para facilitar o compartilhamento físico, arquivamento ou a entrega do documento ao próprio paciente quando solicitado. | RNF06, RNF08 |
| RF12 | Como médico, eu quero visualizar um calendário semanal das minhas consultas, para ter uma visão clara e organizada da minha agenda e planejar meu dia de trabalho. | RNF03, RNF06 |
| RF13 | Como médico, eu quero agendar novas consultas e/ou teleconsultas, vinculando paciente, data e horário, para gerenciar a marcação de atendimentos de forma eficiente. | RNF03, RNF06 |
| RF14 | Como médico, eu quero listar as consultas do dia e alterar o status (ex: Agendado, Em atendimento, Finalizado), para acompanhar o fluxo de trabalho da clínica em tempo real. | RNF01, RNF03, RNF06 |
| RF15 | Como médico, eu quero elaborar receitas médicas digitais no sistema, para formalizar a prescrição de medicamentos de forma clara e padronizada. | RNF03, RNF06 |
| RF16 | Como médico, eu quero assinar digitalmente a receita utilizando um certificado padrão ICP-Brasil, para garantir a autenticidade e a validade legal da prescrição. | RNF01, RNF05 |
| RF17 | Como médico, eu quero salvar a receita gerada em formato PDF, para imprimi-la ou enviá-la ao paciente de forma segura. | RNF06, RNF08 |
| RF18 | Como médico, eu quero que o sistema analise a prescrição em tempo real, utilizando IA para alertar sobre interações medicamentosas, garantindo a segurança do paciente. | RNF03, RNF07 |
| RF19 | Como médico, eu quero manter um log visível de todas as receitas anteriormente prescritas ao paciente, para consultar o histórico de tratamentos ao longo do tempo. | RNF01, RNF03, RNF06 |
| RF20 | Como médico, eu quero que o sistema gere o Termo de Consentimento (TCLE) e permita sua assinatura digital (ICP-Brasil), para formalizar o aceite do paciente antes do atendimento e cumprir exigências legais. | RNF01, RNF05 |
| RF21 | Como administrador, eu quero gerenciar os perfis de acesso de médicos, para definir permissões e garantir o controle operacional seguro. | RNF01, RNF02 |
| RF22 | Como médico, eu quero gerenciar os perfis de acesso de pacientes (incluindo ativar/inativar contas), para manter o controle sobre quem pode acessar o prontuário. | RNF01, RNF02 |
| RF23 | Como médico ou administrador, eu quero visualizar, buscar e filtrar o histórico de logs de auditoria sobre dados sensíveis, para rastrear todas as operações e garantir a conformidade e segurança. | RNF01 |

### **10.2 Priorização do Backlog e MVP**

Para a priorização do backlog foram utilizados os seguintes critérios:

* VB = valor de negócio (1 a 5)
* CX = complexidade técnica (1 a 5)
* ES = esforço de implementação (1 a 5)

#### 10.2.1) Pontuação Técnica

Para representar o "custo técnico" da US:

PT = (CX + ES) / 2

Assim, a pontuação técnica continua na mesma escala de 1 a 5.

#### 10.2.2) Sistema de Quadrantes

A priorização é determinada pelo posicionamento de cada user story em um **gráfico de quadrantes** com dois eixos: **Valor de Negócio (VB)** no eixo vertical (0 a 5) e **Pontuação Técnica (PT)** no eixo horizontal (0 a 5). O cruzamento desses eixos nos limiares (VB = 4, PT = 2.5) define quatro quadrantes que orientam a decisão de inclusão no MVP:

* **Quadrante 1 — Alto valor, Baixo esforço** (VB ≥ 4 e PT ≤ 2.5): deve compor o MVP. São funcionalidades que entregam alto impacto clínico ou operacional com custo técnico reduzido, representando as oportunidades de maior retorno imediato.
* **Quadrante 2 — Alto valor, Alto esforço** (VB ≥ 4 e PT > 2.5): pode compor parcialmente o MVP, caso seja essencial para a coerência funcional do produto. São funcionalidades de alto impacto que demandam investimento técnico significativo e devem ser planejadas com cuidado.
* **Quadrante 3 — Baixo valor, Baixo esforço** (VB < 4 e PT ≤ 2.5): pode compor o MVP se houver margem de tempo ou recursos disponíveis. São funcionalidades de impacto moderado que podem ser incluídas como complemento sem comprometer o cronograma.
* **Quadrante 4 — Baixo valor, Alto esforço** (VB < 4 e PT > 2.5): não deve compor o MVP, pois apresenta baixo retorno em relação ao investimento técnico necessário. São candidatas a sprints futuras ou a cortes de escopo.

#### 10.2.3) Faixas de decisão

* Quadrante 1 → Alta prioridade
* Quadrante 2 → Média prioridade
* Quadrante 3 → Média prioridade
* Quadrante 4 → Baixa prioridade

A partir disso, foi gerada a seguinte tabela.

| **US** | **Descrição** | **VB** | **CX** | **ES** | **PT** | **Quadrante** | **Prioridade sugerida** |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| US01 | Registrar novos pacientes | 5 | 2 | 2 | 2.0 | 1 | Alta |
| US02 | Editar registros de pacientes | 5 | 2 | 2 | 2.0 | 1 | Alta |
| US03 | Excluir/inativar registros de pacientes | 4 | 2 | 1 | 1.5 | 1 | Alta |
| US04 | Buscar/listar pacientes | 4 | 2 | 2 | 2.0 | 1 | Alta |
| US05 | Exportar base de dados JSON | 4 | 3 | 2 | 2.5 | 1 | Alta |
| US06 | Criar prontuário SOAP | 5 | 3 | 3 | 3.0 | 2 | Média |
| US07 | Registrar anamnese | 4 | 2 | 2 | 2.0 | 1 | Alta |
| US08 | Anexar documentos/exames | 4 | 3 | 2 | 2.5 | 1 | Alta |
| US09 | Exibir histórico clínico | 5 | 3 | 3 | 3.0 | 2 | Média |
| US10 | Assinar prontuário digital | 4 | 3 | 4 | 3.5 | 2 | Média |
| US11 | Exportar prontuário PDF | 4 | 3 | 3 | 3.0 | 2 | Média |
| US12 | Exibir calendário semanal | 5 | 2 | 2 | 2.0 | 1 | Alta |
| US13 | Agendar consultas/teleconsultas | 5 | 3 | 3 | 3.0 | 2 | Média |
| US14 | Gerenciar status de consultas | 5 | 3 | 2 | 2.5 | 1 | Alta |
| US15 | Elaborar receita digital | 5 | 3 | 3 | 3.0 | 2 | Média |
| US16 | Assinar receita digital | 4 | 3 | 3 | 3.0 | 2 | Média |
| US17 | Emitir receita PDF | 5 | 3 | 2 | 2.5 | 1 | Alta |
| US18 | Analisar interações por IA | 3 | 4 | 4 | 4.0 | 4 | Baixa |
| US19 | Manter histórico prescrições | 4 | 3 | 2 | 2.5 | 1 | Alta |
| US20 | Gerar/assinar TCLE | 3 | 3 | 3 | 3.0 | 4 | Baixa |
| US21 | Gerenciar perfis de admins | 5 | 3 | 3 | 3.0 | 2 | Média |
| US22 | Gerenciar perfis de médicos | 5 | 3 | 3 | 3.0 | 2 | Média |
| US23 | Consultar logs de auditoria | 4 | 3 | 3 | 3.0 | 2 | Média |

### **10.3 Definição do MVP**

O MVP (Produto Mínimo Viável) do ProntoCare foi definido com base nos requisitos classificados como essenciais para o funcionamento básico e viável da solução, considerando todas as funcionalidades posicionadas no **Quadrante 1** (alto valor, baixo esforço) e no **Quadrante 2** (alto valor, alto esforço). A seleção foi realizada levando em conta a prioridade de negócio, a viabilidade técnica dentro do prazo acadêmico e a necessidade de validar a proposta de valor do sistema com o cliente (Dr. Rogério) em cenários reais de atendimento. O foco foi garantir que o médico possa realizar o ciclo assistencial completo — desde o cadastro do paciente, o registro do prontuário estruturado (SOAP) e a assinatura digital dos documentos clínicos, até a prescrição de receitas, o controle da agenda e a consulta a logs de auditoria —, enquanto o administrador mantém o controle de acesso e a segurança do sistema. As funcionalidades classificadas como Baixa prioridade (Quadrante 4) foram deliberadamente excluídas do MVP por apresentarem baixo valor de negócio em relação ao alto custo técnico, sendo candidatas a sprints futuras.

| **US** | **Descrição** | **Quadrante** | **Justificativa de inclusão no MVP** |
| :---: | :--- | :---: | :--- |
| US01 | Registrar novos pacientes | 1 | Funcionalidade fundamental: sem cadastro de pacientes, nenhum fluxo clínico pode ser iniciado. |
| US02 | Editar registros de pacientes | 1 | Essencial para manter a base de dados correta e atualizada ao longo do acompanhamento clínico. |
| US03 | Excluir/inativar registros de pacientes | 1 | Necessária para remover pacientes inativos sem perda de histórico, garantindo a integridade da base. |
| US04 | Buscar/listar pacientes | 1 | Necessária para localizar rapidamente o paciente durante o atendimento; viabiliza o acesso ao prontuário. |
| US05 | Exportar base de dados JSON | 1 | Garante a portabilidade dos dados e evita aprisionamento tecnológico, requisito explícito do cliente. |
| US06 | Criar prontuário SOAP | 2 | Núcleo funcional do produto: o prontuário estruturado é a razão de existir do ProntoCare. |
| US07 | Registrar anamnese | 1 | Complementa o prontuário SOAP com observações em texto livre, essencial para a avaliação clínica. |
| US08 | Anexar documentos/exames | 1 | Centraliza exames e laudos no prontuário, eliminando a dependência de arquivos físicos. |
| US09 | Exibir histórico clínico | 2 | Indispensável para a continuidade do cuidado: o médico precisa visualizar a evolução do paciente. |
| US10 | Assinar prontuário digital | 2 | Garante a autoria, a integridade e a validade jurídica do atendimento via certificado ICP-Brasil. |
| US11 | Exportar prontuário PDF | 2 | Permite o compartilhamento físico e arquivamento do prontuário completo quando solicitado pelo paciente. |
| US12 | Exibir calendário semanal | 1 | Permite ao médico organizar sua agenda e planejar os atendimentos da semana. |
| US13 | Agendar consultas/teleconsultas | 2 | Completa o fluxo de agenda; sem agendamento, o calendário semanal (US12) fica inoperante. |
| US14 | Gerenciar status de consultas | 1 | Permite acompanhar o fluxo de atendimento do dia em tempo real (Agendado → Em atendimento → Finalizado). |
| US15 | Elaborar receita digital | 2 | Parte essencial do fluxo assistencial: a prescrição é uma das saídas principais de toda consulta médica. |
| US16 | Assinar receita digital | 2 | Garante a autenticidade e a validade legal da prescrição médica via certificado ICP-Brasil. |
| US17 | Emitir receita PDF | 1 | Viabiliza a entrega da receita ao paciente em formato digital para impressão ou envio. |
| US19 | Manter histórico prescrições | 1 | Permite consultar tratamentos anteriores durante a consulta, evitando prescrições contraditórias. |
| US21 | Gerenciar perfis de admins | 2 | Requisito de segurança: garante controle estrito sobre as contas administrativas. |
| US22 | Gerenciar perfis de médicos | 2 | Requisito de segurança: garante que apenas médicos autorizados acessem dados sensíveis. |
| US23 | Consultar logs de auditoria | 2 | Requisito de conformidade: viabiliza a rastreabilidade das operações sobre dados sensíveis (LGPD/CFM). |

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-05-18 | 0.1 | Elaboração e revisão do backlog de produto, modelo de priorização por quadrantes e definição do MVP. | Prontuariantes |