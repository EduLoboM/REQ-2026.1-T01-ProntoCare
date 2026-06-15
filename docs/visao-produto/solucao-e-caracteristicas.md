# Solução e características

### 2 Solução proposta

#### 2.1 Objetivo Geral do Produto

Para solucionar a ineficiência operacional e os riscos de segurança gerados pela dependência exclusiva de registros em papel e fluxos manuais, o objetivo do ProntoCare é digitalizar e centralizar o fluxo assistencial do consultório. A solução visa substituir o arquivo físico por um sistema estruturado que permita o registro, a consulta e a recuperação imediata das informações clínicas durante o atendimento, assegurando a agilidade da consulta e a continuidade do cuidado ao paciente. Além de otimizar a rotina do médico, o produto deve garantir a integridade, a rastreabilidade e a conformidade regulatória dos dados sensíveis, mitigando as vulnerabilidades de segurança do cenário atual.


#### 2.2 Objetivos Específicos (OE) do Produto

- **(OE1)** Reduzir a fragmentação e o tempo de recuperação de informações clínicas.  Em vez de focar no "módulo de cadastro", o foco é no ganho operacional de ter os dados centralizados para consulta imediata em qualquer cenário de atendimento.

- **(OE2)** Qualificar a precisão e a padronização do registro assistencial.  O objetivo não é apenas ter um "prontuário eletrônico", mas garantir que o histórico utilize padrões (como SOAP e CID-10) que evitem erros de interpretação comuns no papel.

- **(OE3)** Mitigar riscos de segurança e garantir o compliance jurídico (LGPD/CFM).  O objetivo aqui é a proteção legal do médico, substituindo a vulnerabilidade do papel por um ambiente rastreável e auditável.

- **(OE4)** Otimizar a continuidade do cuidado em atendimentos multiplataforma.  Garantir que o médico tenha o mesmo nível de informação no consultório, no atendimento domiciliar ou remoto, eliminando o "apagão" de dados entre um local e outro.

- **(OE5)** Eliminar o erro humano na emissão de documentos clínicos.  Substituir a redação manual por processos automatizados para garantir a legibilidade e a padronização de prescrições e encaminhamentos.

#### 2.3 Características de Produto (mapeadas com os Objetivos Específicos do Produto)

A solução proposta deverá contemplar, de forma preliminar, as seguintes características:

<div class="caracteristicas-table-container" markdown="1">
| ID | Característica do produto | Descrição resumida | ID | Valor de negócio principal | Contribuição principal | Contribuição secundária |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CP1 | Prontuário eletrônico estruturado (SOAP) | Registro de atendimentos em campos padronizados (Subjetivo, Objetivo, Avaliação, Plano), com busca e recuperação do histórico clínico por paciente. | VN1 | Padronização e recuperação rápida dos registros clínicos. | OE1 | OE2 |
| CP2 | Atendimento em múltiplos contextos | Acesso ao prontuário e registro de atendimentos no consultório, no domicílio ou remotamente, com a mesma base de dados unificada. | VN2 | Cobertura do ciclo assistencial em qualquer local de atendimento. | OE4 | OE1 |
| CP3 | Suporte a protocolos clínicos e triagem | Campos e fluxos guiados por protocolos clínicos (ex.: classificação de risco, CID-10), auxiliando o médico na padronização das triagens. | VN3 | Consistência e agilidade nas decisões de triagem. | OE2 | OE1 |
| CP4 | Integridade e autenticidade documental | Cadeia de hash SHA-256 entre registros e assinatura digital por atendimento, garantindo que nenhum registro seja alterado após a assinatura e que a autoria seja verificável. | VN4 | Integridade, autoria e não repúdio dos documentos clínicos. | OE3 | OE1 |
| CP5 | Operação offline e sincronização | Funcionamento completo sem internet via PWA e armazenamento local (Dexie.js); sincronização automática com o servidor ao reconectar. | VN5 | Continuidade do atendimento em ambientes sem conectividade. | OE4 | OE1 |
| CP6 | Controle de acesso e privacidade | Autenticação do médico, perfis de acesso diferenciados (médico, paciente) e restrição de visualização de dados sensíveis conforme o papel do usuário. | VN6 | Privacidade dos dados do paciente e segurança de acesso. | OE3 | OE4 |
| CP7 | Auditoria e rastreabilidade de acessos | Log automático de todas as operações sobre dados sensíveis (quem acessou, quando, qual registro, qual ação), consultável pelo médico. | VN7 | Rastreabilidade das operações para responsabilização e auditoria. | OE3 | OE2 |
| CP8 | Conformidade regulatória (LGPD/CFM) | Implementação dos controles exigidos pela LGPD (consentimento, direitos do titular, proteção de dados sensíveis) e pelas resoluções do CFM sobre prontuário eletrônico. | VN8 | Aderência às normas de proteção de dados e do exercício médico. | OE3 | OE5 |
| CP9 | Emissão padronizada de documentos clínicos | Geração automatizada de prescrições, atestados, encaminhamentos e relatórios a partir dos dados do prontuário, com modelos padronizados que eliminam erros de redação manual. | VN9 | Eliminação de erros e legibilidade garantida na emissão de documentos. | OE5 | OE2 |
</div>

#### 2.4 Tecnologias a Serem Utilizadas

Para a construção da solução proposta para o ProntoCare , serão utilizadas tecnologias compatíveis com a necessidade de operação em ambientes sem conectividade , segurança de dados sensíveis e desenvolvimento iterativo do produto. No frontend, será utilizado React , para a construção de interfaces de alta usabilidade que facilitem a adaptação do médico ao sistema digital. No backend, será utilizado Node.js, favorecendo a implementação de serviços web e a lógica de autenticação manual necessária para o controle de acesso. Para persistência de dados, será utilizado PostgreSQL , considerando a estrutura necessária para gerenciar prontuários individuais , dados cadastrais e o histórico clínico dos pacientes.

A integração entre o webapp e o servidor será realizada por meio de APIs RESTful , permitindo a sincronização de dados e atualização dos registros assim que a conectividade for recuperada. Para garantir a operação offline, serão adotadas tecnologias de PWA (Progressive Web App) e Dexie.js para armazenamento local no navegador. A integridade dos documentos será assegurada por uma cadeia de autenticidade criptográfica com hashes SHA-256 gerados via Web Crypto API. Para apoio ao desenvolvimento colaborativo, serão utilizados Git e GitHub , além de práticas de testes e integração contínua para garantir a qualidade técnica. Também serão considerados mecanismos de segurança, privacidade e conformidade com a LGPD , em alinhamento com as normas do CFM e os requisitos de rastreabilidade do prontuário médico.



#### 2.5 Pesquisa de Mercado e Análise Competitiva

No mercado de prontuários eletrônicos para profissionais autônomos, as soluções mais relevantes são o eSUS PEC — referência técnica do próprio cliente — e plataformas comerciais como iClinic e Clinic nas Nuvens. Cada uma apresenta características e limitações que contextualizam a oportunidade do ProntoCare.

| Solução | Limitações | Pontos fortes |
| :--- | :--- | :--- |
| eSUS PEC | Concebido para unidades públicas de atenção básica, não para autônomos; interface complexa; operação offline limitada; sem cadeia de autenticidade criptográfica por registro individual. | Gratuito; referência técnica do cliente; amplamente utilizado na atenção básica. |
| iClinic | Operação exclusivamente online (sem suporte offline); custo de licença mensal recorrente; sem cadeia de autenticidade criptográfica por registro. | Interface moderna e consolidada; adoção ampla entre médicos autônomos. |
| Clinic nas Nuvens | Dependência total de conectividade; sem verificação criptográfica de documentos; custo de licença mensal. | Integração com convênios e agenda; experiência de uso satisfatória para consultórios. |

**Diferenciais do ProntoCare**

- Operação híbrida online/offline — atendimentos continuam sem interrupção mesmo sem internet.
- Cadeia de autenticidade criptográfica por registro (hash sequencial + assinatura digital) — integridade e autoria verificáveis.
- Custo zero de licenciamento — compatível com a diretriz do projeto e com o contexto de pequeno consultório autônomo.
- Fluxo orientado ao médico autônomo — interface adaptada ao ciclo SOAP sem a complexidade do sistema público.

#### 2.6 Viabilidade da Proposta

A proposta é viável no contexto da disciplina, considerando o acesso ao cliente, o escopo definido e a possibilidade de entrega incremental de um MVP funcional ao final do semestre. Embora a equipe seja estudantil, possua recursos limitados e o prazo seja restrito a aproximadamente quatro meses, o projeto foi estruturado de forma compatível com essa realidade, com priorização rigorosa das funcionalidades essenciais e validações frequentes com o cliente.

O principal desafio frente à visão completa e de longo prazo do produto é o limite de tempo e recursos, mas esse risco é mitigado pela redução do escopo a um subconjunto funcional e coerente. O MVP (produto mínimo viável) garante a entrega das características essenciais que demonstram o valor central do sistema, sem comprometer a viabilidade da entrega.

Assim, a proposta é considerada viável, desde que:
- O escopo do MVP permaneça estritamente controlado;
- As prioridades essenciais sejam mantidas; e
- A equipe gerencie adequadamente os recursos e o escopo dentro do prazo de 3 a 4 meses.

#### 2.7 Benefícios Esperados

**Para o cliente (Dr. Rogério Duarte)**

- Digitalização do fluxo clínico essencial, eliminando a dependência de prontuários em papel.
- Acesso rápido e estruturado ao histórico do paciente durante o atendimento.
- Rastreabilidade criptográfica dos registros, garantindo integridade e autoria verificáveis.
- Continuidade assistencial mesmo em ambientes sem conectividade.
- Base tecnológica para expansão futura sem necessidade de reescrita do sistema.

**Para os usuários (pacientes)**

- Acesso restrito e seguro ao próprio prontuário, preservando a privacidade do paciente.
- Possibilidade de encaminhar registros clínicos a outros profissionais de saúde.
- Registros padronizados no formato SOAP, favorecendo a continuidade do cuidado.
- Maior confiança no armazenamento e na integridade dos dados clínicos pessoais.


#### Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :---: | :---: | :---: | :---: |
| 2026-02-10 | 0.1 | Elaboração inicial da visão do produto e projeto. | Prontuariantes |
| 2026-02-24 | 0.2 | Refinamento do escopo após reuniões de elicitação com o cliente. | Prontuariantes |
| 2026-03-10 | 0.3 | Definição da arquitetura documental e cadeia de autenticidade. | Prontuariantes |
| 2026-03-25 | 0.4 | Delimitação do escopo reduzido do MVP e revisão geral. | Prontuariantes |
| 2026-04-11 | 0.5 | Correções conforme revisão do professor; inclusão das seções 2.4 a 6. | Prontuariantes |
| 2026-04-13 | 0.6 | Últimas revisões antes da primeira entrega. | Prontuariantes |
| 2026-05-03 | 0.7 | Correção de CPs: remoção de OE6 inexistente, renomeação com nomes diretos, descrições práticas, adição de CP9 (emissão de documentos). | Prontuariantes |