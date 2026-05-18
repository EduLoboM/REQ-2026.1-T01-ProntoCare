# Lições aprendidas

### Lições aprendidas

#### 10.1 Unidade 1

Durante o desenvolvimento inicial do projeto do ProntoCare, várias lições importantes foram aprendidas que irão influenciar as próximas fases. Abaixo estão as lições aprendidas, focando nas ações de melhoria, desafios enfrentados e como foram (ou não) superados.

##### Lições Aprendidas e Melhorias para o Processo

1. **Elicitação e Validação Contínua da Interface com o Cliente**

    - **Desafio:** Observou-se sob a perspectiva operacional que o médico adota há anos uma rotina de atendimento fortemente apoiada em registros físicos em papel. O grande desafio era garantir que a interface do ProntoCare apresentasse uma usabilidade elevada o suficiente para que a adaptação não demandasse treinamento extensivo e nem comprometesse a fluidez das consultas.

    - **Ação de Melhoria:** A equipe optou pela abordagem ágil ScrumXP , que permite validações frequentes com o cliente e flexibilidade de requisitos. Além disso, estabeleceu-se a criação de protótipos e wireframes na fase de Representação, assegurando o alinhamento visual e clínico da interface do prontuário SOAP antes do desenvolvimento.

2. **Gerenciamento do Escopo Frente ao Prazo Acadêmico**

    - **Desafio:** O projeto possuía desafios restritivos, como um cronograma acadêmico fixo de 3 a 4 meses, equipe estudantil e a exigência de ferramentas com custo zero. Tentar abraçar todo o ciclo assistencial de imediato tornou-se inviável.

    - **Ação de Melhoria:** Em reunião de elicitação com o Dr. Rogério, a equipe levantou as principais dores do consultório e, durante a própria conversa, aplicou a técnica de priorização MoSCoW junto com o cliente, classificando funcionalidades e delimitando o MVP de forma colaborativa. Embora o encontro não tenha sido gravado em áudio ou vídeo, as evidências de sua realização e as tratativas com o cliente encontram-se devidamente registradas no histórico de conversas do WhatsApp. O MVP concentra-se no essencial: prontuário SOAP com folha de rosto, operação offline com sincronização e exportação de dados (JSON, PDF). A conformidade com a LGPD é tratada de forma incremental — controles básicos de acesso, privacidade de dados sensíveis e logs de auditoria fazem parte do MVP, enquanto a conformidade completa (portal de direitos do titular, consentimento granular, relatórios de impacto) fica no backlog de visão futura. Módulos como emissão de receitas médicas e telemedicina poderão ser incorporados nas sprints finais do semestre, caso o ritmo de entrega permita, ou encaminhados para evolução pós-disciplina. A lista de priorização resultante e a delimitação final do escopo do MVP serão validadas formalmente até a entrega da Unidade 2, momento em que a equipe apresentará os artefatos atualizados e o backlog refinado ao professor e ao cliente para verificação de aderência ao planejamento.

        - **Ata de Reunião de Elicitação — 24/04/2026**

        | Participante | Presença |
        | :--- | :---: |
        | Pedro | ✅ |
        | Eduardo | ✅ |
        | Luciano | ✅ |
        | Fábio | ✅ |
        | Uires | ✅ |

        - **Pontos discutidos:**
            - Fluxo do cadastro de pacientes e seus dados
            - Registro de queixas, histórico e evolução clínica do paciente
            - Ferramentas usadas pelo cliente: e-SUS, WhiteBook, BlackBook e TrackCare
            - Dificuldades do cliente com prescrição eletrônica e assinatura digital
            - Exportação de dados como requisito crítico
            - Arquitetura cliente-servidor com modo offline
            - Registro de documentos do paciente com exportação e histórico de controle

3. **Adequação do Cronograma ao Modelo Ágil e Prazo Letivo**

    - **Desafio:** O cronograma original apresentava traços de um modelo sequencial ("mini-cascata"), com sprints finais dedicadas exclusivamente a integração e testes, além de tratar os Requisitos Não-Funcionais (RNFs) apenas como entregas isoladas. Havia também a dificuldade de encaixar as 9 sprints propostas no tempo de fato restante no semestre letivo (aproximadamente 12 semanas, encerrando por volta de 13/07/2026).

    - **Ação de Melhoria:** Com base no feedback do professor e na contagem de tempo real, o cronograma foi totalmente reestruturado. Condensamos o planejamento para 6 sprints com duração fixa e exata de 2 semanas. A abordagem sequencial foi eliminada em favor da integração contínua real: agora, cada sprint entrega um incremento funcional, testado e integrado. Além disso, todos os RNFs críticos (segurança, privacidade e auditoria) e as Características de Produto (CPs) passaram a cruzar transversalmente as sprints desde o início, garantindo rastreabilidade e qualidade ao longo de todo o desenvolvimento.

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