import db from "../config/database.js";

export async function registrarEntrada(req, res) {
  const { produtoId, quantidade, observacao } = req.body;

  if (!produtoId || !Number.isInteger(Number(quantidade)) || Number(quantidade) <= 0) {
    return res.status(400).json({ erro: "Produto e quantidade inteira maior que zero são obrigatórios." });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [produtos] = await connection.query(
      "SELECT id FROM produtos WHERE id = ? FOR UPDATE",
      [produtoId]
    );

    if (!produtos.length) {
      await connection.rollback();
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    await connection.query(
      "INSERT INTO entradas (produto_id, quantidade, observacao) VALUES (?, ?, ?)",
      [produtoId, quantidade, observacao || null]
    );

    await connection.query(
      "UPDATE produtos SET estoque = estoque + ? WHERE id = ?",
      [quantidade, produtoId]
    );

    await connection.commit();

    res.status(201).json({
      mensagem: "Entrada registrada e estoque atualizado com sucesso.",
      produtoId,
      quantidade
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ erro: "Erro ao registrar entrada.", detalhe: error.message });
  } finally {
    connection.release();
  }
}

export async function registrarSaida(req, res) {
  const { produtoId, quantidade, observacao } = req.body;

  if (!produtoId || !Number.isInteger(Number(quantidade)) || Number(quantidade) <= 0) {
    return res.status(400).json({ erro: "Produto e quantidade inteira maior que zero são obrigatórios." });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [produtos] = await connection.query(
      "SELECT id, estoque FROM produtos WHERE id = ? FOR UPDATE",
      [produtoId]
    );

    if (!produtos.length) {
      await connection.rollback();
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    if (produtos[0].estoque < quantidade) {
      await connection.rollback();
      return res.status(409).json({
        erro: "Estoque insuficiente.",
        estoqueAtual: produtos[0].estoque,
        quantidadeSolicitada: Number(quantidade)
      });
    }

    await connection.query(
      "INSERT INTO saidas (produto_id, quantidade, observacao) VALUES (?, ?, ?)",
      [produtoId, quantidade, observacao || null]
    );

    await connection.query(
      "UPDATE produtos SET estoque = estoque - ? WHERE id = ?",
      [quantidade, produtoId]
    );

    await connection.commit();

    res.status(201).json({
      mensagem: "Saída registrada e estoque atualizado com sucesso.",
      produtoId,
      quantidade
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ erro: "Erro ao registrar saída.", detalhe: error.message });
  } finally {
    connection.release();
  }
}

export async function listarMovimentacoes(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM vw_movimentacoes
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar movimentações.", detalhe: error.message });
  }
}
