"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTecnico = exports.getTecnicos = void 0;
const client_1 = __importDefault(require("../db/client"));
// Rota para listar técnicos
const getTecnicos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tecnicos = yield client_1.default.tecnico.findMany();
        res.json(tecnicos);
    }
    catch (error) {
        console.error('Erro ao buscar técnicos:', error);
        res.status(500).json({ error: 'Erro ao buscar técnicos' });
    }
});
exports.getTecnicos = getTecnicos;
// Rota para cadastrar técnico
const postTecnico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, situacao } = req.body;
    // Validações
    if (!nome || !situacao) {
        res.status(400).json({ error: 'Nome e situação são obrigatórios' });
        return;
    }
    let situacaoInt = parseInt(situacao);
    try {
        const tecnico = yield client_1.default.tecnico.create({
            data: {
                TEC_NOME: nome,
                TEC_SITUACAO: situacaoInt
            }
        });
        res.status(201).json(tecnico);
    }
    catch (error) {
        console.error('Erro ao criar técnico:', error);
        res.status(500).json({ error: 'Erro ao criar técnico' });
    }
});
exports.postTecnico = postTecnico;
