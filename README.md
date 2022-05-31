# Desafio DIWE

![diwe](https://user-images.githubusercontent.com/82068881/171225698-ec0c5c28-b6ae-4498-aeeb-3de9ededce98.png)

Página desenvolvida em React para o desafio técnico do processo seletivo de Pessoa Desenvolvedora Front-End na empresa DIWE.

Foi fornecido um projeto via figma, onde deveria ser criado a partir dele  uma lista de contatos, capaz de adicionar, visualizar, editar e remover
contatos, que são armazenados em uma API também fornecida, sendo também necessário realizar um login para a autenticação. 

Para ter acesso às funcionalidades do projeto, é necessário fazer o login com as credenciais abaixo. Com o login feito, é possível visualizar uma lista de contatos, onde o título de cada coluna age como um ordenador, capaz de ordenar os contatos em ordem crescente ou decrescente. Em cada contato há botoẽs para editar ou excluir, que abrem modais com as respectivas funcionalidades, e também um botão "Adicionar novo contato" que leva o usuário para a página de criação, onde são necessários o nome completo, email e telefone celular para criar um novo contato. 

Em cada uma das páginas também há umheader com a  opção de retornar a página anterior. Não foi implementado nenhum sistema para perdurar o token de autenticação, portanto caso o usuário atualize a página perderá o acesso e terá de realizar o login novamente.

A Página foi desenvolvida utilizando o framework React, SASS para estilização, React Testing Library para realizar testes de integração Eslint e prop-types para padronização e minimizar erros de código, e algumas bibliotecas de componentes.

## Credenciais de login

Para ter acesso às funcionalidades, deve ser informado o seguinte usuário e senha:

```json
{
  "email": "user@diwe.com.br",
  "password": "Mob20we23##"
}
```

## Deploy do projeto

Foi feito um deploy do projeto através da plaforma Vercel, que pode ser acessado [aqui](https://desafio-diwe.vercel.app/)

## Instruções para reproduzir o projeto localmente

1. Clone o repositório
  * `git@github.com:Kevin-Ol/desafio-diwe.git`.
  * Entre na pasta do repositório que você acabou de clonar:
    * `cd desafio-diwe`

2. Instale as dependências
  * `npm install`

3. Inicie o projeto
  * `npm start`

4. A aplicação iniciará na porta 3000:
  * `http://localhost:3000/`

5. Também é possível testar o projeto com o comando
  * `npm test`

## Bibliotecas utilizadas

- `eslint` para garantir padronização do código;
- `sass` pré-processador css;
- `axios` para comunicação com o back-end;
- `react-input-mask` gerar um input de telefone mais intuitivo para o usuário;
- `react-modal` criar modais para edição e remoção de contatos;
- `prop-types` confiabilidade dos tipos de dados fornecidos para componentes filho;

## Contato

Email: kevin.zero@hotmail.com

Github: https://github.com/kevin-ol

LinkedIn: https://www.linkedin.com/in/kevinmendoncaoliveira/
