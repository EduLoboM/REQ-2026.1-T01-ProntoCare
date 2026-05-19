# Interação entre equipe e cliente

### 7 Interação entre equipe e cliente

#### 7.1 Composição da equipe

A equipe de desenvolvimento é composta pelos seguintes membros. Cabe destacar que, de acordo com o modelo de trabalho da equipe, todos os integrantes colaboram ativamente na elicitação, documentação e validação:

| Papel | Descrição | Responsável |
| :--- | :--- | :--- |
| Gerente do projeto / Analista de Requisitos | Coordena o projeto, garante a comunicação entre cliente e equipe, controla prazos e gerencia os requisitos. | Luciano A. B. S. Machado |
| Desenvolvedor Frontend / Analista de Requisitos | Responsável pela interface do usuário, participando da análise e definição dos requisitos do sistema. | Pedro Gonçalves Rocha |
| Desenvolvedor Frontend / Analista de Requisitos | Define os requisitos funcionais e não funcionais do sistema e garante que eles sejam atendidos no frontend. | Uires Carlos de Oliveira |
| Desenvolvedor Backend / Analista de Requisitos | Implementa a lógica de negócios e APIs, auxiliando na documentação e modelagem das regras de negócio. | Fabio A. Santos Vieira |
| Desenvolvedor Backend / Analista de Requisitos | Implementa a lógica de negócios e APIs, auxiliando na documentação e modelagem das regras de negócio. | Vinicius A. de B. Vieira |
| Analista de QA / Analista de Requisitos | Garante a qualidade executando testes baseados nos requisitos estabelecidos e atua na sua validação contínua. | Eduardo Lobo Moreira |
| Monitor | Apoia a equipe no processo de desenvolvimento e nas entregas da disciplina. | Willian |



#### 7.2 Comunicação

**Ferramentas de comunicação**

| Ferramenta | Uso |
| :--- | :--- |
| WhatsApp | Comunicação diária e rápida entre os membros da equipe (canal interno). |
| Google Meet e Discord | Reuniões de revisão e planejamento de sprint; videoconferências com o cliente (Dr. Rogério). |
| GitHub / GitHub Projects | Controle de versão, revisão de código e gerenciamento do backlog do projeto. |
| Notion | Documentação do projeto, atas de reunião e registro de decisões técnicas. |

**Métodos e frequência de reuniões**

| Tipo | Frequência | Duração / participantes | Objetivo |
| :--- | :--- | :--- | :--- |
| Daily standup | Diária | 2 horas — equipe interna. | Alinhamento do progresso e identificação de impedimentos de maneira online segunda, quarta e sexta, e presencialmente nas terças e quintas na janela das 18h às 20h. |
| Planejamento de sprint | Semanal (início da sprint)* | 1–2 h — equipe interna. | Definição das user stories e tarefas da sprint. |
| Revisão de sprint | Semanal (fim da sprint)* | 1 h — equipe interna. | Demonstração das funcionalidades e coleta de feedback. |
| Retrospectiva | Semanal (fim da sprint)* | 45 min — equipe interna. | Análise do processo e definição de melhorias. |
| Reunião com o cliente | Semanal | 30–60 min — videoconferência. | Validação de entregas, revisão de critérios de aceitação e alinhamento de prioridades clínicas. |

_* Nota: A Sprint 0 possui duração de 2 semanas, com as reuniões adaptadas para esse período._

#### 7.3 Processo de validação

O processo de validação da solução é realizado em três etapas que envolvem a equipe e o cliente em momentos distintos:

1. **Definition of Ready (DoR)** — antes do início do desenvolvimento, a equipe assegura que cada funcionalidade possui requisitos claros e critérios de aceitação validados pelo Dr. Rogério, especialmente em itens sensíveis ao domínio clínico (fluxo SOAP, segurança, privacidade). Os critérios completos do DoR estão detalhados na seção 9.

2. **Definition of Done (DoD)** — uma funcionalidade só é considerada concluída quando atende a critérios de qualidade técnica e validação clínica aplicados **a cada sprint**, incluindo testes, revisão de código e aprovação do cliente. Os critérios completos do DoD estão detalhados na seção 9.

3. **Teste de aceitação com o cliente** — ao final de cada sprint, o Dr. Rogério verifica as funcionalidades entregues e confirma se atendem aos requisitos clínicos e operacionais. Além disso, **antes do desenvolvimento**, o cliente valida histórias, critérios de aceitação, fluxos SOAP e RNFs sensíveis. Divergências identificadas na revisão resultam em ajustes no backlog da sprint seguinte.

#### 7.4 Participação do cliente na Engenharia de Requisitos

O Dr. Rogério Sampaio, cliente e médico responsável pelo consultório, participa ativamente de todas as atividades críticas de Engenharia de Requisitos ao longo do ciclo ScrumXP. Sua atuação **não se restringe à validação ao final da sprint**: ele é envolvido antes, durante e após o desenvolvimento. O detalhamento completo dessa participação está documentado na seção 4.1 (Atividades e técnicas de ER e ScrumXP). A tabela a seguir resume as formas de envolvimento:

| Momento | Atividade de ER | Forma de participação do Dr. Rogério |
| :--- | :--- | :--- |
| **Antes da sprint** | Elicitação | Entrevistas estruturadas e workshops para levantar necessidades clínicas, fluxos SOAP, protocolos de atendimento e restrições operacionais. |
| **Antes da sprint** | Priorização | Participa da priorização MoSCoW validando quais funcionalidades são clinicamente indispensáveis (Must have) e quais podem ser postergadas. |
| **Antes da sprint** | Validação de critérios de aceitação | Revisa e aprova os critérios de aceitação de cada user story, garantindo que reflitam corretamente as regras clínicas e o fluxo SOAP esperado. |
| **Antes da sprint** | Revisão de RNFs clínicos | Valida requisitos não-funcionais sensíveis ao domínio (ex.: tempo de resposta em consulta, legibilidade do prontuário, conformidade com normas do CFM e LGPD). |
| **Durante a sprint** | Validação clínica intermediária | Consultado sobre protótipos e comportamentos de funcionalidades sensíveis (fluxo SOAP, segurança, privacidade) antes da entrega final. |
| **Durante a sprint** | Gestão de mudanças | Qualquer alteração em requisitos clínicos, fluxo SOAP ou regras de negócio passa por sua aprovação antes de ser incorporada ao backlog. |
| **Ao final da sprint** | Aprovação de segurança, privacidade e integridade | Decisões que afetam a segurança do paciente, privacidade de dados (LGPD) e integridade da cadeia de autenticidade do prontuário requerem sua aprovação explícita. |
| **Ao final da sprint** | Teste de aceitação | Verifica as funcionalidades entregues e confirma se atendem aos requisitos clínicos e operacionais. |

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-05-18 | 0.1 | Elaboração e revisão da composição da equipe, comunicação e processo de validação. | Prontuariantes |

