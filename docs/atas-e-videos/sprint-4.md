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

- **Histórias de Usuário (US) Mapeadas:**
    - **[US08 / RF08]**: Assinatura digital do prontuário médico utilizando certificado padrão ICP-Brasil para garantir autoria, integridade e validade jurídica.
    - **[US09 / RF09] (Parcial)**: Modelagem estruturada do PDF do prontuário e geração de hash SHA-256 local para garantia de não adulteração.

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

## Vídeos

### Sprint 3 Review & Sprint 4 Planning

<iframe width="560" height="315" src="https://www.youtube.com/embed/pgax0OPZzBo?si=VWZ_7eZY1i3sMhl8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
acesse diretamente pelo link: [https://youtu.be/pgax0OPZzBo](https://youtu.be/pgax0OPZzBo)

### Sprint 4 Review & Sprint 5 Planning

<iframe width="560" height="315" src="https://www.youtube.com/embed/cl_W_ZMp95g?si=zdoS123dwDSSb2Ri" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
acesse diretamente pelo link: [https://youtu.be/cl_W_ZMp95g](https://youtu.be/cl_W_ZMp95g)

## Entrega Parcial (Homologação de Cadeia Criptográfica) - 30/05/2026

| Funcionalidade / História de Usuário | Verificado? (Equipe) | Validado? (Cliente) |
| --- | :---: | :---: |
| **[US08 / RF08]** - Lógica e infraestrutura de assinatura digital (ICP-Brasil) | ✅ | ✅ |
| **[US09 / RF09]** - Geração de hash SHA-256 para integridade do prontuário | ✅ | ✅ |

**Nota de Validação Clínica:** Os mecanismos de segurança, integridade com hash SHA-256 e fluxo de assinatura foram validados anteriormente quanto ao escopo assistencial e legal com o cliente Dr. Rogério Duarte, e homologados na reunião de Review através de testes com certificados simulados.

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-06-01 | 0.1 | Elaboração das atas e vídeos da Sprint 4. | Prontuariantes |