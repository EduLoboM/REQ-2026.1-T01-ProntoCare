# ProntoCare - Backend

Este é o backend da aplicação ProntoCare, construído com **Node.js** e **Express**, e integrado com um banco de dados **PostgreSQL** hospedado no Supabase.

## Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

## Configuração do Banco de Dados

Antes de rodar o projeto, você precisa configurar a conexão com o Supabase. Por questões de segurança, a URL do banco de dados não deve ser subida para o GitHub.

1. Na raiz desta pasta (`back`), crie um arquivo chamado `.env`.
2. Adicione a sua URL de conexão do Supabase dentro do arquivo usando a chave `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://usuario:senha@host:porta/banco"
   ```

## Como rodar o projeto localmente

1. Abra o terminal e navegue até esta pasta (`back`):
   ```bash
   cd back
   ```

2. Instale as dependências do projeto (caso seja a primeira vez):
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   node index.js
   ```

4. O servidor estará rodando na porta 3000. Você pode testar a conexão com a API e o banco de dados abrindo o seguinte link no seu navegador:
   [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Estrutura Básica
- Tecnologias principais: Node.js, Express, `pg` (driver do PostgreSQL).
- O arquivo principal do servidor é o `index.js`, que já contém as configurações de roteamento, CORS e leitura de variáveis de ambiente com `dotenv`.
