DROP DATABASE IF EXISTS estoque_db;
CREATE DATABASE estoque_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE estoque_db;

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 5,
    categoria_id INT NOT NULL,
    fornecedor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_produto_preco CHECK (preco > 0),
    CONSTRAINT chk_produto_estoque CHECK (estoque >= 0),
    CONSTRAINT chk_produto_estoque_minimo CHECK (estoque_minimo >= 0),

    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_produto_fornecedor
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE entradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    observacao VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_entrada_quantidade CHECK (quantidade > 0),

    CONSTRAINT fk_entrada_produto
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE saidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    observacao VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_saida_quantidade CHECK (quantidade > 0),

    CONSTRAINT fk_saida_produto
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_fornecedor ON produtos(fornecedor_id);
CREATE INDEX idx_entradas_produto ON entradas(produto_id);
CREATE INDEX idx_saidas_produto ON saidas(produto_id);

CREATE VIEW vw_estoque_produtos AS
SELECT
    p.id,
    p.nome AS produto,
    p.descricao,
    c.nome AS categoria,
    f.nome AS fornecedor,
    p.preco,
    p.estoque,
    p.estoque_minimo,
    CASE
        WHEN p.estoque = 0 THEN 'SEM ESTOQUE'
        WHEN p.estoque <= p.estoque_minimo THEN 'ESTOQUE BAIXO'
        ELSE 'NORMAL'
    END AS status_estoque
FROM produtos p
INNER JOIN categorias c ON c.id = p.categoria_id
INNER JOIN fornecedores f ON f.id = p.fornecedor_id;

CREATE VIEW vw_movimentacoes AS
SELECT
    e.id,
    'ENTRADA' AS tipo,
    e.produto_id,
    p.nome AS produto,
    e.quantidade,
    e.observacao,
    e.created_at
FROM entradas e
INNER JOIN produtos p ON p.id = e.produto_id

UNION ALL

SELECT
    s.id,
    'SAIDA' AS tipo,
    s.produto_id,
    p.nome AS produto,
    s.quantidade,
    s.observacao,
    s.created_at
FROM saidas s
INNER JOIN produtos p ON p.id = s.produto_id;
