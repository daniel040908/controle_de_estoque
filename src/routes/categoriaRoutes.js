import { Router } from "express";
import {
  listarCategorias, buscarCategoria, criarCategoria,
  atualizarCategoria, excluirCategoria
} from "../controllers/categoriaController.js";

const router = Router();

router.get("/", listarCategorias);
router.get("/:id", buscarCategoria);
router.post("/", criarCategoria);
router.put("/:id", atualizarCategoria);
router.delete("/:id", excluirCategoria);

export default router;
