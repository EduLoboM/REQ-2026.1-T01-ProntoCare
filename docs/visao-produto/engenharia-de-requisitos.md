# Engenharia de requisitos

### 5 Engenharia de requisitos

A partir das informações apresentadas na seção 3, devem ser estabelecidas as atividades da Engenharia de Requisitos (ER), suas práticas e técnicas em alinhamento ao processo ScrumXP informado.

#### 5.1 Atividades e técnicas de ER e ScrumXP

**Planejamento da release**

*Elicitação e descoberta*

- **Entrevistas com o cliente:** entrevistas estruturadas com o Dr. Rogério para identificar necessidades do fluxo assistencial, prioridades do consultório, restrições operacionais e expectativas quanto à segurança e privacidade dos dados clínicos.
- **Brainstorming com a equipe:** sessões de brainstorming para explorar soluções técnicas e funcionais a partir das necessidades levantadas nas entrevistas, gerando alternativas de design e identificando requisitos complementares.
- **Análise de domínio clínico:** estudo do fluxo SOAP, protocolos clínicos e referências como o eSUS PEC, para embasar os requisitos com o contexto médico real. O Dr. Rogério valida se a análise reflete fielmente a prática do consultório.

*Análise e consenso*

- **Priorização MoSCoW com o cliente:** classificação das funcionalidades em Must have, Should have, Could have e Won't have, com participação direta do Dr. Rogério para assegurar que a priorização reflita o impacto clínico real.
- **Análise de custo/benefício:** avaliação do impacto de cada funcionalidade em relação ao esforço de desenvolvimento, considerando o prazo acadêmico.
- **Validação de RNFs clínicos:** o Dr. Rogério revisa os requisitos não-funcionais ligados a desempenho em consulta, legibilidade do prontuário, conformidade com normas do CFM e proteção de dados (LGPD).

*Declaração*

- **Temas, épicos e user stories:** organização dos requisitos em temas (ex.: prontuário, autenticidade) e user stories com critérios de aceitação, seguindo a cadeia de rastreabilidade OE → CP → requisito → user story → critério de aceitação → teste → entrega.

*Verificação e validação*

- **Revisão de clareza, consistência e completude:** verificação antecipada dos requisitos declarados quanto à clareza das definições, consistência entre requisitos funcionais e não-funcionais, e completude frente aos objetivos específicos (OEs) e características do produto (CPs).
- **Verificação de RNFs críticos:** avaliação dos requisitos de segurança, privacidade, auditoria, integridade documental, disponibilidade, controle de acesso e conformidade (LGPD/CFM) quanto à verificabilidade — cada RNF deve ser mensurável e testável antes de avançar para a sprint.
- **Validação clínica com o Dr. Rogério:** o cliente valida se os requisitos de alto nível refletem fielmente as necessidades do consultório e se os RNFs sensíveis estão adequados à prática médica.

*Organização e atualização*

- **Estruturação inicial do backlog da release:** organização do backlog com os requisitos priorizados, épicos e user stories classificados por tema, com rastreabilidade aos OEs e CPs correspondentes.
- **Definição do baseline de RNFs:** registro formal dos RNFs críticos aceitos para a release, servindo como referência para verificação nas sprints subsequentes.

**Planejamento da sprint**

*Elicitação e descoberta*

- **Entrevistas e análise documental:** refinamento dos detalhes clínicos de cada funcionalidade com o Dr. Rogério antes do início da sprint, incluindo validação de fluxos SOAP, regras clínicas e cenários de uso.

*Análise e consenso*

- **Discussões em equipe, análise de tarefas:** análise de dependências técnicas entre módulos (ex.: cadeia de hash depende do módulo SOAP estar funcional).

*Verificação e validação*

- **Verificação pré-desenvolvimento:** antes de a sprint iniciar, cada user story é verificada quanto à clareza, consistência com os RNFs críticos, completude dos critérios de aceitação e viabilidade de teste. Histórias que envolvem segurança, privacidade, integridade documental ou conformidade são revisadas com atenção especial.
- **Validação de histórias e fluxos com o Dr. Rogério:** o cliente valida as user stories candidatas à sprint, especialmente critérios de aceitação de fluxo SOAP, regras clínicas e RNFs sensíveis, garantindo que estejam corretas antes do desenvolvimento.

*Declaração*

- **Critérios de aceitação detalhados, DoR:** garantia de que cada user story possui critérios de aceitação claros antes de entrar em desenvolvimento. **O Dr. Rogério revisa e aprova os critérios de aceitação**, especialmente aqueles relacionados ao fluxo SOAP, regras clínicas e RNFs sensíveis (segurança, privacidade, integridade documental), como parte do Definition of Ready.

*Organização e atualização*

- **Grooming do backlog com o cliente:** refinamento e repriorização do backlog com a equipe e o Dr. Rogério ao início de cada sprint. O cliente valida as user stories candidatas, confirma prioridades clínicas e aprova quaisquer mudanças de escopo ou novos requisitos.
- **Gestão de mudanças:** alterações em requisitos clínicos, fluxo SOAP ou regras de negócio identificadas durante o grooming passam por aprovação do Dr. Rogério antes de serem incorporadas ao backlog da sprint.

**Execução da sprint**

*Representação*

- **Protótipos e wireframes:** criação de protótipos de interface para funcionalidades como o formulário SOAP, a tela de histórico do paciente e o controle de acesso.

*Verificação e validação*

- **Checklist, revisão de critérios de aceitação:** verificação de que os critérios de aceitação foram atendidos antes de marcar uma user story como concluída.
- **Validação clínica intermediária:** em funcionalidades que envolvem o fluxo SOAP, regras clínicas ou decisões sobre segurança e privacidade, o Dr. Rogério é consultado durante a sprint para validar protótipos e comportamentos antes da entrega final.

*Verificação e validação*

- **DEEP (Detalhado, Estimado, Emergente, Priorizado):** verificação contínua de que os itens do backlog da sprint estão suficientemente detalhados, com estimativas realistas, refletindo entendimentos emergentes e priorizados conforme o valor clínico. Itens que não atendem aos critérios DEEP são sinalizados para refinamento antes de continuar.

*Organização e atualização*

- **Revisão do backlog da sprint:** ajuste contínuo do backlog durante a sprint conforme surgem novos entendimentos técnicos ou clínicos.

**Revisão da sprint**

*Verificação e validação*

- **Coleta de feedback, workshop de requisitos:** demonstração ao Dr. Rogério das funcionalidades entregues e coleta de feedback para orientar o próximo ciclo.
- **Aprovação de decisões de segurança e privacidade:** o Dr. Rogério aprova formalmente funcionalidades que afetam segurança do paciente, privacidade de dados (LGPD) e integridade da cadeia de autenticidade do prontuário antes da liberação.

*Declaração*

- **Incorporar feedback, negociação:** ajuste das user stories com base no feedback do cliente e negociação de prioridades para a sprint seguinte.

**Retrospectiva da sprint**

*Verificação e validação*

- **Avaliação do processo de ER:** a equipe verifica se as práticas de ER adotadas na sprint foram eficazes — se os requisitos estavam claros o suficiente, se os critérios de aceitação eram verificáveis, se os RNFs críticos foram adequadamente tratados e se houve falhas de comunicação com o cliente.
- **Análise de causas-raiz:** identificação das causas de defeitos, retrabalho ou mal-entendidos relacionados a requisitos, para prevenir recorrências.

**Planejamento da próxima release**

*Elicitação e descoberta*

- **Workshops com o cliente:** identificação de novos requisitos para a próxima release com base no produto entregue e nas necessidades emergentes do consultório.

*Análise e consenso*

- **Priorização MoSCoW, mapeamento de valor:** revisão estratégica das prioridades para a próxima release, considerando o feedback acumulado.

*Declaração*

- **Criação de épicos, user stories, INVEST:** user stories seguindo o modelo INVEST para objetivos da próxima release.

*Verificação e validação*

- **DEEP do backlog da release:** verificação de que o backlog da próxima release atende aos critérios DEEP (Detalhado, Estimado, Emergente, Priorizado), com atenção especial à verificabilidade dos RNFs críticos.

*Organização e atualização*

- **Revisão e baseline do backlog da release:** backlog revisado, priorizado e preparado para o início do próximo ciclo de desenvolvimento, com rastreabilidade atualizada (OE → CP → requisito → US).

#### 5.2 Engenharia de requisitos e o ScrumXP

As atividades da ER, suas práticas e técnicas são mapeadas a partir das fases do ScrumXP, conforme a tabela a seguir. Esta tabela sintetiza o detalhamento apresentado na seção 4.1.

| Fases do ScrumXP | Atividades da ER | Prática | Técnica | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| Planejamento da release | Elicitação e descoberta | Levantamento de requisitos | Entrevistas estruturadas com o cliente, brainstorming com a equipe, análise de domínio clínico (fluxo SOAP, protocolos, eSUS PEC) | Requisitos de alto nível identificados e validados; objetivos da release definidos com base no domínio clínico. |
| Planejamento da release | Análise e consenso | Priorização de requisitos | Priorização MoSCoW, análise custo/benefício | Escopo e funcionalidades críticas priorizadas. |
| Planejamento da release | Declaração | Registro dos requisitos | Temas, épicos e user stories (com rastreabilidade OE → CP → requisito → US) | User stories rastreáveis aos OEs e CPs. |
| Planejamento da release | Verificação e validação | Revisão antecipada de requisitos | Revisão de clareza, consistência, completude; verificação de RNFs críticos | Requisitos verificados e validados antes das sprints. |
| Planejamento da release | Organização e atualização | Estruturação do backlog | Backlog inicial, baseline de RNFs | Backlog estruturado com rastreabilidade e RNFs definidos. |
| Planejamento da sprint | Elicitação e descoberta | Refinamento de requisitos | Entrevistas, análise documental | Requisitos refinados para a sprint. |
| Planejamento da sprint | Análise e consenso | Análise de dependências | Discussões em equipe, análise de tarefas | Consenso sobre viabilidade e priorização. |
| Planejamento da sprint | Declaração | Critérios de aceitação | Critérios detalhados, DoR | User stories com critérios de aceitação validados pelo cliente. |
| Planejamento da sprint | Verificação e validação | Verificação pré-desenvolvimento e validação de requisitos | Revisão de clareza, consistência com RNFs, verificabilidade; checklist de critérios de aceitação | User stories verificadas, validadas e aprovadas para desenvolvimento. |
| Planejamento da sprint | Organização e atualização | Refinamento do backlog | Grooming do backlog | Backlog refinado e priorizado com aval clínico. |
| Execução da sprint | Representação | Criação de protótipos | Protótipos, wireframes | Protótipos que orientam a implementação. |
| Execução da sprint | Verificação e validação | Validação clínica intermediária | Consulta ao cliente sobre protótipos e comportamentos de funcionalidades sensíveis (fluxo SOAP, segurança, privacidade) | Funcionalidades sensíveis validadas clinicamente antes da revisão da sprint. |
| Execução da sprint | Verificação e validação | DEEP do backlog | DEEP (Detalhado, Estimado, Emergente, Priorizado) | Backlog verificado e atualizado conforme critérios DEEP. |
| Execução da sprint | Organização e atualização | Revisão do backlog | Revisão do backlog da sprint | Backlog atualizado e alinhado. |
| Revisão da sprint | Verificação e validação | Demonstração ao cliente | Coleta de feedback, workshop de requisitos | Funcionalidades verificadas; feedback coletado; aprovação formal de itens sensíveis. |
| Revisão da sprint | Declaração | Atualização de user stories | Incorporar feedback, negociação | User stories ajustadas conforme feedback. |
| Retrospectiva da sprint | Verificação e validação | Avaliação do processo de ER | Análise de causas-raiz, revisão de eficácia das práticas de ER | Causas de defeitos e retrabalho identificadas; melhorias no processo de ER definidas. |
| Planejamento da próxima release | Elicitação e descoberta | Identificação de novos requisitos | Workshops com o cliente, análise de domínio clínico | Novos requisitos identificados e validados com o cliente; backlog da próxima release alimentado. |
| Planejamento da próxima release | Análise e consenso | Priorização estratégica | Priorização MoSCoW, mapeamento de valor | Requisitos priorizados para a próxima release. |
| Planejamento da próxima release | Declaração | Épicos e user stories | Criação de épicos, user stories, INVEST | User stories para objetivos da próxima release. |
| Planejamento da próxima release | Verificação e validação | DEEP do backlog da release | DEEP (Detalhado, Estimado, Emergente, Priorizado) | Backlog verificado conforme critérios DEEP. |
| Planejamento da próxima release | Organização e atualização | Revisão do backlog | Revisão e baseline do backlog da release | Backlog preparado com rastreabilidade atualizada. |

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-05-18 | 0.1 | Elaboração e revisão das atividades e técnicas de ER mapeadas ao ScrumXP. | Prontuariantes |

