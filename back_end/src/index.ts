import { PrismaClient } from '@prisma/client';
import express, {Request, Response} from 'express';
import cors from 'cors';
import routes from './routes/index.routes';


const prisma = new PrismaClient();
const app = express();

app.use(cors( {origin: '*'}));
app.use(express.json());
app.use(routes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

    