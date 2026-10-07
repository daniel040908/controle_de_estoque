import db from "../config/database.js";

export async function listarCategorias(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM categorias ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar categorias.", detalhe: error.message });
  }
}

export async function buscarCategoria(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM categorias WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Categoria não encontrada." });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar categoria.", detalhe: error.message });
  }
}

export async function criarCategoria(req, res) {
  const { nome, descricao } = req.body;

  if (!nome?.trim()) {
    return res.status(400).json({ erro: "O nome da categoria é obrigatório." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO categorias (nome, descricao) VALUES (?, ?)",
      [nome.trim(), descricao || null]
    );
    const [rows] = await db.query("SELECT * FROM categorias WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe uma categoria com esse nome." });
    }
    res.status(500).json({ erro: "Erro ao criar categoria.", detalhe: error.message });
  }
}

export async function atualizarCategoria(req, res) {
  const { nome, descricao } = req.body;

  if (!nome?.trim()) {
    return res.status(400).json({ erro: "O nome da categoria é obrigatório." });
  }

  try {
    const [result] = await db.query(
      "UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?",
      [nome.trim(), descricao || null, req.params.id]
    );

    if (!result.affectedRows) return res.status(404).json({ erro: "Categoria não encontrada." });

    const [rows] = await db.query("SELECT * FROM categorias WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe uma categoria com esse nome." });
    }
    res.status(500).json({ erro: "Erro ao atualizar categoria.", detalhe: error.message });
  }
}

export async function excluirCategoria(req, res) {
  try {
    const [result] = await db.query("DELETE FROM categorias WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: "Categoria não encontrada." });
    res.json({ mensagem: "Categoria excluída com sucesso." });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2" || error.code === "ER_ROW_IS_REFERENCED") {
      return res.status(409).json({ erro: "Não é possível excluir categoria utilizada por produtos." });
    }
    res.status(500).json({ erro: "Erro ao excluir categoria.", detalhe: error.message });
  }
}
