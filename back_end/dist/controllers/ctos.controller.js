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
exports.postCTO = exports.getUltimoCTO = void 0;
const client_1 = __importDefault(require("../db/client"));
//Rota para listar dados do ultimo CTO lançado
const getUltimoCTO = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const cto = yield client_1.default.cTO.findMany({
            orderBy: {
                CTO_CODIGO: 'desc'
            },
            take: 1,
            include: {
                tecnico: {
                    select: {
                        TEC_NOME: true
                    }
                },
                cidade: { select: {
                        CID_NOME: true,
                        CID_UF: true
                    } }
            }
        });
        if (cto.length > 0) {
            const JSONFormatado = {
                CTO_CODIGO: cto[0].CTO_CODIGO,
                TEC_CODIGO: cto[0].TEC_CODIGO,
                TEC_NOME: ((_a = cto[0].tecnico) === null || _a === void 0 ? void 0 : _a.TEC_NOME) || null,
                CTO_DATA: cto[0].CTO_DATA,
                CID_CODIGO: cto[0].CID_CODIGO,
                CID_NOME: ((_b = cto[0].cidade) === null || _b === void 0 ? void 0 : _b.CID_NOME) || null,
                CID_UF: ((_c = cto[0].cidade) === null || _c === void 0 ? void 0 : _c.CID_UF) || null
            };
            res.status(200).json(JSONFormatado);
        }
        else {
            res.status(200).json({});
        }
    }
    catch (error) {
        console.error('Erro ao buscar último CTO:', error);
        res.status(500).json({ error: 'Erro ao buscar último CTO' });
    }
});
exports.getUltimoCTO = getUltimoCTO;
// Rota para cadastrar CTO
const postCTO = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { TEC_CODIGO, CID_CODIGO, CTO_DATA } = req.body;
        //Validações
        if (!TEC_CODIGO || !CID_CODIGO || !CTO_DATA) {
            res.status(400).json({ error: 'Código do técnico, código da cidade, data são obrigatórios' });
            return;
        }
        const cto = yield client_1.default.cTO.create({
            data: {
                TEC_CODIGO: parseInt(TEC_CODIGO),
                CID_CODIGO: parseInt(CID_CODIGO),
                CTO_DATA: new Date(CTO_DATA)
            }
        });
        res.status(201).json(cto);
    }
    catch (error) {
        console.error('Erro ao criar CTO:', error);
        res.status(500).json({ error: 'Erro ao criar CTO' });
    }
});
exports.postCTO = postCTO;
