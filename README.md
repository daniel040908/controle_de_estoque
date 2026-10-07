# Sistema de Controle de Estoque

Projeto acadêmico para revisão de Banco de Dados e Back-End utilizando MySQL, Node.js e Express.

## Conteúdos trabalhados

- DER e relacionamentos
- Criação e manipulação de banco de dados
- PK e FK
- INNER JOIN e LEFT JOIN
- VIEWs
- Consultas SQL
- CRUD
- Regras de negócio
- Validações
- API REST
- Tratamento de erros

## 1. Requisitos

- Node.js 18+
- MySQL 8+
- HeidiSQL (opcional)
- VS Code (recomendado)

## 2. Banco de dados

Abra o HeidiSQL e execute o arquivo:

`database/01_schema.sql`

Depois execute:

`database/02_seed.sql`

O banco será criado com o nome `estoque_db`.

## 3. Configuração da API

Copie `.env.example` para `.env` e ajuste:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=estoque_db
```

## 4. Instalação

```bash
npm install
npm run dev
```

API:

`http://localhost:3000`

Health check:

`GET /api/health`

## 5. Rotas principais

### Categorias

- GET `/api/categorias`
- GET `/api/categorias/:id`
- POST `/api/categorias`
- PUT `/api/categorias/:id`
- DELETE `/api/categorias/:id`

### Fornecedores

- GET `/api/fornecedores`
- GET `/api/fornecedores/:id`
- POST `/api/fornecedores`
- PUT `/api/fornecedores/:id`
- DELETE `/api/fornecedores/:id`

### Produtos

- GET `/api/produtos`
- GET `/api/produtos/:id`
- POST `/api/produtos`
- PUT `/api/produtos/:id`
- DELETE `/api/produtos/:id`

### Movimentações

- POST `/api/entradas`
- POST `/api/saidas`
- GET `/api/movimentacoes`

### Relatórios / VIEWs

- GET `/api/relatorios/estoque`
- GET `/api/relatorios/estoque-baixo`
- GET `/api/relatorios/estoque-zero`
- GET `/api/relatorios/movimentacoes`

## Regras de negócio

1. Nome de produto é obrigatório.
2. Preço deve ser maior que zero.
3. Estoque nunca pode ser negativo.
4. Quantidade de entrada deve ser maior que zero.
5. Quantidade de saída deve ser maior que zero.
6. Uma saída não pode ultrapassar o estoque disponível.
7. Produto precisa existir antes de uma movimentação.
8. Categoria precisa existir antes do cadastro do produto.
9. Fornecedor precisa existir antes do cadastro do produto.
10. Não é permitido excluir categoria ou fornecedor que esteja sendo utilizado.

## Exemplos

### Criar categoria

```json
{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos"
}
```

### Criar fornecedor

```json
{
  "nome": "Fornecedor ABC",
  "email": "contato@abc.com",
  "telefone": "(11) 99999-1111"
}
```

### Criar produto

```json
{
  "nome": "Teclado USB",
  "descricao": "Teclado USB padrão ABNT2",
  "preco": 89.90,
  "estoque": 20,
  "estoqueMinimo": 5,
  "categoriaId": 1,
  "fornecedorId": 1
}
```

### Registrar entrada

```json
{
  "produtoId": 1,
  "quantidade": 10,
  "observacao": "Compra de reposição"
}
```

### Registrar saída

```json
{
  "produtoId": 1,
  "quantidade": 3,
  "observacao": "Venda"
}
```

## Estrutura

```text
controle-estoque/
├── database/
│   ├── 01_schema.sql
│   ├── 02_seed.sql
│   └── 03_consultas.sql
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── categoriaController.js
│   │   ├── fornecedorController.js
│   │   ├── produtoController.js
│   │   ├── movimentacaoController.js
│   │   └── relatorioController.js
│   ├── routes/
│   │   ├── categoriaRoutes.js
│   │   ├── fornecedorRoutes.js
│   │   ├── produtoRoutes.js
│   │   ├── movimentacaoRoutes.js
│   │   └── relatorioRoutes.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
"# controle_de_estoque" 
