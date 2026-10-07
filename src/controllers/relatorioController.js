import db from "../config/database.js";

export async function estoque(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM vw_estoque_produtos ORDER BY produto");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao consultar VIEW de estoque.", detalhe: error.message });
  }
}

export async function estoqueBaixo(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM vw_estoque_produtos
      WHERE estoque <= estoque_minimo
      ORDER BY estoque ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao consultar estoque baixo.", detalhe: error.message });
  }
}

export async function estoqueZero(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM vw_estoque_produtos
      WHERE estoque = 0
      ORDER BY produto
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao consultar estoque zerado.", detalhe: error.message });
  }
}

export async function movimentacoes(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM vw_movimentacoes
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao consultar movimentações.", detalhe: error.message });
  }
}
