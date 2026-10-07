import db from "../config/database.js";

async function validarReferencias(categoriaId, fornecedorId) {
  const [[categoria]] = await db.query("SELECT id FROM categorias WHERE id = ?", [categoriaId]);
  if (!categoria) return "Categoria não encontrada.";

  const [[fornecedor]] = await db.query("SELECT id FROM fornecedores WHERE id = ?", [fornecedorId]);
  if (!fornecedor) return "Fornecedor não encontrado.";

  return null;
}

function validarProduto({ nome, preco, estoque, estoqueMinimo }) {
  if (!nome?.trim()) return "O nome do produto é obrigatório.";
  if (Number(preco) <= 0) return "O preço deve ser maior que zero.";
  if (!Number.isInteger(Number(estoque)) || Number(estoque) < 0) return "O estoque deve ser um número inteiro maior ou igual a zero.";
  if (!Number.isInteger(Number(estoqueMinimo)) || Number(estoqueMinimo) < 0) return "O estoque mínimo deve ser um inteiro maior ou igual a zero.";
  return null;
}

export async function listarProdutos(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.nome AS categoria, f.nome AS fornecedor
      FROM produtos p
      INNER JOIN categorias c ON c.id = p.categoria_id
      INNER JOIN fornecedores f ON f.id = p.fornecedor_id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar produtos.", detalhe: error.message });
  }
}

export async function buscarProduto(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.nome AS categoria, f.nome AS fornecedor
      FROM produtos p
      INNER JOIN categorias c ON c.id = p.categoria_id
      INNER JOIN fornecedores f ON f.id = p.fornecedor_id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!rows.length) return res.status(404).json({ erro: "Produto não encontrado." });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produto.", detalhe: error.message });
  }
}

export async function criarProduto(req, res) {
  const { nome, descricao, preco, estoque = 0, estoqueMinimo = 5, categoriaId, fornecedorId } = req.body;

  const erro = validarProduto({ nome, preco, estoque, estoqueMinimo });
  if (erro) return res.status(400).json({ erro });

  if (!categoriaId || !fornecedorId) {
    return res.status(400).json({ erro: "Categoria e fornecedor são obrigatórios." });
  }

  try {
    const referenciaErro = await validarReferencias(categoriaId, fornecedorId);
    if (referenciaErro) return res.status(400).json({ erro: referenciaErro });

    const [result] = await db.query(`
      INSERT INTO produtos
      (nome, descricao, preco, estoque, estoque_minimo, categoria_id, fornecedor_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [nome.trim(), descricao || null, preco, estoque, estoqueMinimo, categoriaId, fornecedorId]);

    const [rows] = await db.query("SELECT * FROM produtos WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar produto.", detalhe: error.message });
  }
}

export async function atualizarProduto(req, res) {
  const { nome, descricao, preco, estoque, estoqueMinimo, categoriaId, fornecedorId } = req.body;

  const erro = validarProduto({ nome, preco, estoque, estoqueMinimo });
  if (erro) return res.status(400).json({ erro });

  try {
    const referenciaErro = await validarReferencias(categoriaId, fornecedorId);
    if (referenciaErro) return res.status(400).json({ erro: referenciaErro });

    const [result] = await db.query(`
      UPDATE produtos
      SET nome = ?, descricao = ?, preco = ?, estoque = ?,
          estoque_minimo = ?, categoria_id = ?, fornecedor_id = ?
      WHERE id = ?
    `, [nome.trim(), descricao || null, preco, estoque, estoqueMinimo, categoriaId, fornecedorId, req.params.id]);

    if (!result.affectedRows) return res.status(404).json({ erro: "Produto não encontrado." });

    const [rows] = await db.query("SELECT * FROM produtos WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar produto.", detalhe: error.message });
  }
}

export async function excluirProduto(req, res) {
  try {
    const [result] = await db.query("DELETE FROM produtos WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: "Produto não encontrado." });
    res.json({ mensagem: "Produto excluído com sucesso." });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2" || error.code === "ER_ROW_IS_REFERENCED") {
      return res.status(409).json({ erro: "Não é possível excluir produto que possui movimentações." });
    }
    res.status(500).json({ erro: "Erro ao excluir produto.", detalhe: error.message });
  }
}
