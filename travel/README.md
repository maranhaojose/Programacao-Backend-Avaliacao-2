# Trip Requests API

API REST para gerenciamento simplificado de solicitações institucionais de viagem. A aplicação permite criar, listar, consultar por ID e cancelar solicitações, mantendo as datas normalizadas em ISO 8601 UTC e bloqueando viagens cuja data de saída seja feriado nacional consultado pela BrasilAPI.

## Equipe

Nome da equipe: não informado.

Integrantes:

- Irapuam Junio Da Silva Santos
- Mayara Lima Miranda
- José Maranhão Da Silva Neto

## Tecnologias

- Node.js 20+
- TypeScript
- Express
- PostgreSQL 16
- Docker Compose
- Vitest
- Supertest
- BrasilAPI

SGBD escolhido: PostgreSQL 16.

Gerenciador de pacotes adotado: npm.

## Instalação

Instale as dependências do projeto:

```bash
npm install
```

O repositório não deve versionar a pasta `node_modules/`. Ela já está coberta pelo arquivo `.gitignore`.

## Configuração

O arquivo `.env.example` contém valores funcionais para todas as variáveis exigidas pela aplicação:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://trip_user:trip_password@localhost:5432/trip_requests
HOLIDAYS_API_BASE_URL=https://brasilapi.com.br
```

A API carrega esses valores automaticamente como fallback. Caso queira manter um arquivo local de ambiente, copie o exemplo:

```bash
cp .env.example .env
```

Não é necessário alterar manualmente os valores para executar a aplicação com o Docker Compose deste projeto.

## Banco De Dados

Suba o PostgreSQL com Docker Compose:

```bash
docker compose up -d
```

Inicialize a estrutura do banco e popule os dados iniciais:

```bash
npm run init:db
```

Esse comando cria a tabela `trip_requests` e insere 10 solicitações iniciais. A execução é idempotente: rodar novamente não duplica os registros seed.

## Execução

Execute a API em modo desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

Para executar em modo compilado:

```bash
npm run build
npm start
```

## Testes

Com o PostgreSQL do Docker Compose em execução, rode:

```bash
npm test
```

Os testes usam Vitest e Supertest. As chamadas para a BrasilAPI são simuladas nos testes, então a suíte não depende de acesso externo para validar feriados.

## Contrato De Resposta

Todas as respostas de sucesso seguem o formato:

```json
{
  "success": true,
  "data": {}
}
```

Todas as respostas de erro seguem o formato:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "English message"
  }
}
```

## Endpoints

### Criar solicitação de viagem

Método: `POST`

Rota: `/trip-requests`

Descrição: cria uma solicitação de viagem com status inicial `pending`. Antes de persistir, a API valida os campos obrigatórios, normaliza as datas para UTC e consulta a BrasilAPI para impedir saída em feriado nacional.

Corpo da requisição:

```json
{
  "requesterName": "Maria Silva",
  "origin": "Parnaiba",
  "destination": "Teresina",
  "departureAt": "2026-06-24T10:00:00.000Z",
  "returnAt": "2026-06-24T18:00:00.000Z",
  "purpose": "Participation in an institutional meeting",
  "passengerCount": 3
}
```

Possíveis respostas: `201`, `400`, `409`, `502`.

### Listar solicitações de viagem

Método: `GET`

Rota: `/trip-requests`

Descrição: retorna todas as solicitações cadastradas, incluindo status, datas normalizadas e data de criação.

Exemplo de resposta:

```json
{
  "success": true,
  "data": []
}
```

### Consultar solicitação por ID

Método: `GET`

Rota: `/trip-requests/:id`

Descrição: retorna uma solicitação específica pelo identificador.

Exemplo:

```bash
curl http://localhost:3000/trip-requests/seed-001
```

Possíveis respostas: `200`, `404`.

### Cancelar solicitação de viagem

Método: `PATCH`

Rota: `/trip-requests/:id/cancel`

Descrição: altera o status de uma solicitação `pending` para `canceled`.

Exemplo:

```bash
curl -X PATCH http://localhost:3000/trip-requests/seed-001/cancel
```

Possíveis respostas: `200`, `404`, `409`.

### Listar feriados nacionais por ano

Método: `GET`

Rota: `/holidays/:year`

Descrição: consulta feriados nacionais no endpoint `GET {HOLIDAYS_API_BASE_URL}/api/feriados/v1/{year}` e retorna a lista normalizada.

Exemplo:

```bash
curl http://localhost:3000/holidays/2026
```

Exemplo de resposta:

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-01",
      "name": "Confraternização mundial",
      "type": "national"
    }
  ]
}
```

Possíveis respostas: `200`, `400`, `502`.

## Scripts Disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Executa o servidor em desenvolvimento com recarregamento |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Executa a aplicação compilada |
| `npm test` | Executa a suíte de testes |
| `npm run init:db` | Cria a tabela e popula o banco com dados iniciais |
