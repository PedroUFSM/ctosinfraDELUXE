import { getTecnicos, getCidades, postCTO, getUltimoCTO, postTecnico } from './api.js';
import { formatarDataParaTimestamp, formatadaDataRecebida } from '../../utils/helpers.js';

// --- FUNÇÃO PARA MOSTRAR/ESCONDER MENSAGEM DE PROCESSAMENTO NA CAIXA AZUL ---
function toggleProcessingMessage(show, message = "Com base na sua consulta, um momento...") {
    const suggestionBox = document.querySelector('.cto-suggestion-box');
    const introMessage = document.querySelector('.suggestion-intro-message');
    const suggestedNumberDisplay = document.querySelector('.suggested-number-display');
    const outroMessage = document.querySelector('.suggestion-outro-message');
    const ctoDetails = document.querySelector('.cto-details');

    if (show) {
        suggestionBox.style.display = 'block'; // Garante que a caixa esteja visível
        introMessage.textContent = message;
        suggestedNumberDisplay.innerHTML = '<span>...</span>'; // Mostra um indicador de carregamento
        suggestedNumberDisplay.style.animation = 'none'; // Para a animação de pulsar enquanto carrega
        outroMessage.textContent = ''; // Limpa a mensagem final
        ctoDetails.style.display = 'none'; // Esconde os detalhes menores durante o carregamento
    } else {
        // Quando o processamento terminar, os dados serão carregados e a caixa atualizada
        // A animação de pulsar será reativada pelo carregarUltimoCTO
        ctoDetails.style.display = 'block'; // Mostra os detalhes novamente
        suggestedNumberDisplay.style.animation = 'pulse 2s infinite ease-in-out'; // Reativa a animação
    }
}

// --- FUNÇÃO PARA MOSTRAR MENSAGENS DE FEEDBACK (SUCESSO/ERRO) NA TELA (Substitui alerts) ---
function showFeedback(message, isSuccess = true) {
    const feedbackDiv = document.getElementById('feedbackMessage');
    if (feedbackDiv) {
        feedbackDiv.textContent = message;
        feedbackDiv.style.color = isSuccess ? '#4CAF50' : '#F44336'; // Verde para sucesso, vermelho para erro
        feedbackDiv.style.display = 'block'; // Garante que esteja visível
        // Oculta a mensagem após alguns segundos
        setTimeout(() => {
            feedbackDiv.textContent = '';
            feedbackDiv.style.display = 'none';
        }, 5000); // 5 segundos
    }
}

// --- CARREGAMENTO INICIAL DE DADOS E PRÉ-SELEÇÃO DE DATA ---
document.addEventListener("DOMContentLoaded", async () => {
    // Carregar técnicos
    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        const selectTecnico = document.getElementById('descricao_tecnico');
        try {
            const tecnicos = await getTecnicos();
            tecnicos.forEach(tecnico => {
                const option = document.createElement('option');
                option.value = tecnico.id;
                option.textContent = tecnico.nome;
                selectTecnico.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar técnicos:", error);
            showFeedback("Erro ao carregar técnicos.", false);
        }

        // --- NOVO: Pré-seleciona a data atual no campo de data ---
        const inputData = document.getElementById('data');
        if (inputData) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado, então +1
            const day = String(today.getDate()).padStart(2, '0');
            inputData.value = `${year}-${month}-${day}`; // Formato YYYY-MM-DD para input type="date"
        }
    }

    // Carregar cidades
    if (window.location.pathname.endsWith("index.html")) {
        const selectCidade = document.getElementById('nome_cidade');
        try {
            const cidades = await getCidades();
            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.id;
                option.textContent = cidade.nome;
                selectCidade.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar cidades:", error);
            showFeedback("Erro ao carregar cidades.", false);
        }
    }

    // Carregar último CTO ao carregar a página principal
    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        carregarUltimoCTO();
    }
});


// --- LÓGICA DO BOTÃO SALVAR CTO ---
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        const btnSalvar = document.getElementById('btnSalvarCTO');

        // Limpa feedback ao interagir com os campos
        const inputsAndSelects = document.querySelectorAll('#descricao_tecnico, #nome_cidade, #data');
        inputsAndSelects.forEach(element => {
            element.addEventListener('change', () => showFeedback('', true));
            element.addEventListener('input', () => showFeedback('', true));
        });


        btnSalvar.addEventListener("click", async () => {
            const tecnicoCodigo = document.getElementById("descricao_tecnico").value;
            const cidade = document.getElementById("nome_cidade").value;
            const data = document.getElementById("data").value;
            const dataFormatada = formatarDataParaTimestamp(data); // Agora pega a hora atual

            // Validações
            if (!tecnicoCodigo || !cidade || !data) {
                showFeedback("Preencha todos os campos antes de salvar.", false);
                return;
            }

            // Exibir mensagem de processamento ANTES de enviar a requisição
            toggleProcessingMessage(true, "Processando sua solicitação, aguarde...");
            showFeedback("Salvando CTO...", true); 

            try {
                const resposta = await postCTO(tecnicoCodigo, cidade, dataFormatada);
                console.log("CTO salvo com sucesso:", resposta);
                
                // Exibe uma mensagem de sucesso temporária
                showFeedback("CTO salvo com sucesso! Recarregando a página...", true);

                // --- NOVO: FORÇA UM RECARREGAMENTO COMPLETO DA PÁGINA ---
                setTimeout(() => {
                    location.reload(); 
                }, 1000); 

            } catch (error) {
                console.error("Erro ao salvar CTO:", error);
                showFeedback("Erro ao salvar CTO. Verifique o servidor ou a conexão.", false); 

                document.querySelector('.suggestion-intro-message').textContent = "Ocorreu um erro ao processar.";
                document.querySelector('.suggested-number-display').innerHTML = '<span>ERRO</span>';
                document.querySelector('.suggestion-outro-message').textContent = "Tente novamente.";
                toggleProcessingMessage(false); 
            }
        });
    }
});


// --- FUNÇÃO PARA CARREGAR E EXIBIR O ÚLTIMO CTO ---
async function carregarUltimoCTO() {
    try {
        const ultimoCTO = await getUltimoCTO();
        let dataCTO;
        let cidadeFormatada;

        // Se não houver nenhum CTO cadastrado ainda (ultimoCTO for null/undefined ou vazio)
        if (!ultimoCTO || Object.keys(ultimoCTO).length === 0) {
            document.getElementById('displayNumeroCtoGrande').textContent = 'N/A'; 
            document.querySelector('.suggestion-intro-message').textContent = "Nenhum CTO cadastrado ainda.";
            document.querySelector('.suggestion-outro-message').textContent = "Cadastre um novo!";
            document.getElementById('displayNumeroCtoPequeno').textContent = 'Nenhum';
            document.getElementById('displayTecnicoCto').textContent = 'Nenhum';
            document.getElementById('displayDataCto').textContent = 'Nenhuma';
            document.getElementById('displayCidadeCto').textContent = 'Nenhuma';
            toggleProcessingMessage(false); 
            return; 
        }

        // --- PREPARAÇÃO DOS DADOS DO ÚLTIMO CTO ---
        ultimoCTO.CTO_CODIGO = ultimoCTO.CTO_CODIGO || "Nenhum";
        ultimoCTO.TEC_NOME = ultimoCTO.TEC_NOME || "Nenhum";
        
        dataCTO = ultimoCTO.CTO_DATA ? formatadaDataRecebida(ultimoCTO.CTO_DATA) : "Nenhuma"; // Usa a função do helpers que agora inclui a hora
        
        cidadeFormatada = (ultimoCTO.CID_NOME && ultimoCTO.CID_UF) ? `${ultimoCTO.CID_NOME} - ${ultimoCTO.CID_UF}` : "Nenhuma";
        
        // --- ATUALIZA OS ELEMENTOS DO HTML COM OS NOVOS DADOS ---
        document.getElementById('displayNumeroCtoGrande').textContent = ultimoCTO.CTO_CODIGO; 
        document.querySelector('.suggestion-intro-message').textContent = "Com base na sua consulta..."; 
        document.querySelector('.suggestion-outro-message').textContent = "Você pode utilizar este número!"; 
        
        // Detalhes pequenos
        document.getElementById('displayNumeroCtoPequeno').textContent = ultimoCTO.CTO_CODIGO;
        document.getElementById('displayTecnicoCto').textContent = ultimoCTO.TEC_NOME;
        document.getElementById('displayDataCto').textContent = dataCTO;
        document.getElementById('displayCidadeCto').textContent = cidadeFormatada;
        
        toggleProcessingMessage(false); 

    } catch (error) {
        console.error('Erro ao carregar o último CTO:', error);
        showFeedback('Erro ao carregar o último CTO. Verifique o servidor ou a conexão.', false); 

        document.querySelector('.suggestion-intro-message').textContent = "Erro ao carregar informações.";
        document.querySelector('.suggested-number-display').innerHTML = '<span>ERRO</span>';
        document.querySelector('.suggestion-outro-message').textContent = "Por favor, tente novamente.";

        document.getElementById('displayNumeroCtoPequeno').textContent = 'Erro';
        document.getElementById('displayTecnicoCto').textContent = 'Erro';
        document.getElementById('displayDataCto').textContent = 'Erro';
        document.getElementById('displayCidadeCto').textContent = 'Erro';
        
        toggleProcessingMessage(false); 
    }
}


// --- LÓGICA DO BOTÃO SALVAR TÉCNICO (TECNICO.HTML) ---
// NOTA: Para um feedback não-bloqueante nesta página (tecnico.html), você precisaria adicionar um
// elemento <div id="feedbackMessage"> também em tecnico.html e ajustar esta seção para usar showFeedback.
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.endsWith("tecnico.html")) {
        const btnSalvarTecnico = document.getElementById('btnSalvarTecnico'); 

        if (btnSalvarTecnico) { 
            btnSalvarTecnico.addEventListener("click", async () => {
                const nomeTecnico = document.getElementById("nomeTecnico").value;
                const situacaoTecnico = document.getElementById("situacaoTecnico").value;

                if (!nomeTecnico || !situacaoTecnico) {
                    alert("Preencha todos os campos antes de salvar."); 
                    return;
                }

                try {
                    const resposta = await postTecnico(nomeTecnico, situacaoTecnico);
                    console.log("Técnico salvo com sucesso:", resposta);
                    alert("Técnico salvo com sucesso!"); 
                } catch (error) {
                    console.error("Erro ao cadastrar técnico:", error);
                    alert("Erro ao cadastrar técnico." + error); 
                }
            });
        }
    }
});