import dotenv from "dotenv";
import app from "./app.js";
import db from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log("Banco de dados conectado com sucesso.");
    });
  } catch (error) {
    console.error("Não foi possível conectar ao MySQL.");
    console.error(error.message);
    process.exit(1);
  }
}

iniciarServidor();
