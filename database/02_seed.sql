USE estoque_db;

INSERT INTO categorias (nome, descricao) VALUES
('Eletrônicos', 'Produtos eletrônicos e periféricos'),
('Informática', 'Computadores e acessórios'),
('Escritório', 'Materiais para escritório');

INSERT INTO fornecedores (nome, email, telefone) VALUES
('Tech Distribuidora', 'contato@techdistribuidora.com', '(11) 99999-1111'),
('Info Center', 'vendas@infocenter.com', '(11) 98888-2222'),
('Office Brasil', 'contato@officebrasil.com', '(11) 97777-3333');

INSERT INTO produtos
(nome, descricao, preco, estoque, estoque_minimo, categoria_id, fornecedor_id)
VALUES
('Teclado USB', 'Teclado ABNT2 USB', 89.90, 20, 5, 2, 1),
('Mouse Óptico', 'Mouse USB 1200 DPI', 49.90, 35, 10, 2, 1),
('Monitor 24"', 'Monitor Full HD 24 polegadas', 799.90, 8, 3, 1, 2),
('Cadeira de Escritório', 'Cadeira ergonômica', 699.90, 4, 5, 3, 3),
('Headset', 'Headset USB com microfone', 129.90, 0, 5, 1, 2);

INSERT INTO entradas (produto_id, quantidade, observacao) VALUES
(1, 10, 'Entrada inicial'),
(2, 15, 'Entrada inicial'),
(3, 8, 'Entrada inicial'),
(4, 4, 'Entrada inicial'),
(5, 5, 'Entrada inicial');

INSERT INTO saidas (produto_id, quantidade, observacao) VALUES
(1, 2, 'Venda'),
(2, 3, 'Venda'),
(3, 1, 'Venda');
