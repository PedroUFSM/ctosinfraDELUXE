// src/index.ts (Conteúdo COMPLETO e FINAL após o ajuste da numeração)

import { PrismaClient } from '@prisma/client';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index.routes'; // Suas rotas existentes


// 1. Inicialização do Prisma Client e Express
const prisma = new PrismaClient();
const app = express();

// 2. Middlewares Globais
app.use(cors({ origin: '*' }));
app.use(express.json());

// 3. Suas Rotas Existentes
app.use(routes);

// 4. Início do Servidor (SEMPRE POR ÚLTIMO NO ARQUIVO)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});