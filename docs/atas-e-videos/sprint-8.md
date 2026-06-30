# Sprint 8 — Atas e Vídeos

**Período:** 21/06/2026 – 27/06/2026  
**Objetivo:** Conformidade LGPD e Proteção de Dados

---

## Reunião Planning — 21/06/2026 - 21h & Reunião Review — 27/06/2026 - 21h

| Participante | Planning | Review |
| :--- | :---: | :---: |
| Pedro | ✅ | ✅ |
| Eduardo | ✅ | ✅ |
| Luciano | ✅ | ✅ |
| Fábio | ✅ | ✅ |
| Uires | ✅ | ✅ |

- **User Stories / Requisitos Mapeados:**
    - **[US10 / RF10]**: Visualizar calendário semanal de consultas.
    - **[US11 / RF11]**: Agendar consultas e/ou teleconsultas.
    - **[US12 / RF12]**: Listar consultas do dia.
    - **[US13 / RF13]**: Alterar status de uma consulta do dia atual (Agendado, Em atendimento, Finalizado).
    - **[RNF05]**: Conformidade CFM/SBIS (Garantia de que os módulos cumpram exigências legais e NGS).
    - **[RNF02]**: Criptografia de dados sensíveis e senhas utilizando `bcrypt` no banco de dados.

- **Pontos principais:**
    - **Planning:**
        - **Validação Prévia de Requisitos com o Cliente:** Fica registrado que as especificações técnicas para criptografia com bcrypt (`RNF02`) e conformidade CFM (`RNF05`) foram formalmente validadas com o cliente Dr. Rogério Duarte.
        - Discussão sobre diretrizes da LGPD aplicadas à persistência e trânsito de prontuários.
        - Definição do processo de auditoria de segurança das senhas dos usuários.
    - **Review:**
        - Verificação do armazenamento seguro de credenciais na base piloto.
        - Homologação do relatório de auditoria e validações de acesso para LGPD.

## Daily Scrum

- Durante o período, foram conduzidas as seguintes reuniões Daily Scrum:
    - **22/06/2026** - 20h as 22h
    - **23/06/2026** - 10h as 10h15
    - **24/06/2026** - 20h as 22h
    - **25/06/2026** - 10h as 10h15
    - **27/06/2026** - 20h as 22h

## Vídeos

### Sprint 7 Review & Sprint 8 Planning

<iframe width="560" height="315" src="https://www.youtube.com/embed/kc-yVsL0lOg?si=sBOItCt3nU16H5ZF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

acesse diretamente pelo link: [https://youtu.be/kc-yVsL0lOg](https://youtu.be/kc-yVsL0lOg)

### Sprint 8 Review & Sprint 9 Planning

<iframe width="560" height="315" src="https://www.youtube.com/embed/la-cM83mW_8?si=Ezy5jZHeiiJtp7Ku" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

acesse diretamente pelo link: [https://youtu.be/la-cM83mW_8](https://youtu.be/la-cM83mW_8)

## Validação e Homologação - 27/06/2026

| Funcionalidade / Requisito / Conformidade | Verificado? (Equipe) | Validado? (Cliente) |
| --- | :---: | :---: |
| **[US10 / RF10]** - Interface de calendário semanal de consultas | ✅ | ✅ |
| **[US11 / RF11]** - Lógica e agendamento de consultas / teleconsultas | ✅ | ✅ |
| **[US12 / RF12]** - Listagem cronológica de consultas do dia no painel | ✅ | ✅ |
| **[US13 / RF13]** - Alteração de status da consulta em tempo real | ✅ | ✅ |
| **[RNF05]** - Conformidade SBIS/CFM para armazenamento | ✅ | ✅ |
| **[RNF02]** - Criptografia de senhas com bcrypt no banco | ✅ | ✅ |

**Nota de Validação Clínica:** O Dr. Rogério Duarte validou a conformidade dos esquemas de segurança implementados na Review, verificando que os prontuários e acessos atendem aos critérios de confidencialidade clínica exigidos.

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-06-27 | 0.1 | Elaboração da ata da Sprint 8. | Prontuariantes |
| 2026-06-29 | 0.2 | Atualização da ata com os requisitos de agenda e consultas concluídos. | Prontuariantes |
