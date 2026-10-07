import { Router } from "express";
import {
  registrarEntrada, registrarSaida, listarMovimentacoes
} from "../controllers/movimentacaoController.js";

const router = Router();

router.get("/", listarMovimentacoes);
router.post("/entradas", registrarEntrada);
router.post("/saidas", registrarSaida);

export default router;
