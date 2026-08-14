// Elementos da página que serão alterados pelo JavaScript.
const quiz = document.querySelector("#quiz");
const progresso = document.querySelector("#progresso");
const nivel = document.querySelector("#nivel");
const pergunta = document.querySelector("#pergunta");
const alternativas = document.querySelector("#alternativas");
const mensagem = document.querySelector("#mensagem");
const resultado = document.querySelector("#resultado");
const textoResultado = document.querySelector("#texto-resultado");
const botaoReiniciar = document.querySelector("#reiniciar");

// Variáveis que controlam o andamento do quiz.
let perguntas = [];
let atual = 0;
let pontos = 0;

// Lê as perguntas armazenadas no arquivo JSON.
async function carregarPerguntas() {
    try {
        const resposta = await fetch("perguntas.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o arquivo JSON.");
        }

        perguntas = await resposta.json();
        mostrarPergunta();
    } catch (erro) {
        progresso.textContent = erro.message;
        pergunta.textContent =
            "Abra o projeto com o Live Server ou outro servidor local.";
    }
}

// Mostra uma pergunta e cria seus botões de alternativas.
function mostrarPergunta() {
    const perguntaAtual = perguntas[atual];

    progresso.textContent = `Pergunta ${atual + 1} de ${perguntas.length}`;
    nivel.textContent = `Nível: ${perguntaAtual.nivel}`;
    pergunta.textContent = perguntaAtual.enunciado;
    alternativas.innerHTML = "";
    mensagem.textContent = "";

    perguntaAtual.alternativas.forEach((alternativa, indice) => {
        const botao = document.createElement("button");
        botao.textContent = alternativa;
        botao.addEventListener("click", () => verificarResposta(indice, botao));
        alternativas.appendChild(botao);
    });
}

// Verifica a alternativa escolhida pelo usuário.
function verificarResposta(indiceEscolhido, botaoEscolhido) {
    const perguntaAtual = perguntas[atual];
    const botoes = alternativas.querySelectorAll("button");

    botoes.forEach((botao) => {
        botao.disabled = true;
    });

    if (indiceEscolhido === perguntaAtual.correta) {
        pontos++;
        botaoEscolhido.classList.add("correta");
        mensagem.textContent = "Resposta correta!";
    } else {
        botaoEscolhido.classList.add("incorreta");
        botoes[perguntaAtual.correta].classList.add("correta");
        mensagem.textContent =
            `Resposta incorreta. ${perguntaAtual.explicacao}`;
    }

    setTimeout(proximaPergunta, 1600);
}

// Avança para a próxima pergunta ou apresenta o resultado.
function proximaPergunta() {
    atual++;

    if (atual < perguntas.length) {
        mostrarPergunta();
    } else {
        mostrarResultado();
    }
}

// Exibe a pontuação final e uma mensagem de desempenho.
function mostrarResultado() {
    quiz.classList.add("oculto");
    resultado.classList.remove("oculto");

    const percentual = Math.round((pontos / perguntas.length) * 100);
    let avaliacao;

    if (percentual >= 80) {
        avaliacao = "Excelente! Você compreendeu muito bem o tema.";
    } else if (percentual >= 60) {
        avaliacao = "Bom trabalho! Revise apenas alguns conceitos.";
    } else {
        avaliacao = "Continue estudando e tente novamente.";
    }

    textoResultado.textContent =
        `Você acertou ${pontos} de ${perguntas.length} perguntas (${percentual}%). ${avaliacao}`;
}

// Reinicia o quiz sem recarregar o arquivo JSON.
botaoReiniciar.addEventListener("click", () => {
    atual = 0;
    pontos = 0;
    resultado.classList.add("oculto");
    quiz.classList.remove("oculto");
    mostrarPergunta();
});

// Inicia a aplicação.
carregarPerguntas();
