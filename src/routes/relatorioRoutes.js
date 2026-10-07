import { Router } from "express";
import {
  estoque, estoqueBaixo, estoqueZero, movimentacoes
} from "../controllers/relatorioController.js";

const router = Router();

router.get("/estoque", estoque);
router.get("/estoque-baixo", estoqueBaixo);
router.get("/estoque-zero", estoqueZero);
router.get("/movimentacoes", movimentacoes);

export default router;
