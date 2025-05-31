import { PrismaClient } from '@prisma/client';
import express, {Request, Response} from 'express';
import cors from 'cors';
import routes from './routes/index.routes';

const prisma = new PrismaClient();
const app = express();

app.use(cors( {origin: '*'}));
app.use(express.json());
app.use(routes);

// ========================================================================
// COLE O CÓDIGO DO ENDPOINT TEMPORÁRIO AQUI ABAIXO, ANTES DO app.listen
// ========================================================================

app.get('/ajustar-numero-cto', async (req: Request, res: Response) => {
    try {
        // 1. Verificar o número de CTO mais alto atual no banco usando Prisma
        // ASSUMIR: seu modelo Prisma para CTOs se chama 'cto' (minúsculo)
        // ASSUMIR: a coluna para o código da CTO no seu schema.prisma é 'cto_codigo'
        const latestCTO = await prisma.cto.findFirst({
            orderBy: {
                cto_codigo: 'desc', // Prisma deve ordenar corretamente mesmo se for string para números
            },
            select: {
                cto_codigo: true, // Seleciona apenas o campo cto_codigo
            },
        });

        let currentHighestCTO: number | null = null;
        if (latestCTO && latestCTO.cto_codigo !== undefined && latestCTO.cto_codigo !== null) {
            // Converte para número, pois Prisma pode retornar como string se for VARCHAR no DB
            currentHighestCTO = parseInt(latestCTO.cto_codigo.toString());
        }

        // A meta é que o próximo número seja 2100, então o atual mais alto precisa ser 2099.
        if (currentHighestCTO === 2099) {
            return res.status(200).json({ message: 'O número de CTO mais alto já é 2099. Nenhuma ação necessária.', current: currentHighestCTO });
        }

        if (currentHighestCTO !== null && currentHighestCTO < 2099) {
            // Se o atual for menor que 2099, vamos ATUALIZAR o registro de CTO mais alto para 2099.
            // Isso atualiza o registro que acabamos de encontrar como o "mais alto"
            const updatedCTO = await prisma.cto.updateMany({
                where: {
                    cto_codigo: latestCTO?.cto_codigo, // Filtra pelo cto_codigo atual mais alto
                },
                data: {
                    cto_codigo: '2099', // Certifique-se que o tipo (string ou número) é o que seu schema.prisma espera
                },
            });

            if (updatedCTO.count > 0) {
                return res.status(200).json({ message: 'Número de CTO mais alto atualizado para 2099 com sucesso.', previous: currentHighestCTO, new: 2099 });
            } else {
                return res.status(500).json({ message: 'Falha ao atualizar o CTO mais alto. Verifique a lógica de atualização ou se o registro existe.' });
            }

        } else if (currentHighestCTO === null) {
            // Se não houver CTOs no banco, INSERIR o CTO 2099.
            // ATENÇÃO: As colunas e valores aqui precisam corresponder EXATAMENTE ao seu schema.prisma
            // e você precisa de IDs válidos para 'tecId' e 'cidId' se eles são chaves estrangeiras obrigatórias.
            const newCTO = await prisma.cto.create({
                data: {
                    cto_codigo: '2099', // Certifique-se do tipo (String ou Int)
                    // Abaixo, preencha com os nomes de campos e valores padrão/válidos do seu schema.prisma
                    tecId: 1, // Exemplo: substitua pelo ID de um técnico válido
                    cidId: 1, // Exemplo: substitua pelo ID de uma cidade válida
                    cto_data: new Date(), // Data/hora atual
                    // ... outras colunas obrigatórias do seu modelo 'cto'
                },
            });
            return res.status(200).json({ message: 'CTO 2099 inserido como o primeiro/novo mais alto.', new: newCTO.cto_codigo });

        } else {
            // currentHighestCTO já é maior que 2099 ou algum valor inesperado (não deveria acontecer se a lógica estiver correta)
            return res.status(200).json({ message: `O número de CTO mais alto (${currentHighestCTO}) já é maior ou igual a 2099. Nenhuma ação necessária.`, current: currentHighestCTO });
        }

    } catch (error: any) { // 'any' para facilitar, ou tipar melhor o erro
        console.error('Erro ao ajustar número da CTO:', error);
        res.status(500).json({ error: 'Erro interno ao ajustar número da CTO: ' + error.message });
    } finally {
        // É uma boa prática desconectar o PrismaClient após a operação, especialmente em funções de uso único
        // Se seu prisma client for global, não desconecte aqui, faça-o no desligamento do servidor.
        // Se for uma instância criada apenas para esta função, pode desconectar.
        // await prisma.$disconnect();
    }
});

// ========================================================================
// FIM DO ENDPOINT TEMPORÁRIO. LEMBRE-SE DE REMOVÊ-LO!
// ========================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});