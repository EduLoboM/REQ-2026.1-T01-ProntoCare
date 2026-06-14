## **9 DoR e DoD**

Esta seção apresenta as diretrizes de **Definition of Ready (DoR)** e **Definition of Done (DoD)** adotadas no framework ScrumXP do projeto ProntoCare. Em um sistema de saúde focado na gestão de prontuários, esses critérios funcionam como salvaguardas essenciais. O DoR evita que a equipe inicie o desenvolvimento de requisitos ambíguos ou bloqueados, enquanto o DoD estabelece a barra de qualidade técnica, jurídica (LGPD/CFM) e clínica que o incremento deve atingir antes de ser considerado pronto para entrega.

### **9.1 Definition of Ready (DoR)**

Como ponto de parada crítico antes do planejamento da sprint, cada História de Usuário (User Story) só será admitida se cumprir rigorosamente as seguintes condições de maturidade:

* **Estrutura de Declaração e Glossário (INVEST - Pequena e Negociável):** O item deve seguir o formato padrão orientado a valor:
> "Como **[perfil clínico/operacional]**, quero **[capacidade do sistema]**, para **[benefício real de negócio ou assistência]**".

* **Critérios de Aceitação e Testabilidade (INVEST - Testável):** Devem ser descritos por meio de condições diretamente observáveis e mensuráveis, cobrindo o fluxo nominal e as exceções da funcionalidade. **Sendo proibido o uso de adjetivos vagos ou subjetivos** (como *"interface amigável"*, *"carregamento rápido"* ou *"notificar regularmente"*).
* **Validação com o Cliente (INVEST - Valioso):** O valor assistencial ou de negócio deve estar nítido. Para itens que envolvam dados sensíveis ou fluxos clínicos (SOAP, prescrições), é obrigatória uma **evidência registrada de homologação com o cliente** (seja via tag ou comentário no backlog), atestando que o Dr. Rogério validou os critérios de aceitação.
* **Visibilidade de Dependências e Riscos (INVEST - Independente):** Impedimentos técnicos de arquitetura (como chaves de criptografia, persistência local no PWA, ou módulos de assinatura) devem estar resolvidos ou mitigados. Os riscos principais associados ao item (como conformidade com a LGPD ou restrições do CFM) precisam estar explícitos no corpo do card.
* **Tamanho Ajustado e Estimabilidade (INVEST - Pequeno e Estimável):** A história deve ser compacta o suficiente para ser codificada, integrada e testada dentro de uma única sprint. A equipe técnica deve ter insumos suficientes para estimar o esforço de forma fundamentada (ex: em Pontos de História), sem incertezas impeditivas.

### **9.2 Definition of Done (DoD)**

Para garantir a estabilidade do ProntoCare, uma funcionalidade só será considerada concluída ("Pronta") se passar com sucesso pelo seguinte ciclo de validação técnica e colaborativa:

* **Validação Técnica e Cobertura de Testes:** O código deve passar por testes unitários e de integração automatizados. A entrega exige uma cobertura mínima de **70% geral do código** (linhas e ramificações). Em módulos críticos de segurança (como geração de cadeia de hash SHA-256 e assinatura digital ICP-Brasil), a cobertura obrigatória deve cobrir cenários de sucesso e falha simulada.
* **Revisão Colaborativa (Revisão de Código):** O código deve ser revisado e aprovado por pelo menos um desenvolvedor (normalmente o encarregado dos merges) e continuar a passar pelo pipeline de ci/cd. A revisão garante o alinhamento com os padrões de arquitetura do projeto, a segurança no tratamento de dados sensíveis e a ausência de vulnerabilidades.
* **Garantia de Qualidade (QA):** A funcionalidade deve obter aprovação visual e funcional da equipe de QA, certificando o comportamento responsivo em múltiplos contextos de uso (desktop, tablet e smartphone, conforme o RNF06) e a estabilidade da operação offline (via Dexie.js), quando aplicável.
* **Conformidade Integral do Escopo:** Todos os critérios de aceitação refinados no DoR precisam ser satisfeitos em sua totalidade. Entregas parciais de critérios não são aceitas.
* **Documentação Atualizada:** Toda a documentação de apoio afetada pela alteração (comentários relevantes no código, arquivos README e documentação de endpoints de API) deve ser atualizada para refletir a implementação real.
* **Rastreabilidade Verificada:** A entrega deve estar explicitamente vinculada à cadeia de valor do projeto, permitindo auditorias futuras através do mapeamento:
> **OE → CP → RF → US → Critério de Aceitação → Teste → Entrega**

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| --- | --- | --- | --- |
| 2026-05-18 | 0.1 | Elaboração e revisão inicial dos critérios de DoR e DoD. | Prontuariantes |
| 2026-06-14 | 0.2 | Consolidação do documento: adição da validação com o cliente (DoR) e métricas de cobertura de testes (DoD). | Prontuariantes |