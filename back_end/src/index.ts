// src/index.ts (Conteúdo COMPLETO e FINAL para substituir TUDO no seu arquivo)

import { PrismaClient } from '@prisma/client';
import express, { Request, Response, NextFunction } from 'express'; // Importar NextFunction também
import cors from 'cors';
import routes from './routes/index.routes'; // Suas rotas existentes


// 1. Inicialização do Prisma Client e Express (PRECISAM ESTAR AQUI, ANTES DE QUALQUER app.use ou app.get)
const prisma = new PrismaClient();
const app = express();

// 2. Middlewares Globais (antes das rotas, como cors e express.json)
app.use(cors({ origin: '*' }));
app.use(express.json());

// 3. Suas Rotas Existentes (do arquivo index.routes)
// Esta linha deve estar aqui, antes do endpoint temporário.
app.use(routes);

// ========================================================================
// 4. ENDPOINT TEMPORÁRIO PARA AJUSTE DO BANCO DE DADOS.
//    COLE ESTE BLOCO EXATAMENTE AQUI, APÓS app.use(routes);
//    REMOVA ESTE CÓDIGO APÓS A EXECUÇÃO BEM-SUCEDIDA!
// ========================================================================

app.get('/ajustar-numero-cto', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Comando para ajustar a sequência do auto-incremento no PostgreSQL.
        // Isso fará com que o PRÓXIMO CTO_CODIGO gerado seja 2100.
        await prisma.$executeRawUnsafe(`SELECT setval('cto_cto_codigo_seq', 2099, true);`);

        // Bloco opcional para confirmação do próximo número (para feedback na API)
        let nextNumberConfirmation = 2100;
        try {
            const currentSequenceState: any[] = await prisma.$queryRaw`SELECT currval('cto_cto_codigo_seq');`;
            if (currentSequenceState && currentSequenceState.length > 0 && currentSequenceState[0].currval) {
                nextNumberConfirmation = parseInt(currentSequenceState[0].currval) + 1;
            }
        } catch (e) {
            console.warn("Não foi possível obter currval da sequência, assumindo próximo como 2100.");
        }

        return res.status(200).json({
            message: `Sequência de CTO_CODIGO ajustada com sucesso! O próximo número auto-incrementado será ${nextNumberConfirmation}.`,
            sequencedTo: 2099
        });

    } catch (error: any) {
        console.error('Erro ao ajustar a sequência da CTO:', error);
        res.status(500).json({ error: 'Erro interno ao ajustar sequência da CTO: ' + error.message });
        // next(error); // Opcional: passa o erro para um middleware de tratamento de erros, se houver
    }
});

// ========================================================================
// FIM DO ENDPOINT TEMPORÁRIO. LEMBRE-SE DE REMOVÊ-LO!
// ========================================================================

// 5. Início do Servidor (SEMPRE POR ÚLTIMO NO ARQUIVO)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});