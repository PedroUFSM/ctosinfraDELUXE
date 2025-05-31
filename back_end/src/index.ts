// ========================================================================
// ATENÇÃO: ESTE É UM ENDPOINT TEMPORÁRIO PARA AJUSTE DO BANCO DE DADOS.
// REMOVA ESTE CÓDIGO APÓS A EXECUÇÃO BEM-SUCEDIDA!
// ========================================================================

// Supondo que 'app' seja sua instância do Express (ex: const app = express();)
// Supondo que 'prisma' seja sua instância do PrismaClient (ex: const prisma = new PrismaClient();)
// Use Request e Response do Express para tipagem, se estiver usando TypeScript rigoroso
import { Request, Response } from 'express'; // Certifique-se que já estão importados

app.get('/ajustar-numero-cto', async (req: Request, res: Response) => {
    try {
        // O nome da sequência é geralmente 'nome_da_tabela_nome_da_coluna_seq' em minúsculas no PostgreSQL.
        // Com base no seu schema.prisma (model CTO { CTO_CODIGO Int @id @default(autoincrement()) }),
        // a sequência associada é 'cto_cto_codigo_seq'.

        // Queremos que o PRÓXIMO número auto-incrementado seja 2100.
        // Para isso, definimos o valor atual da sequência para 2099 e usamos 'true'
        // (o 'true' indica que '2099' já foi "usado", então o próximo será 2099 + 1 = 2100).
        await prisma.$executeRawUnsafe(`SELECT setval('cto_cto_codigo_seq', 2099, true);`);

        // Opcional: Para confirmar qual será o próximo valor após a execução
        // (currval() funciona se setval() ou nextval() já foi chamado na sessão)
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
    }
});

// ========================================================================
// FIM DO ENDPOINT TEMPORÁRIO. LEMBRE-SE DE REMOVÊ-LO!
// ========================================================================