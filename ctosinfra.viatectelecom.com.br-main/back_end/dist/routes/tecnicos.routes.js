"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tecnicos_controller_1 = require("../controllers/tecnicos.controller");
const router = (0, express_1.Router)();
router.get('/', tecnicos_controller_1.getTecnicos);
router.post('/', tecnicos_controller_1.postTecnico);
exports.default = router;
