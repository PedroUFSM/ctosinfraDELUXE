// Função para formatar a data de DD/MM/YYYY para timestamp (para o backend)
export function formatarDataParaTimestamp(dataString) {
    if (!dataString) {
        return null; // Retorna nulo ou lança erro se a data for inválida
    }

    // Pega o momento EXATO de agora (data e hora local)
    const agora = new Date();

    // Extrai o ano, mês e dia da string de data selecionada (ex: "2025-05-30")
    const [year, month, day] = dataString.split('-').map(Number);

    // Ajusta o objeto 'agora' para ter o ANO, MÊS e DIA selecionados,
    // mantendo a HORA, MINUTO, SEGUNDO e MILISSEGUNDO ATUAIS.
    // Importante: month em setMonth é 0-indexado (0 para janeiro, 4 para maio, etc.)
    agora.setFullYear(year, month - 1, day);

    // Retorna o timestamp em milissegundos.
    // Este timestamp representa a data selecionada COM a hora atual do seu computador.
    return agora.getTime();
}

// Função para formatar o timestamp recebido do backend para DD/MM/YYYY HH:MM (para exibição)
export function formatadaDataRecebida(timestamp) {
    if (!timestamp) {
        return 'Nenhuma';
    }
    const date = new Date(timestamp); // Cria um objeto Date a partir do timestamp

    // Extrai componentes da data
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é de 0-11
    const year = date.getFullYear();

    // Extrai componentes da hora
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Retorna a data e hora formatadas
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}