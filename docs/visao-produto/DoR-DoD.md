## **9 DoR e DoD**

Esta seção apresenta as diretrizes de **Definition of Ready (DoR)** e **Definition of Done (DoD)** adotadas no framework ScrumXP do projeto ProntoCare. Em um sistema de saúde focado na gestão de prontuários, esses critérios funcionam como salvaguardas essenciais. O DoR evita que a equipe inicie o desenvolvimento de requisitos ambíguos ou bloqueados, enquanto o DoD estabelece a barra de qualidade técnica, jurídica (LGPD/CFM) e clínica que o incremento deve atingir antes de ser considerado pronto para entrega.

### **9.1 Definition of Ready (DoR)**

Como ponto de parada crítico antes do planejamento da sprint, cada História de Usuário (User Story) só será admitida se cumprir rigorosamente as seguintes condições de maturidade:

* **Estrutura de Declaração e Glossário (INVEST - Pequena e Negociável):** O item deve seguir o formato padrão orientado a valor:
> "Como **[perfil clínico/operacional]**, quero **[capacidade do sistema]**, para **[benefício real de negócio ou assistência]**".

* **Critérios de Aceitação e Testabilidade (INVEST - Testável):** Devem ser descritos por meio de condições diretamente observáveis e mensuráveis, cobrindo o fluxo nominal e as exceções da funcionalidade, detalhados em listas textuais por US na tabela de [Detalhamento do Sprint Backlog por US](../planejamento-organizacao/progresso-do-projeto.md#detalhamento-do-sprint-backlog-por-us). **Sendo proibido o uso de adjetivos vagos ou subjetivos** (como *"interface amigável"*, *"carregamento rápido"* ou *"notificar regularmente"*).
* **Validação com o Cliente (INVEST - Valioso):** O valor assistencial ou de negócio deve estar nítido. Para itens que envolvam dados sensíveis ou fluxos clínicos (SOAP, prescrições), é obrigatória uma **evidência registrada de homologação com o cliente** (seja via tag ou comentário no backlog), atestando que o Dr. Rogério validou os critérios de aceitação.
* **Visibilidade de Dependências e Riscos (INVEST - Independente):** Impedimentos técnicos de arquitetura (como chaves de criptografia, persistência local no PWA, ou módulos de assinatura) devem estar resolvidos ou mitigados. Os riscos principais associados ao item (como conformidade com a LGPD ou restrições do CFM) precisam estar explícitos no corpo do card.
* **Tamanho Ajustado e Estimabilidade (INVEST - Pequeno e Estimável):** A história deve ser compacta o suficiente para ser codificada, integrada e testada dentro de uma única sprint. A equipe técnica deve ter insumos suficientes para estimar o esforço de forma fundamentada (ex: em Pontos de História), sem incertezas impeditivas.

### **9.2 Definition of Done (DoD)**

Para garantir a estabilidade do ProntoCare, uma funcionalidade só será considerada concluída ("Pronta") se passar com sucesso pelo seguinte ciclo de validação técnica e colaborativa:

* **Validação Técnica e Cobertura de Testes:** O código deve passar por testes unitários e de integração automatizados. A entrega exige uma cobertura mínima de **70% geral do código** (linhas e ramificações). Em módulos críticos de segurança (como geração de cadeia de hash SHA-256 e assinatura digital ICP-Brasil), a cobertura obrigatória deve cobrir cenários de sucesso e falha simulada.
* **Revisão Colaborativa (Revisão de Código):** O código deve ser revisado e aprovado por pelo menos um desenvolvedor (normalmente o encarregado dos merges) e continuar a passar pelo pipeline de ci/cd. **O link do Pull Request (PR) aprovado no GitHub e a identificação do integrante responsável pela revisão devem ser registrados na seção de Governança do Repositório da User Story correspondente.** Nenhuma User Story será considerada "Pronta" sem esse registro linkado. A revisão garante o alinhamento com os padrões de arquitetura do projeto, a segurança no tratamento de dados sensíveis e a ausência de vulnerabilidades.
* **Garantia de Qualidade (QA):** A funcionalidade deve obter aprovação visual e funcional da equipe de QA, certificando o comportamento responsivo em múltiplos contextos de uso (desktop, tablet e smartphone, conforme o RNF06) e a estabilidade da operação offline (via Dexie.js), quando aplicável.
* **Conformidade Integral do Escopo:** Todos os critérios de aceitação refinados no DoR precisam ser satisfeitos em sua totalidade (conforme descritos em [Detalhamento do Sprint Backlog por US](../planejamento-organizacao/progresso-do-projeto.md#detalhamento-do-sprint-backlog-por-us)). Entregas parciais de critérios não são aceitas.
* **Documentação Atualizada:** Toda a documentação de apoio afetada pela alteração (comentários relevantes no código, arquivos README e documentação de endpoints de API) deve ser atualizada para refletir a implementação real.
* **Rastreabilidade Verificada:** A entrega deve estar explicitamente vinculada à cadeia de valor do projeto e ao repositório de código, permitindo auditorias futuras através do mapeamento:
> **OE → CP → RF → US → Critério de Aceitação → Teste → Issue → Pull Request → Entrega**

### **9.3 Evidência de Validação Clínica e Controle de Prontidão (DoR) (Removido)**

> [!NOTE]
> Esta seção foi transferida para o documento de [Planejamento e Quadro Figma](../planejamento-organizacao/planejamento.md#evidencia-de-validacao-clinica-e-controle-de-prontidao-dor) em Planejamento e Organização.

### **9.4 Matriz Operacional de Entregas sem Pull Request (Removido)**

> [!NOTE]
> Esta seção foi transferida para o documento de [Planejamento e Quadro Figma](../planejamento-organizacao/planejamento.md#matriz-operacional-de-entregas-sem-pull-request) em Planejamento e Organização.

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| --- | --- | --- | --- |
| 2026-05-18 | 0.1 | Elaboração e revisão inicial dos critérios de DoR e DoD. | Prontuariantes |
| 2026-06-14 | 0.2 | Consolidação do documento: adição da validação com o cliente (DoR) e métricas de cobertura de testes (DoD). | Prontuariantes |
| 2026-07-01 | 1.0 | Adição da seção 9.3 detalhando a evidência de validação das USs clínicas com o Dr. Rogério e o controle de DoR para entrada em sprint. | Prontuariantes |
| 2026-07-01 | 1.1 | Atualização de DoR e DoD com links explícitos direcionando para a tabela de detalhamento de critérios de aceitação das USs do MVP. | Prontuariantes |
| 2026-07-01 | 1.1 | Adição da seção 9.4 — Matriz Operacional de Entregas sem PR (Sprints 1–2). | Prontuariantes |
| 2026-07-01 | 1.2 | Expansão da seção 9.4: matriz atualizada para cobrir as Sprints 1 a 8 (0 PRs e 0 issues em todo o período). Adoção do processo formal de PR registrada a partir da Sprint 9. | Prontuariantes |
| 2026-07-01 | 1.3 | Alinhamento e completude de todas as 17 USs entregues sem PR nas Sprints 1, 3, 5 e 8 na matriz da seção 9.4, eliminando inconsistências com o backlog do MKDocs. | Prontuariantes |
| 2026-07-01 | 1.4 | Inclusão de todas as 22 USs do MVP na matriz de conformidade da seção 9.4, mapeando e registrando com precisão o status de PRs/Issues para cada item. | Prontuariantes |
| 2026-07-01 | 1.5 | Ajuste fino do status de PRs/Issues de acordo com as especificações do projeto real (US08, 10, 11, 12, 13, 15 com PR/Issue e demais sem). | Prontuariantes |
| 2026-07-01 | 1.6 | Correção de auditoria: DoD expandido para exigir textualmente link de PR aprovado e identificação do revisor como critério obrigatório de conclusão. Cadeia de rastreabilidade atualizada para incluir Issue e Pull Request. | Prontuariantes |
| 2026-07-01 | 1.7 | Correção das informações de governança: detalhamento sobre desenvolvimento em branches, merges diretos na dev sem PR/Issue, correções de sprints das USs 04, 06, 20 e 18 na matriz ordenada de 01 a 24, e remoção da ação de criação retroativa de Issues. | Prontuariantes |
| 2026-07-01 | 1.8 | Adição de links de rastreabilidade na matriz de entregas (9.4) apontando diretamente para o detalhamento e status das User Stories no progresso do projeto. | Prontuariantes |
| 2026-07-01 | 1.9 | Remoção das seções 9.3 e 9.4 (transferidas para o documento de Planejamento e Organização). | Prontuariantes |