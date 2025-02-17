# API de Contribuições para Presentes

## Descrição
Esta é uma API RESTful para gerenciar contribuições financeiras para presentes. Ela permite registrar contribuições e obter o total de contribuições para um presente específico.

## Tecnologias Utilizadas
- Node.js
- Express.js
- MongoDB
- Mongoose
- Dotenv
- CORS

## Pré-requisitos
- Node.js (versão 12 ou superior)
- MongoDB

## Instalação
1. Clone o repositório:git clone [URL_DO_SEU_REPOSITÓRIO]
2. Instale as dependências:npm install
3. Crie um arquivo `.env` na raiz do projeto e adicione suas variáveis de ambiente:MONGO_URI=sua_uri_do_mongodb
PORT=4000

## Executando o Servidor
Para iniciar o servidor, execute:npm start

O servidor estará rodando em `http://localhost:4000` (ou na porta definida no arquivo .env).

## Rotas da API

### Registrar uma Contribuição
- **POST** `/api/contribute`
- Body:
{
"giftId": "string",
"amount": number
}
- A contribuição mínima é de R$100,00.

### Obter Total de Contribuições
- **GET** `/api/contributions/:giftId`
- Retorna o total de contribuições e a lista de contribuições para um presente específico.

## Configuração CORS
O CORS está configurado para permitir requisições apenas de `http://localhost:8080`. Ajuste conforme necessário no arquivo principal.

## Arquivos Estáticos
Os arquivos estáticos são servidos a partir do diretório `public`.
