---
icon: material/home
---
# ProntoCare

Sistema de prontuário eletrônico de pacientes — documentação do projeto da disciplina **Requisitos de Software** (REQ), turma T01, semestre 2026.1, grupo **Prontuariantes**.

---

## :material-compass-outline: Navegação Rápida

Explore as seções da documentação do projeto por meio dos painéis interativos abaixo:

<div class="grid cards" markdown>

-   __Visão do Produto e Projeto__

    ---

    Explore a visão geral, objetivos específicos, arquitetura documental, cronogramas de sprints, engenharia de requisitos e especificação de backlog do MVP.

    :material-file-document-outline: [Acessar Documentação](visao-produto/index.md)

-   __Atas e Vídeos de Sprints__

    ---

    Confira todas as atas detalhadas de reuniões, rituais ágeis (Planning, Review) e as gravações em vídeo de cada Sprint (Sprints 0 a 7).

    :material-video-outline: [Acessar Histórico](atas-e-videos/index.md)

-   __Progresso do Projeto__

    ---

    Consulte o estado atual dos requisitos no quadro colaborativo, contendo a sinalização visual de progresso e homologação.

    :fontawesome-brands-figma: [Acessar Progresso](progresso/index.md)

-   __Entregas de Unidade__

    ---

    Assista aos vídeos oficiais de gravação e veja os materiais de slides preparados para cada uma das apresentações das Unidades Acadêmicas.

    :material-presentation: [Acessar Entregas](entregas/index.md)

</div>

---

## :material-console: Pré-visualização Local

Se você deseja executar o servidor de documentação localmente em sua máquina, siga os passos abaixo:

```bash
# Crie e ative o ambiente virtual
python3 -m venv .venv
source .venv/bin/activate

# Atualize o pip e instale os pacotes necessários
pip install -U pip
pip install -r requirements.txt

# Inicie o servidor de desenvolvimento do MkDocs
mkdocs serve
```

A documentação estará acessível no seu navegador em: [http://127.0.0.1:8000](http://127.0.0.1:8000)



## :material-git: Contribuição

Novos capítulos em Markdown devem ser adicionados na pasta `docs/` e registrados em suas devidas seções na propriedade `nav` do arquivo [mkdocs.yml](file:///home/eduradolm/Documents/Atividades/requisitos/mkdocs.yml). Para anexar imagens, utilize a pasta correspondente sob `docs/assets/<seção>/`.
