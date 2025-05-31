"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cidades_routes_1 = __importDefault(require("./cidades.routes"));
const tecnicos_routes_1 = __importDefault(require("./tecnicos.routes"));
const ctos_routes_1 = __importDefault(require("./ctos.routes"));
const router = (0, express_1.Router)();
router.use('/cidades', cidades_routes_1.default);
router.use('/tecnicos', tecnicos_routes_1.default);
router.use('/ctos', ctos_routes_1.default);
exports.default = router;
