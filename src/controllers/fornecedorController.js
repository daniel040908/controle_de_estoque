import db from "../config/database.js";

export async function listarFornecedores(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM fornecedores ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar fornecedores.", detalhe: error.message });
  }
}

export async function buscarFornecedor(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM fornecedores WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Fornecedor não encontrado." });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar fornecedor.", detalhe: error.message });
  }
}

export async function criarFornecedor(req, res) {
  const { nome, email, telefone } = req.body;

  if (!nome?.trim() || !email?.trim()) {
    return res.status(400).json({ erro: "Nome e e-mail são obrigatórios." });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ erro: "Informe um e-mail válido." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO fornecedores (nome, email, telefone) VALUES (?, ?, ?)",
      [nome.trim(), email.trim().toLowerCase(), telefone || null]
    );
    const [rows] = await db.query("SELECT * FROM fornecedores WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe fornecedor com esse e-mail." });
    }
    res.status(500).json({ erro: "Erro ao criar fornecedor.", detalhe: error.message });
  }
}

export async function atualizarFornecedor(req, res) {
  const { nome, email, telefone } = req.body;

  if (!nome?.trim() || !email?.trim()) {
    return res.status(400).json({ erro: "Nome e e-mail são obrigatórios." });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ erro: "Informe um e-mail válido." });
  }

  try {
    const [result] = await db.query(
      "UPDATE fornecedores SET nome = ?, email = ?, telefone = ? WHERE id = ?",
      [nome.trim(), email.trim().toLowerCase(), telefone || null, req.params.id]
    );

    if (!result.affectedRows) return res.status(404).json({ erro: "Fornecedor não encontrado." });

    const [rows] = await db.query("SELECT * FROM fornecedores WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe fornecedor com esse e-mail." });
    }
    res.status(500).json({ erro: "Erro ao atualizar fornecedor.", detalhe: error.message });
  }
}

export async function excluirFornecedor(req, res) {
  try {
    const [result] = await db.query("DELETE FROM fornecedores WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: "Fornecedor não encontrado." });
    res.json({ mensagem: "Fornecedor excluído com sucesso." });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2" || error.code === "ER_ROW_IS_REFERENCED") {
      return res.status(409).json({ erro: "Não é possível excluir fornecedor utilizado por produtos." });
    }
    res.status(500).json({ erro: "Erro ao excluir fornecedor.", detalhe: error.message });
  }
}
