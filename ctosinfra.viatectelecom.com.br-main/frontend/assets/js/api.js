import { API_URL } from './config.js';

async function getCidades() {
    try {
        const response = await fetch(API_URL + 'cidades', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            return result.map(cidade => {
                return {
                    id: cidade.CID_CODIGO,
                    nome: cidade.CID_NOME,
                    uf: cidade.CID_UF,
                    ibge: cidade.CID_IBGE
                };
            });
        }
        else {
            throw new Error('Erro ao carregar cidades: ' + response.statusText);
        }
    }
    catch (error) {
        console.error('Erro ao carregar cidades:', error);
        throw error;
    }
}

async function getTecnicos() {
    try {
        const response = await fetch(API_URL + 'tecnicos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();

            // Aqui agora está certo
            return result.map(tecnico => ({
                id: tecnico.TEC_CODIGO,
                nome: tecnico.TEC_NOME,
                situacao: tecnico.TEC_SITUACAO
            }));
        } else {
            throw new Error('Erro ao carregar técnicos: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro ao carregar técnicos:', error);
        throw error;
    }
}

async function postCTO(tecnicoCodigo, cidadeCodigo, data) {
    try {
        // 'data' já é o timestamp em milissegundos vindo do helpers.js
        // new Date(data) cria um objeto Date a partir desse timestamp
        // .toISOString() converte para o formato ISO 8601 COMPLETO (com data e hora em UTC)
        const response = await fetch(API_URL + 'ctos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TEC_CODIGO: tecnicoCodigo,
                CID_CODIGO: cidadeCodigo,
                CTO_DATA: new Date(data).toISOString() // <-- ALTERADO AQUI! Removido o .slice(0, 10)
            })
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        }
        else {
            // Adicionado response.text() para pegar mensagens de erro mais detalhadas do servidor
            const errorDetails = await response.text();
            throw new Error(`Erro ao criar CTO: ${response.status} ${response.statusText} - Detalhes: ${errorDetails}`);
        }
    }
    catch (error) {
        console.error('Erro ao criar CTO:', error);
        throw error;
    }
}

async function getUltimoCTO() {
    try {
        const response = await fetch(API_URL + 'ctos/ultimo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            
            return {
                CTO_CODIGO: result.CTO_CODIGO,
                TEC_CODIGO: result.TEC_CODIGO,
                TEC_NOME: result.TEC_NOME,
                CID_CODIGO: result.CID_CODIGO,
                CID_UF: result.CID_UF,
                CID_NOME: result.CID_NOME,
                CTO_DATA: result.CTO_DATA
            };
        }
    }
    catch (error) {
        console.error('Erro ao carregar último CTO:', error);
        throw error;
    }
}

async function postTecnico(nomeTecnico, situacaoTecnico) {
    const situacaoInt = parseInt(situacaoTecnico);

    try {
        const response = await fetch(API_URL + 'tecnicos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeTecnico,
                situacao: situacaoInt
            })
        });

        // Verificação de sucesso deve ser response.ok, não response.created
        if (response.ok) { // Alterado de response.created para response.ok
            const result = await response.json();
            return result;
        } else {
            const errorDetails = await response.text(); // Adicionado para detalhes de erro
            throw new Error(`Erro ao criar técnico: ${response.status} ${response.statusText} - Detalhes: ${errorDetails}`);
        }
    } catch (error) {
        console.error('Erro ao criar técnico:', error);
        throw error;
    }
    
}

export { getCidades, getTecnicos, postCTO, getUltimoCTO, postTecnico };