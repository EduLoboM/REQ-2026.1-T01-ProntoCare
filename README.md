# REQ-2026.1-T01-ProntoCare

Repositório do projeto **ProntoCare** (sistema de prontuário eletrônico de pacientes) — disciplina Requisitos de Software, turma T01, 2026.1, grupo Prontuariantes.

## Links do Projeto

*   **Documentação (GitHub Pages):** [https://mdsreq-fga-unb.github.io/REQ-2026.1-T01-ProntoCare/](https://mdsreq-fga-unb.github.io/REQ-2026.1-T01-ProntoCare/)
*   **Aplicação (Deploy):** [https://portalprontocare.netlify.app/](https://portalprontocare.netlify.app/)

### Credenciais de Acesso

Utilize as seguintes credenciais de acesso para testar as funcionalidades em cada perfil:

| Perfil | E-mail / Identificador | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin` | `admin` |
| **Médico** | `medico@prontocare.com` | `123456` |
| **Paciente** | `paciente@email.com` | `123456` |

## Documentação (MkDocs Material)

A documentação do produto e do projeto vive em [docs](docs/) e é publicada com [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

### Ambiente local (venv)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -r requirements.txt
mkdocs serve
```

Abre [http://127.0.0.1:8000](http://127.0.0.1:8000) para pré-visualizar.

Validar build (como no CI):

```bash
mkdocs build --strict
```

A visão do produto está em `docs/visao-produto/`. Imagens: `docs/assets/visao-produto/`. Novas páginas: criar o `.md` em `docs/` ou nessa pasta e registar em `nav` no `mkdocs.yml`.

**Uso local (não publicado no site):** `scripts/_visao_body.md` — texto agregado opcional para comparar com exportações do PDF; a fonte publicada é `docs/visao-produto/*.md`.
