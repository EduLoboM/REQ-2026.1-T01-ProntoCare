# Sprint 6 — Atas e Vídeos

**Período:** 08/06/2026 – 13/06/2026  
**Objetivo:** Operação offline (Armazenamento local)

---

## Reunião Planning — 05/06/2026 - 21h & Reunião Review — 06/06/2026 - 21h

| Participante | Planning | Review |
| :--- | :---: | :---: |
| Pedro | ❌ | ✅ |
| Eduardo | ❌ | ✅ |
| Luciano | ✅ | ✅ |
| Fábio | ❌ | ❌ |
| Uires | ✅ | ❌ |

- **User Stories / Requisitos Mapeados:**
    - **[RNF03] (Operação Offline)**: Salvamento e operação de dados cadastrais (pacientes) e clínicos (prontuários) em banco local (Dexie.js) mesmo sem conexão de rede.
    - **[RNF04] (Backup/Persistência Local)**: Garantia de persistência resiliente na camada de cliente antes da sincronização remota.
    - Aplicação de lógica offline para as User Stories do MVP (`US01` a `US04`, `US06`, `US07`).

- **Pontos principais:**
    - **Planning:**
        - **Validação Prévia de Requisitos com o Cliente:** Fica registrado que o requisito de arquitetura offline (`RNF03`), os fluxos de contingência em caso de queda de conexão e o uso da biblioteca Dexie.js para persistência local foram formalmente apresentados e validados com o cliente (Dr. Rogério Duarte) no início desta sprint, antes do início do desenvolvimento, garantindo o correto alinhamento dos fluxos de atendimento domiciliar itinerante.
        - Discussão de arquitetura de dados e transição de estado offline.
        - Definição do uso de Dexie.js (IndexedDB) e arquitetura PWA.
        - Distribuição de tarefas para os entregáveis da Unidade Acadêmica 3.
    - **Review:**
        - Apresentação e verificação do funcionamento básico em modo desconectado.
        - Preparação dos relatórios e slides para a apresentação da Unidade 3.
        - Alinhamento sobre as exigências de privacidade locais (criptografia local e LGPD).

## Vídeos

### Sprint 5 Review & Sprint 6 Planning

Infelizmente, a gravação da reunião Sprint 5 Review & Sprint 6 Planning foi corrompida, resultando na perda do arquivo.

### Sprint 6 Review & Sprint 7 Planning

<iframe width="560" height="315" src="https://www.youtube.com/embed/thvReTFckLQ?si=nw8wp0Y4kCrOUDEA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

acesse diretamente pelo link: [https://youtu.be/thvReTFckLQ](https://youtu.be/thvReTFckLQ)

## Entrega Parcial 3 - 14/06/2026

| Funcionalidade / Requisito | Verificado? (Equipe) | Validado? (Cliente) |
| --- | :---: | :---: |
| **[RNF03]** - Operação offline e persistência local (Dexie.js) para pacientes | ✅ | ✅ |
| **[RNF03]** - Operação offline e persistência local (Dexie.js) para prontuário SOAP | ✅ | ✅ |
| **[PWA Config]** - Manifesto e Service Workers para carregamento sem rede | ✅ | ✅ |

**Nota de Validação Clínica:** A arquitetura offline-first foi anteriormente validada em termos de necessidade assistencial e foi homologada na Review pelo Dr. Rogério Duarte após teste simulado de simulação de queda de internet.

<iframe width="560" height="315" src="https://www.youtube.com/embed/jJYnmwHTKl0?si=59eDSBUd4hIhV016" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
acesse diretamente pelo link: [https://youtu.be/jJYnmwHTKl0](https://youtu.be/jJYnmwHTKl0)

#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-06-08 | 0.1 | Elaboração das atas e vídeos da Sprint 6. | Prontuariantes |