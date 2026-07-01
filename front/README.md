# ProntoCare - Frontend

Este é o frontend da aplicação ProntoCare, construído com **React** e **Vite**.

## Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

## Como rodar o projeto localmente

1. Abra o terminal e navegue até esta pasta (`front`):
   ```bash
   cd front
   ```

2. Instale as dependências do projeto (caso seja a primeira vez que você baixa o projeto):
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse o link gerado no terminal (geralmente `http://localhost:5173/`). Quaisquer alterações feitas no código vão recarregar a página automaticamente!

## Estrutura Básica
- As tecnologias principais são React (JavaScript) e Vite (como empacotador rápido).
- O código-fonte da aplicação fica na pasta `src/`.
- Caso precise configurar variáveis de ambiente (como a URL do backend), crie um arquivo `.env` e use o prefixo `VITE_` (ex: `VITE_API_URL=http://localhost:3000`).
