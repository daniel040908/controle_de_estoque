USE estoque_db;

-- 1. Todos os produtos
SELECT * FROM produtos;

-- 2. Produtos com categoria e fornecedor
SELECT
    p.id,
    p.nome AS produto,
    c.nome AS categoria,
    f.nome AS fornecedor,
    p.preco,
    p.estoque
FROM produtos p
INNER JOIN categorias c ON c.id = p.categoria_id
INNER JOIN fornecedores f ON f.id = p.fornecedor_id;

-- 3. Produtos com estoque baixo
SELECT *
FROM vw_estoque_produtos
WHERE estoque <= estoque_minimo;

-- 4. Produtos sem estoque
SELECT *
FROM vw_estoque_produtos
WHERE estoque = 0;

-- 5. Valor total do estoque
SELECT
    SUM(preco * estoque) AS valor_total_estoque
FROM produtos;

-- 6. Quantidade de produtos por categoria
SELECT
    c.nome AS categoria,
    COUNT(p.id) AS quantidade_produtos
FROM categorias c
LEFT JOIN produtos p ON p.categoria_id = c.id
GROUP BY c.id, c.nome
ORDER BY quantidade_produtos DESC;

-- 7. Total de entradas por produto
SELECT
    p.nome,
    COALESCE(SUM(e.quantidade), 0) AS total_entradas
FROM produtos p
LEFT JOIN entradas e ON e.produto_id = p.id
GROUP BY p.id, p.nome;

-- 8. Total de saídas por produto
SELECT
    p.nome,
    COALESCE(SUM(s.quantidade), 0) AS total_saidas
FROM produtos p
LEFT JOIN saidas s ON s.produto_id = p.id
GROUP BY p.id, p.nome;

-- 9. Todas as movimentações
SELECT * FROM vw_movimentacoes
ORDER BY created_at DESC;

-- 10. Produtos acima de R$ 100
SELECT *
FROM produtos
WHERE preco > 100
ORDER BY preco DESC;
