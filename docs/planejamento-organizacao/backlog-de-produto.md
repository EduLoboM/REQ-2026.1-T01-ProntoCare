# **Backlog de Produto e Definição de MVP**

Este documento apresenta uma versão resumida e focada do backlog do ProntoCare e do seu Produto Mínimo Viável (MVP), detalhando as justificativas de conformidade e as evidências de prontidão.

> :material-link: A especificação completa de todas as User Stories, escalas de priorização e a análise quantitativa detalhada por quadrantes podem ser acessadas em [Backlog de Produto Completo (Visão do Produto)](../visao-produto/backlog-de-produto.md).

---

## **1. Justificativa de Itens Regulatórios de Alta Complexidade no MVP**

Embora a escala de priorização e a definição de limiares técnicos recomendem cautela e fatiamento ou exclusão de requisitos com Pontuação Técnica (PT) elevada (PT > 2.5), certas Histórias de Usuário foram obrigatoriamente mantidas no MVP devido a restrições legais e regulatórias do setor de saúde brasileiro. A exclusão de qualquer um desses itens resultaria em um produto juridicamente inviável (não conforme) para uso em clínicas piloto. Abaixo detalham-se as justificativas para a retenção de cada um desses requisitos de alta complexidade técnica:

* **US08 — Assinatura Digital do Prontuário com Certificado ICP-Brasil (PT = 3.5):**
    * *Contexto Regulatório:* Lei nº 13.787/2018 (que dispõe sobre a digitalização e a utilização de sistemas de registro eletrônico de saúde) e a Resolução CFM nº 2.299/2021 do Conselho Federal de Medicina.
    * *Justificativa:* Para que um prontuário médico puramente eletrônico tenha validade jurídica e substitua em definitivo o papel, os registros clínicos digitais precisam de garantia inequívoca de autoria, integridade e não-repúdio. No Brasil, essa garantia só é conferida legalmente por meio de assinaturas digitais qualificadas que utilizam certificados ICP-Brasil (como tokens A3 ou PSC). Sem essa funcionalidade, o médico seria obrigado a imprimir e assinar fisicamente cada atendimento para fins legais, anulando os benefícios operacionais do MVP.
* **US15 — Assinatura Digital da Receita com Certificado ICP-Brasil (PT = 3.0):**
    * *Contexto Regulatório:* Portaria SVS/MS nº 344/1998, Lei Federal nº 14.063/2020 e resoluções vigentes da ANVISA e do CFM.
    * *Justificativa:* A emissão de receitas médicas por meios eletrônicos (especialmente para medicamentos de controle especial) exige a assinatura digital com certificado ICP-Brasil para que seja aceita por farmácias físicas em todo o território nacional. Sem a possibilidade de assinar digitalmente a prescrição dentro do sistema, o fluxo do paciente seria quebrado, obrigando-o a retornar ao consultório apenas para retirar a receita impressa assinada de forma manual.
* **US24 — Visualização e Filtro de Logs de Auditoria para Conformidade com a LGPD (PT = 3.0):**
    * *Contexto Regulatório:* Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018, Artigos 7º, 11 e 13) e normas da SBIS (Sociedade Brasileira de Informática em Saúde) aplicadas à segurança da informação em saúde (NGS).
    * *Justificativa:* Prontuários e fichas SOAP armazenam dados de saúde, classificados pela LGPD como "dados pessoais sensíveis", cujo tratamento exige salvaguardas adicionais. A lei impõe a obrigatoriedade de rastreamento absoluto de acessos, criações, edições e exclusões de registros de saúde. O log de auditoria é a única evidência técnica aceitável para mitigar a responsabilidade jurídica e administrativa da clínica em caso de vazamento de dados ou acessos indevidos por terceiros.

---

## **2. Evidência de Validação das US Clínicas Críticas**

Em resposta ao feedback de auditoria de requisitos do projeto ProntoCare, detalha-se a seguir a comprovação de validação clínica com o cliente das US Clínicas Críticas:

* **Validação das USs Clínicas pelo Cliente:** A validação do escopo e dos critérios de aceitação de todas as histórias clínicas (SOAP, histórico clínico, receitas e segurança) foi realizada pelo Dr. Rogério Duarte de forma conjunta durante a **Reunião de Elicitação e Priorização do MVP (24/04/2026)**. Nessa oportunidade, o cliente atestou o valor das histórias e as classificou quanto ao valor de negócio, garantindo que o escopo clínico inicial estivesse plenamente homologado.
    * **Evidência Documentada:** [Ata da Reunião da Sprint 0](../atas-e-videos/sprint-0.md) e [Vídeo da Reunião de Elicitação no YouTube](https://youtu.be/QuqCF0-1avU).

---

## **3. Definição Resumida do Escopo do MVP**

O MVP foi composto pelas User Stories avaliadas como prioritárias (Quadrantes 1 e 2) na matriz de priorização. 

> :material-bulletin-board: O andamento e status de cada item podem ser consultados diretamente no [Quadro Figma (Figma Board)](https://www.figma.com/board/0vnXsFutjGoQcCT6oQQ2lX/Prontuariantes?node-id=0-1&t=7WDzylophLcdH6TL-1).

### **Tabela Resumida do MVP**

| ID da US | Requisito Relacionado | No MVP? | Categoria / Descrição Resumida | Endpoint de Deploy |
| :---: | :---: | :---: | :--- | :--- |
| **US01** | **RF01** | Sim | Cadastro de pacientes | [https://portalprontocare.netlify.app/register](https://portalprontocare.netlify.app/register) |
| **US02** | **RF02** | Sim | Edição de dados cadastrais | [https://portalprontocare.netlify.app/edit-paciente/:id](https://portalprontocare.netlify.app/edit-paciente/:id) |
| **US03** | **RF03** | Sim | Inativação lógica de registros | [https://portalprontocare.netlify.app/medico](https://portalprontocare.netlify.app/medico) |
| **US04** | **RF04** | Sim | Busca e listagem de pacientes | [https://portalprontocare.netlify.app/medico](https://portalprontocare.netlify.app/medico) |
| **US05** | **RF05** | Sim | Exportação de base JSON (Portabilidade) | [https://portalprontocare.netlify.app/medico](https://portalprontocare.netlify.app/medico) |
| **US06** | **RF06** | Sim | Prontuário SOAP estruturado | [https://portalprontocare.netlify.app/atendimento/:pacienteId](https://portalprontocare.netlify.app/atendimento/:pacienteId) |
| **US07** | **RF07** | Sim | Linha do tempo / histórico assistencial | [https://portalprontocare.netlify.app/paciente-detalhe/:id](https://portalprontocare.netlify.app/paciente-detalhe/:id) |
| **US08** | **RF08** | Sim | Assinatura digital ICP-Brasil de prontuários | [https://portalprontocare.netlify.app/paciente-detalhe/:id](https://portalprontocare.netlify.app/paciente-detalhe/:id) |
| **US09** | **RF09** | Sim | Exportação estruturada em PDF | [https://portalprontocare.netlify.app/paciente-detalhe/:id](https://portalprontocare.netlify.app/paciente-detalhe/:id) |
| **US10** | **RF10** | Sim | Agenda semanal de consultas | [https://portalprontocare.netlify.app/medico](https://portalprontocare.netlify.app/medico) |
| **US11** | **RF11** | Sim | Marcação de consultas e teleconsultas | [https://portalprontocare.netlify.app/medico](https://portalprontocare.netlify.app/medico) |
| **US12** | **RF12** | Sim | Listagem de atendimentos do dia | [https://portalprontocare.netlify.app/medico](https://portalprontocare.netlify.app/medico) |
| **US13** | **RF13** | Sim | Gestão de status do atendimento | [https://portalprontocare.netlify.app/medico](https://portalprontocare.netlify.app/medico) |
| **US14** | **RF14** | Sim | Emissão de receitas médicas digitais | [https://portalprontocare.netlify.app/prescricao/:pacienteId](https://portalprontocare.netlify.app/prescricao/:pacienteId) |
| **US15** | **RF15** | Sim | Assinatura digital ICP-Brasil de receitas | [https://portalprontocare.netlify.app/prescricao/:pacienteId](https://portalprontocare.netlify.app/prescricao/:pacienteId) |
| **US16** | **RF16** | Sim | Exportação da receita em PDF | [https://portalprontocare.netlify.app/prescricao/:pacienteId](https://portalprontocare.netlify.app/prescricao/:pacienteId) |
| **US18** | **RF18** | Sim | Histórico de receitas médicas do paciente | [https://portalprontocare.netlify.app/prescricao/:pacienteId](https://portalprontocare.netlify.app/prescricao/:pacienteId) |
| **US20** | **RF20** | Sim | Cadastro administrativo de novos médicos | [https://portalprontocare.netlify.app/admin](https://portalprontocare.netlify.app/admin) |
| **US21** | **RF21** | Sim | Edição e permissões de acesso médico (RBAC) | [https://portalprontocare.netlify.app/admin](https://portalprontocare.netlify.app/admin) |
| **US22** | **RF22** | Sim | Inativação de perfis profissionais | [https://portalprontocare.netlify.app/admin](https://portalprontocare.netlify.app/admin) |
| **US23** | **RF23** | Sim | Busca e listagem de profissionais médicos | [https://portalprontocare.netlify.app/admin](https://portalprontocare.netlify.app/admin) |
| **US24** | **RF24** | Sim | Rastreabilidade e logs de auditoria (LGPD) | [https://portalprontocare.netlify.app/admin](https://portalprontocare.netlify.app/admin) |

---

## **4. Histórico de Revisões**

| Data | Versão | Descrição | Autor |
| :---: | :---: | :--- | :---: |
| 2026-05-18 | 0.1 | Elaboração e revisão do backlog de produto, modelo de priorização por quadrantes e definição do MVP. | Prontuariantes |
| 2026-06-13 | 0.2 | Decomposição de user stories agregadas de consultas e perfis para consistência com o nível detalhado de requisitos. | Prontuariantes |
| 2026-06-13 | 0.3 | Fusão de user stories de prontuário, anamnese e anexos em US06 integrados ao histórico clínico para conformidade do domínio. | Prontuariantes |
| 2026-06-13 | 0.4 | Refinamento dos vínculos RNF ↔ RF, removendo mapeamentos para RNFs globais de usabilidade e responsividade das USs. | Prontuariantes |
| 2026-06-13 | 0.5 | Unificação das tabelas de backlog e priorização, e remoção da duplicação de descrições na tabela do MVP por meio de referências. | Prontuariantes |
| 2026-06-13 | 0.6 | Definição formal das escalas numéricas de VB, CX, ES e justificativa dos limiares de priorização. | Prontuariantes |
| 2026-06-13 | 0.7 | Unificação de user stories de cadastro e perfil de acesso de pacientes (US01-US04 com US24-US27), e reordenação de logs de auditoria para US24. | Prontuariantes |
| 2026-06-29 | 0.8 | Adição da seção 10.3 com critérios de aceitação detalhados e refinados pós-feedback do cliente Dr. Rogério. | Prontuariantes |
| 2026-06-30 | 0.9 | Reformulação de todos os critérios de aceitação refinados na seção 10.3 para o padrão de especificação formal Gherkin (Dado/Quando/Então). | Prontuariantes |
| 2026-07-01 | 1.0 | Adição da subseção 10.2.1 justificando os itens regulatórios de alta complexidade (US08, US15 e US24) mantidos no MVP. | Prontuariantes |
| 2026-07-01 | 1.1 | Adição da seção 10.2.2 detalhando evidência de validação das USs clínicas pelo Dr. Rogério e o controle de DoR para entrada em sprint. | Prontuariantes |
| 2026-07-01 | 2.0 | Separação em duas versões (completa para Visão de Produto e resumida para Planejamento-Organização starting at section 1). | Prontuariantes |
| 2026-07-01 | 2.1 | Inclusão de coluna com os endpoints de deploy (Netlify) na Tabela Resumida do MVP. | Prontuariantes |