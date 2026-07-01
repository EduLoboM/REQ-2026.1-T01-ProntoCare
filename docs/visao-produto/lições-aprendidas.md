# Lições aprendidas

### Lições aprendidas

#### 11.1 Unidade 1

Durante o desenvolvimento inicial do projeto do ProntoCare, várias lições importantes foram aprendidas que irão influenciar as próximas fases. Abaixo estão as lições aprendidas, focando nas ações de melhoria, desafios enfrentados e como foram (ou não) superados.

##### Lições Aprendidas e Melhorias para o Processo

1. **Elicitação e Validação Contínua da Interface com o Cliente**

    - **Desafio:** Observou-se sob a perspectiva operacional que o médico adota há anos uma rotina de atendimento fortemente apoiada em registros físicos em papel. O grande desafio era garantir que a interface do ProntoCare apresentasse uma usabilidade elevada o suficiente para que a adaptação não demandasse treinamento extensivo e nem comprometesse a fluidez das consultas.

    - **Ação de Melhoria:** A equipe optou pela abordagem ágil ScrumXP , que permite validações frequentes com o cliente e flexibilidade de requisitos. Além disso, estabeleceu-se a criação de protótipos e wireframes na fase de Representação, assegurando o alinhamento visual e clínico da interface do prontuário SOAP antes do desenvolvimento.

2. **Gerenciamento do Escopo Frente ao Prazo Acadêmico**

    - **Desafio:** O projeto possuía desafios restritivos, como um cronograma acadêmico fixo de 3 a 4 meses, equipe estudantil e a exigência de ferramentas com custo zero. Tentar abraçar todo o ciclo assistencial de imediato tornou-se inviável.

    - **Ação de Melhoria:** Em reunião de elicitação com o Dr. Rogério, a equipe levantou as principais dores do consultório e, durante a própria conversa, aplicou a técnica de priorização MoSCoW junto com o cliente, classificando funcionalidades e delimitando o MVP de forma colaborativa. Esse encontro foi gravado e sua ata e vídeo se encontram na parte da Sprint 0 do projeto. O MVP concentra-se no essencial: prontuário SOAP com folha de rosto, operação offline com sincronização e exportação de dados (JSON, PDF). A conformidade com a LGPD é tratada de forma incremental — controles básicos de acesso, privacidade de dados sensíveis e logs de auditoria fazem parte do MVP, enquanto a conformidade completa (portal de direitos do titular, consentimento granular, relatórios de impacto) fica no backlog de visão futura. Módulos como emissão de receitas médicas e telemedicina poderão ser incorporados nas sprints finais do semestre, caso o ritmo de entrega permita, ou encaminhados para evolução pós-disciplina. A lista de priorização resultante e a delimitação final do escopo do MVP serão validadas formalmente até a entrega da Unidade 2, momento em que a equipe apresentará os artefatos atualizados e o backlog refinado ao professor e ao cliente para verificação de aderência ao planejamento.

3. **Adequação do Cronograma ao Modelo Ágil e Prazo Letivo**

    - **Desafio:** O cronograma original apresentava traços de um modelo sequencial ("mini-cascata"), com sprints finais dedicadas exclusivamente a integração e testes, além de tratar os Requisitos Não-Funcionais (RNFs) apenas como entregas isoladas. Havia também a dificuldade de encaixar as 9 sprints propostas no tempo de fato restante no semestre letivo (aproximadamente 12 semanas, encerrando por volta de 13/07/2026).

    - **Ação de Melhoria:** Com base no feedback do professor e na contagem de tempo real, o cronograma foi totalmente reestruturado. Condensamos o planejamento para 10 sprints com duração fixa e exata de 1 semana. A abordagem sequencial foi eliminada em favor da integração contínua real: agora, cada sprint entrega um incremento funcional, testado e integrado. Além disso, todos os RNFs críticos (segurança, privacidade e auditoria) e as Características de Produto (CPs) passaram a cruzar transversalmente as sprints desde o início, garantindo rastreabilidade e qualidade ao longo de todo o desenvolvimento.

#### 11.2 Unidade 2

1. **Gerenciamento de escopo durante as sprints**

    - **Desafio:** A funcionalidade de telemedicina via Google Meet foi inicialmente planejada, mas precisou ser retirada por não atender aos critérios de viabilidade técnica dentro do prazo.
    - **Ação de Melhoria:** Aplicar o sistema de quadrantes de priorização de forma mais rigorosa desde o planejamento, cortando itens Q4 antes de detalhá-los em user stories.

2. **Consistência de Granularidade e Qualidade dos Requisitos**

    - **Desafio:** Durante a construção do backlog e a declaração dos requisitos funcionais, a equipe enfrentou dificuldades em manter um nível de granularidade uniforme entre os RFs. Alguns requisitos foram declarados com escopo amplo (ex.: RF02 originalmente abrangia tanto a edição quanto a inativação lógica de pacientes), enquanto outros foram decompostos em ações atômicas. Essa inconsistência gerou ambiguidade na derivação das user stories — uma US acabava cobrindo dois RFs implicitamente, enquanto outra cobria apenas uma operação simples — comprometendo a precisão da estimativa de esforço e a verificabilidade dos critérios de aceitação.

    - **Ação de Melhoria:** A equipe estabeleceu como regra que cada RF deve representar **uma única capacidade verificável do sistema**, garantindo mapeamento 1:1 entre RFs e user stories. Requisitos que agrupavam múltiplas ações foram decompostos (ex.: separação entre "editar registros" e "excluir/inativar registros"). Além disso, passou-se a revisar a consistência de granularidade durante o grooming do backlog, verificando se cada RF possui critérios de aceitação testáveis de forma independente e se a descrição é suficientemente específica para orientar a implementação sem ambiguidade.

3. **Integridade da Cadeia de Rastreabilidade entre Documentos**

    - **Desafio:** A documentação do projeto é distribuída em múltiplas seções (requisitos, backlog, matriz de rastreabilidade, DoR/DoD), e durante a Unidade 2 identificou-se que alterações em um documento não eram propagadas sistematicamente para os demais. A remoção de um requisito funcional (telemedicina via Google Meet) não foi refletida na lista de RFs, e a numeração das user stories no backlog ficou deslocada em relação aos RFs da seção 8.1, quebrando silenciosamente a cadeia OE → CP → RF → US.

    - **Ação de Melhoria:** Instituiu-se uma etapa de **revisão cruzada de rastreabilidade** como parte do Definition of Done de entregas documentais: qualquer alteração em um RF, US ou na matriz de rastreabilidade exige verificação de consistência em todos os artefatos relacionados antes de ser considerada concluída. A equipe também passou a utilizar a numeração idêntica entre RFs e USs (US01 = RF01, US02 = RF02, ...) para facilitar a detecção de inconsistências.

#### 11.3 Unidade 3

1. **Manutenção dos rituais ágeis**

    - **Desafio:** A perda de artefatos de comunicação nas dailys somada à ausência de membros-chave em cerimônias síncronas importantes (como o Planning da Sprint 6) dificultou o alinhamento completo do time quanto à distribuição e execução de tarefas de infraestrutura complexas de fim de ciclo.

    - **Ação de Melhoria:** A equipe instituiu a redundância de gravação de reuniões, delegando a gravação a múltiplos membros (anfitrião e co-anfitrião). Além disso, formalizou-se um fluxo assíncrono obrigatório de alinhamento pelo canal de comunicação oficial do grupo, garantindo que as decisões de planejamento e a escolha de atividades no backlog sejam validadas por todos os membros nas primeiras 24 horas de cada sprint.

2. **Verificação e validação dos requisitos**

    - **Desafio:** Validar tecnicamente e clinicamente os requisitos não-funcionais (RNFs) de segurança e usabilidade de baixo nível (como a integridade por hash SHA-256 na exportação de PDFs, logs de auditoria detalhados e persistência resiliente em IndexedDB via Dexie.js) com um cliente médico de forma a garantir que as decisões de arquitetura atendam perfeitamente aos fluxos clínicos diários e exigências legais e também tivemos problemas de granularidade na definição de alguns RFs principalmente na parte de criação de documentos e de permissões de login.

    - **Ação de Melhoria:** Os requisitos foram corrigidos de acordo com as issues abertas e também com os critérios de aceitação (DoR/DoD) que foram revisados. Complementarmente, foram elaborados cenários de testes práticos e interativos durante a Review e entregas parciais com o cliente (como a simulação de perda de conexão para testar o banco local Dexie.js), permitindo ao cliente atestar diretamente a conformidade e a robustez das soluções sem a necessidade de conhecimento técnico aprofundado.

#### 11.4 Unidade 4

1. **Especificação dos casos de uso**

   - **Desafio:** Durante a elaboração das declarações e especificações dos casos de uso, a equipe identificou que funcionalidades críticas, como assinatura digital ICP-Brasil, conformidade com a LGPD, emissão de documentos clínicos e gerenciamento do status das consultas, exigiam um nível de detalhamento maior do que o inicialmente previsto. Em alguns casos, fluxos alternativos, exceções, pré-condições e regras de negócio não estavam suficientemente especificados, o que poderia gerar interpretações diferentes durante a implementação.

   - **Ação de Melhoria:** A equipe passou a padronizar a especificação dos casos de uso utilizando um modelo único, documentando objetivo, atores, gatilho, pré-condições, pós-condições, fluxo principal, fluxos alternativos, exceções e regras de negócio. Essa padronização tornou os artefatos mais consistentes, facilitou a comunicação entre os membros da equipe e reduziu ambiguidades durante o desenvolvimento.

2. **Rastreabilidade entre requisitos e casos de uso**

   - **Desafio:** A evolução dos requisitos relacionados à conformidade regulatória (LGPD/CFM), assinatura digital ICP-Brasil e padronização dos documentos clínicos exigiu constantes atualizações na documentação. Em alguns momentos, alterações realizadas nos requisitos funcionais não eram refletidas imediatamente nos casos de uso e nas histórias de usuário, aumentando o risco de inconsistências entre os artefatos do projeto.

   - **Ação de Melhoria:** Como melhoria de processo, a equipe incorporou uma etapa de revisão de rastreabilidade ao final de cada sprint, verificando a consistência entre requisitos funcionais, casos de uso, histórias de usuário e backlog. Essa prática garantiu maior alinhamento entre documentação e implementação, além de fortalecer a conformidade com os requisitos regulatórios e reduzir retrabalho durante o desenvolvimento.


#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-02-10 | 0.1 | Elaboração inicial da visão do produto e projeto. | Prontuariantes |
| 2026-02-24 | 0.2 | Refinamento do escopo após reuniões de elicitação com o cliente. | Prontuariantes |
| 2026-03-10 | 0.3 | Definição da arquitetura documental e cadeia de autenticidade. | Prontuariantes |
| 2026-03-25 | 0.4 | Delimitação do escopo reduzido do MVP e revisão geral. | Prontuariantes |
| 2026-04-11 | 0.5 | Correções conforme revisão do professor; inclusão das seções 2.4 a 6. | Prontuariantes |
| 2026-04-13 | 0.6 | Últimas revisões antes da primeira entrega. | Prontuariantes |
| 2026-05-03 | 0.7 | Inclusão de lição aprendida sobre a adequação e reestruturação do cronograma com base em feedback e prazo letivo. | Prontuariantes |
| 2026-06-15 | 0.8 | Inclusão de lições aprendidas sobre a granularidade e qualidade dos requisitos, integridade da cadeia de rastreabilidade e validação prévia de requisitos com o cliente. | Prontuariantes |
| 2026-07-01 | 0.9 | Inclusão das lições aprendidas da Unidade 4, abordando a padronização da especificação dos casos de uso e o fortalecimento da rastreabilidade entre requisitos, casos de uso e backlog. | Prontuariantes |