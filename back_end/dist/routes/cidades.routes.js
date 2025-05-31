"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cidades_controller_1 = require("../controllers/cidades.controller");
const router = (0, express_1.Router)();
router.get("/", cidades_controller_1.getCidades);
router.post("/", cidades_controller_1.postCidade);
exports.default = router;
