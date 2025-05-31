import { Request, Response } from 'express';
import prisma from '../db/client';;

// Rota para obter cidades
export const getCidades = async (req: Request, res: Response) => {
    try {
        const cidades = await prisma.cidade.findMany();
        res.json(cidades);
    }
    catch (error) {
        console.error('Erro ao buscar cidades:', error);
        res.status(500).json({ error: 'Erro ao buscar cidades' });
    }
};

//Rota para cadastrar cidade
export const postCidade = async (req: Request, res: Response) => {
    const { nome, estado, cep, cod_ibge } = req.body;

    // Validações
    if (!nome || !estado || !cod_ibge) {
        res.status(400).json({ error: 'Nome, estado e código IBGE são obrigatórios' });
        return;
    }
    try {
        const cidade = await prisma.cidade.create({
            data: {
                CID_NOME: nome,
                CID_UF: estado,
                CID_CEP: cep,
                CID_IBGE: cod_ibge
            }
        });

        res.status(201).json(cidade);
    }
    catch (error) {
        console.error('Erro ao criar cidade:', error);
        res.status(500).json({ error: 'Erro ao criar cidade'});
    }
};