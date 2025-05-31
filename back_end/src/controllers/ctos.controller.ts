import { Request, Response } from 'express';
import prisma from '../db/client';

//Rota para listar dados do ultimo CTO lançado
export const getUltimoCTO =  async (req: Request, res: Response) => {
    try {
        const cto = await prisma.cTO.findMany({
            orderBy: {
                CTO_CODIGO: 'desc'
            },
            take: 1,
            include: {
                tecnico: {
                    select: {
                        TEC_NOME: true
                    }},
                cidade: {select: {
                    CID_NOME: true,
                    CID_UF: true
                }}
            }
        });

        if (cto.length > 0) {
            const JSONFormatado = {
                CTO_CODIGO: cto[0].CTO_CODIGO,
                TEC_CODIGO: cto[0].TEC_CODIGO,
                TEC_NOME: cto[0].tecnico?.TEC_NOME || null,
                CTO_DATA: cto[0].CTO_DATA,
                CID_CODIGO: cto[0].CID_CODIGO,
                CID_NOME: cto[0].cidade?.CID_NOME || null,
                CID_UF: cto[0].cidade?.CID_UF || null
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
};

// Rota para cadastrar CTO
export const postCTO = async (req: Request, res: Response) => {
    try {
        const {TEC_CODIGO, CID_CODIGO, CTO_DATA} = req.body;

        //Validações
        if (!TEC_CODIGO || !CID_CODIGO || !CTO_DATA) {
            res.status(400).json({ error: 'Código do técnico, código da cidade, data são obrigatórios' });
            return;
        }

        const cto = await prisma.cTO.create({
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
        res.status(500).json({ error: 'Erro ao criar CTO'});
    }
};