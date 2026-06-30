# Sprint 5 — Atas e Vídeos

**Período:** 31/05/2026 – 06/06/2026  
**Objetivo:** Exportação de dados e Auditoria

---

## Reunião Planning — 30/05/2026 - 21h & Reunião Review — 06/06/2026 - 21h

| Participante | Planning | Review |
| :--- | :---: | :---: |
| Pedro | ✅ | ❌ |
| Eduardo | ✅ | ✅ |
| Luciano | ✅ | ✅ |
| Fábio | ✅ | ✅ |
| Uires | ✅ | ✅ |

- **Histórias de Usuário / Requisitos Mapeados:**
    - **[RNF03]**: Operação offline (banco local via Dexie.js).
    - **[RNF04]**: Rotina automática de backup diário na nuvem.
    - **[US08 / RF08]**: Assinatura digital do prontuário médico utilizando certificado padrão ICP-Brasil.

- **Pontos principais:**
    - **Planning:**
        - **Validação Prévia de Requisitos com o Cliente:** Fica registrado que as User Stories de exportação e auditoria (`US05`, `US09` e `US24`), bem como os requisitos transversais de conformidade com LGPD (`RNF01` - logs de auditoria), foram formalmente apresentados e validados junto ao cliente (Dr. Rogério Duarte) no início desta sprint, antes de iniciar o desenvolvimento, definindo a estrutura do relatório de logs e formato de PDF e JSON.
        - Discussão sobre arquitetura de dados e integridade de exportações.
        - Definição técnica dos schemas JSON e layout de PDF.
        - Planejamento prévio da implementação de operação offline (Dexie.js) e PWA.
    - **Review:**
        - Verificação e alinhamento sobre a estrutura de dados gerada nos PDFs e JSON.
        - Homologação da interface de logs de auditoria.
        - Preparação dos entregáveis e relatórios para a Unidade Acadêmica 3.

## Daily Scrum

- Durante o período, foram conduzidas as seguintes reuniões Daily Scrum:
    - **31/05/2026** - 20h as 22h
    - **01/06/2026** - 10h as 10h15
    - **02/06/2026** - 20h as 22h
    - **03/06/2026** - 10h as 10h15
    - **05/06/2026** - 20h as 22h

## Vídeos

### Sprint 4 Review & Sprint 5 Planning

<iframe width="560" height="315" src="https://www.youtube.com/embed/cl_W_ZMp95g?si=zdoS123dwDSSb2Ri" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
acesse diretamente pelo link: [https://youtu.be/cl_W_ZMp95g](https://youtu.be/cl_W_ZMp95g)

### Sprint 5 Review & Sprint 6 Planning

Infelizmente, a gravação da reunião Sprint 5 Review & Sprint 6 Planning foi corrompida, resultando na perda do arquivo.

## Validação e Homologação (Offline e Assinatura) - 06/06/2026

| Requisito / História de Usuário | Verificado? (Equipe) | Validado? (Cliente) |
| --- | :---: | :---: |
| **[RNF03]** - Operação offline e banco local Dexie.js | ✅ | ✅ |
| **[RNF04]** - Lógica e infraestrutura de backup automático | ✅ | ✅ |
| **[US08 / RF08]** - Assinatura digital de prontuário (ICP-Brasil) | ✅ | ✅ |

**Nota de Validação Clínica:** Os relatórios de auditoria e a saída estruturada em PDF foram homologados e validados anteriormente com o cliente Dr. Rogério Duarte na Review, atestando conformidade com as regras de sigilo e necessidades do consultório.

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-06-08 | 0.1 | Elaboração das atas e vídeos da Sprint 5. | Prontuariantes |
| 2026-06-29 | 0.2 | Correção do mapeamento de requisitos de offline e assinatura. | Prontuariantes |