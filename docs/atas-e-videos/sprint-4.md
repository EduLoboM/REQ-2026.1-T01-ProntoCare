# Sprint 4 — Atas e Vídeos

**Período:** 24/05/2026 – 30/05/2026  
**Objetivo:** Integridade documental

---

## Reunião Planning — 23/05/2026 - 21h & Reunião Review — 30/05/2026 - 21h

| Participante | Planning | Review |
| :--- | :---: | :---: |
| Pedro | ✅ | ❌ |
| Eduardo | ✅ | ✅ |
| Luciano | ✅ | ✅ |
| Fábio | ✅ | ✅ |
| Uires | ✅ | ✅ |

- **User Stories / Requisitos Mapeados:**
    - **[RNF05]**: Segurança e Conformidade CFM/SBIS (Exigências para a certificação SBIS e resoluções do CFM).
    - **[RNF09]**: Assinatura digital utilizando certificado padrão ICP-Brasil (Não-repúdio e autoria).

- **Pontos principais:**
    - **Planning:**
        - **Validação Prévia de Requisitos com o Cliente:** Fica registrado que as especificações e critérios das User Stories (`US08` e `US09`), focadas em integridade documental e assinatura ICP-Brasil, assim como os requisitos não funcionais (`RNF05` e `RNF08`), foram formalmente apresentados e validados com o cliente (Dr. Rogério Duarte) no início desta sprint, antes do início do desenvolvimento, garantindo o correto alinhamento dos fluxos de segurança e hashing.
        - Validação detalhada das entregas anteriores de prontuários.
        - Definição formal da arquitetura de segurança do sistema.
        - Estudo comparativo de concorrentes de mercado e suas abordagens para integridade de dados clínicos.
    - **Review:**
        - Validação e consolidação da arquitetura criptográfica.
        - Discussão sobre o algoritmo de hashing SHA-256 (Web Crypto API) para garantir integridade.
        - Apresentação do estado atual do sistema com a funcionalidade de geração de hash.

## Daily Scrum

- Durante o período, foram conduzidas as seguintes reuniões Daily Scrum:
    - **24/05/2026** - 20h as 22h
    - **25/05/2026** - 10h as 10h15
    - **26/05/2026** - 20h as 22h
    - **27/05/2026** - 10h as 10h15
    - **29/05/2026** - 20h as 22h

## Vídeos

### Sprint 3 Review & Sprint 4 Planning

<iframe width="560" height="315" src="https://www.youtube.com/embed/pgax0OPZzBo?si=VWZ_7eZY1i3sMhl8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
acesse diretamente pelo link: [https://youtu.be/pgax0OPZzBo](https://youtu.be/pgax0OPZzBo)

### Sprint 4 Review & Sprint 5 Planning

<iframe width="560" height="315" src="https://www.youtube.com/embed/cl_W_ZMp95g?si=zdoS123dwDSSb2Ri" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
acesse diretamente pelo link: [https://youtu.be/cl_W_ZMp95g](https://youtu.be/cl_W_ZMp95g)

## Validação e Homologação (Requisitos Não Funcionais) - 30/05/2026

| Requisito Não Funcional / Conformidade | Verificado? (Equipe) | Validado? (Cliente) |
| --- | :---: | :---: |
| **[RNF05]** - Estrutura de conformidade CFM/SBIS para documentos | ✅ | ✅ |
| **[RNF09]** - Lógica e infraestrutura de assinatura digital (ICP-Brasil) | ✅ | ✅ |

**Nota de Validação Clínica:** Os mecanismos de segurança, integridade com hash SHA-256 e fluxo de assinatura foram validados anteriormente quanto ao escopo assistencial e legal com o cliente Dr. Rogério Duarte, e homologados na reunião de Review através de testes com certificados simulados.

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-06-01 | 0.1 | Elaboração das atas e vídeos da Sprint 4. | Prontuariantes |
| 2026-06-29 | 0.2 | Correção do mapeamento de requisitos de segurança e conformidade. | Prontuariantes |