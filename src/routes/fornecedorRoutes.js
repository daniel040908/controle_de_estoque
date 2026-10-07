import { Router } from "express";
import {
  listarFornecedores, buscarFornecedor, criarFornecedor,
  atualizarFornecedor, excluirFornecedor
} from "../controllers/fornecedorController.js";

const router = Router();

router.get("/", listarFornecedores);
router.get("/:id", buscarFornecedor);
router.post("/", criarFornecedor);
router.put("/:id", atualizarFornecedor);
router.delete("/:id", excluirFornecedor);

export default router;
