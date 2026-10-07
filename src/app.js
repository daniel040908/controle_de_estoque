import express from "express";
import cors from "cors";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import fornecedorRoutes from "./routes/fornecedorRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import movimentacaoRoutes from "./routes/movimentacaoRoutes.js";
import relatorioRoutes from "./routes/relatorioRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    sistema: "Controle de Estoque",
    status: "online",
    versao: "1.0.0"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mensagem: "API funcionando." });
});

app.use("/api/categorias", categoriaRoutes);
app.use("/api/fornecedores", fornecedorRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/movimentacoes", movimentacaoRoutes);
app.use("/api/relatorios", relatorioRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

export default app;
