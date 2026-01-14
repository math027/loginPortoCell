# Login PortoCell

Sistema de Login e Cadastro com Node.js, Express e MySQL.

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/math027/loginPortoCell.git](https://github.com/math027/loginPortoCell.git)
   cd loginPortoCell
   ```

2. **Instale as dependências**
   ```bash
   npm install express mysql2 bcrypt
   ```

3. **Configure o Banco de Dados:**
  Crie um banco de dados MySQL chamado portocell.
  Rode o script database.sql (incluso no projeto) para criar a tabela.

4. **Configure as Variáveis de Ambiente:**
  Renomeie o arquivo .env.example para .env.
  Abra o arquivo .env e coloque a senha do seu banco de dados MySQL.

5. **Inicie o servidor**
   npm start

6. **Abra o localhost:3000 no seu navegador.**

### Resumo do que vai acontecer:
* Seu código vai para o GitHub.
* Suas senhas (arquivo `.env`) **não** vão (segurança total).
* A pasta pesada `node_modules` **não** vai.
* Quem baixar seu código vai ler o `README.md`, rodar `npm install` (que baixa o `node_modules` automaticamente) e configurar o próprio banco de dados.
