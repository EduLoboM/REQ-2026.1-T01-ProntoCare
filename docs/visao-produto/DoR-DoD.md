# DoR e DoD

## **9 DoR e DoD**

Esta seção apresenta os conceitos de **Definition of Ready (DoR)** e **Definition of Done (DoD)**, dois instrumentos fundamentais do framework ScrumXP adotado pelo projeto ProntoCare. No contexto de um sistema voltado à gestão de prontuários médicos e dados clínicos sensíveis, a adoção rigorosa dessas definições transcende a mera organização do fluxo ágil: ela atua como uma salvaguarda contra a introdução de funcionalidades incompletas ou insuficientemente validadas em um ambiente onde erros podem comprometer a segurança do paciente, a conformidade regulatória (LGPD, CFM) e a integridade documental. O DoR estabelece um limiar de qualidade e completude que cada item do backlog deve atingir antes de ser admitido em uma sprint, garantindo que a equipe não inicie trabalho sobre requisitos ambíguos ou tecnicamente bloqueados. Já o DoD define os critérios objetivos que determinam quando uma funcionalidade está genuinamente concluída — não apenas codificada, mas testada, revisada, integrada e validada sob a ótica clínica e técnica. Juntos, esses artefatos formam um contrato de qualidade interno que disciplina o ciclo de desenvolvimento e assegura que cada incremento entregue contribua de forma confiável para a construção do produto final.

### **9.1 Definition of Ready (DoR)**

Antes do início do desenvolvimento de cada funcionalidade, a equipe adota uma verificação ágil para garantir fluidez no fluxo de trabalho contínuo, minimizando cerimônias excessivas sem abrir mão do rigor necessário para um sistema de saúde. O objetivo é assegurar que o escopo transite pelas etapas de desenvolvimento sem interrupções, evitando retrabalho decorrente de requisitos mal compreendidos ou dependências não resolvidas — cenários especialmente custosos quando envolvem fluxos clínicos (SOAP), regras de negócio validadas pelo Dr. Rogério ou requisitos de segurança e privacidade. Para isso, a equipe verifica, antes do planejamento de cada sprint, se cada user story candidata atende aos seguintes critérios:

- **Clareza de Requisitos:** A tarefa possui uma descrição compreensível que define o objetivo da funcionalidade, o valor gerado para o sistema e o contexto clínico ou operacional em que será utilizada. A equipe deve ser capaz de explicar, em termos simples, o que será construído e por que esse item é necessário para o fluxo assistencial.

- **Critérios de Aceitação:** Foram estabelecidos critérios objetivos e testáveis que determinam as condições exatas para que a entrega seja considerada um sucesso. Esses critérios devem ser suficientemente específicos para orientar a implementação e permitir a verificação automatizada ou manual ao final da sprint, cobrindo cenários nominais, de borda e, quando aplicável, de conformidade regulatória.

- **Validação Clínica Prévia:** Para user stories que envolvem fluxos SOAP, regras clínicas, prescrição, prontuário ou dados sensíveis, o Dr. Rogério revisou e aprovou os critérios de aceitação e o comportamento esperado da funcionalidade, assegurando que o escopo reflita fielmente a prática do consultório.

- **Mapeamento de Impedimentos:** A equipe confirmou que não há impedimentos técnicos identificados, garantindo que dependências de arquitetura (como infraestrutura offline via PWA/Dexie.js, configuração de chaves de integração, cadeia de hash SHA-256 ou módulos de assinatura digital ICP-Brasil) estejam resolvidas ou possuam plano de mitigação antes de iniciar o código.

- **Estimativa de Esforço:** A user story foi estimada pela equipe quanto à complexidade técnica e ao esforço de implementação, permitindo a alocação realista dentro da capacidade da sprint.

### **9.2 Definition of Done (DoD)**

Para garantir a estabilidade e a segurança exigidas por um sistema de saúde, a funcionalidade será considerada concluída apenas se cumprir um rigoroso ciclo de validação técnica e revisão colaborativa. Esse processo atesta que o recurso não apenas funciona localmente, mas está integrado, testado e em conformidade com as exigências do projeto, englobando desde a infraestrutura do código até a experiência do usuário final. No domínio clínico do ProntoCare, onde a integridade de prontuários e a rastreabilidade de ações possuem implicações legais e éticas, a DoD funciona como a última barreira de qualidade antes que um incremento seja considerado apto para entrega.

- **Validação Técnica:** A funcionalidade passou por testes unitários e de integração, garantindo que o novo código não quebre o sistema existente. Para módulos que envolvem dados sensíveis ou criptografia (ex.: cadeia de hash, assinatura digital), os testes devem cobrir cenários de integridade e de falha.

- **Revisão Colaborativa:** Houve revisão de código por par (Code Review) no GitHub, assegurando a qualidade, segurança e manutenibilidade da implementação. A revisão verifica, minimamente, a aderência aos padrões de código do projeto, o tratamento adequado de dados sensíveis e a ausência de vulnerabilidades conhecidas.

- **Garantia de Qualidade:** A entrega obteve aprovação visual e funcional pela equipe de QA, certificando que a interface e as integrações respondem conforme o esperado em diferentes contextos de uso (desktop, tablet e smartphone, conforme RNF06), e que o comportamento offline, quando aplicável, está operando corretamente.

- **Conformidade com o Escopo:** Houve validação de todos os critérios de aceitação definidos no DoR, confirmando que a funcionalidade cumpre exatamente o que foi proposto. Nenhum critério de aceitação pode ser parcialmente atendido: a entrega deve satisfazer integralmente cada condição estabelecida.

- **Documentação Atualizada:** A documentação técnica relevante (comentários no código, README, endpoints de API) foi atualizada para refletir a funcionalidade implementada, garantindo que futuros desenvolvedores consigam compreender e manter o módulo sem ambiguidade.

- **Rastreabilidade Verificada:** A funcionalidade entregue está vinculada ao requisito funcional (RF), à user story e aos RNFs correspondentes na cadeia de rastreabilidade do projeto (OE → CP → RF → US → critério de aceitação → teste → entrega), permitindo auditoria futura do processo de desenvolvimento.

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-05-18 | 0.1 | Elaboração e revisão dos critérios de DoR e DoD. | Prontuariantes |

