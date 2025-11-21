const cardContainer = document.querySelector("#card-container");
const inputBusca = document.querySelector("#input-busca");
const containerBusca = document.querySelector("#container-busca");
const botaoAssinaturaHeader = document.querySelector("#botao-assinatura");
const ctaAssinatura = document.querySelector(".cta-assinatura");
const botaoLogin = document.querySelector("#botao-login");
const loginModal = document.querySelector("#login-modal");
const closeModalButton = document.querySelector("#close-modal");
const loginForm = document.querySelector("#login-form");
let todosOsDados = [];

// Função para inicializar o banco de dados de usuários com um admin padrão
function inicializarUsuarios() {
    const usuarios = localStorage.getItem('usuariosCineStream');
    if (!usuarios) {
        const adminUser = [{ email: 'admin@cinestream.com', password: 'admin123', isAdmin: true }];
        localStorage.setItem('usuariosCineStream', JSON.stringify(adminUser));
    }
}

// Função que verifica se o usuário é um "assinante"
function verificarStatusAssinatura() {
    if (localStorage.getItem('assinante') === 'true') {
        // Se for assinante, mostra o campo de busca
        if (containerBusca) {
            containerBusca.style.display = 'flex';
        }
        // E transforma o botão "Assine Agora" em "Minha Conta"
        if (botaoAssinaturaHeader && botaoLogin) {
            botaoAssinaturaHeader.textContent = 'Minha Conta';
            botaoAssinaturaHeader.href = 'conta.html';
            // Remove o botão de login, já que o usuário está logado
            botaoLogin.style.display = 'none';
        }
        // E esconde a seção de CTA (call-to-action) da assinatura
        if (ctaAssinatura) {
            ctaAssinatura.style.display = 'none';
        }

        // Carrega e exibe todos os cards de filmes e séries para o assinante
        iniciarBusca();
    }
}

// Função para carregar os dados do JSON apenas uma vez.
async function carregarDados() {
    // Verifica se já temos dados no localStorage
    const dadosLocais = localStorage.getItem('catalogoCineStream');

    if (dadosLocais) {
        // Se tiver, usa os dados locais
        todosOsDados = JSON.parse(dadosLocais);
    } else {
        // Se não, busca do data.json e salva no localStorage para uso futuro
        try {
            const resposta = await fetch("data.json");
            todosOsDados = await resposta.json();
            localStorage.setItem('catalogoCineStream', JSON.stringify(todosOsDados));
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            todosOsDados = []; // Garante que não teremos dados quebrados
        }
    }
}

async function iniciarBusca() {
    await carregarDados(); // Garante que os dados foram carregados

    const termoBusca = inputBusca.value.toLowerCase();
    const dadosFiltrados = todosOsDados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca)
    );

    renderizarCards(dadosFiltrados);
}
function renderizarCards(dadosParaRenderizar) {
    cardContainer.innerHTML = ''; // Limpa o container antes de renderizar

    if (dadosParaRenderizar.length === 0) {
        cardContainer.innerHTML = '<p style="text-align: center; color: var(--tertiary-color);">Nenhum resultado encontrado.</p>';
        return;
    }

    for (let dado of dadosParaRenderizar) {
        let article = document.createElement('article');
        article.innerHTML = `
            <img src="${dado.imagem}" alt="Pôster de ${dado.nome}">
            <h2>${dado.nome}</h2>
            <p>${dado.descricao}</p>
            <p><strong>Ano de criação:</strong> ${dado.ano}</p>
            <a href="${dado.link}">Leia mais</a>
        `;

        cardContainer.appendChild(article);
    }
}

// Executa as inicializações assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
    inicializarUsuarios();
    verificarStatusAssinatura();
});

// --- Lógica do Modal de Login ---

if (botaoLogin) {
    botaoLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('hidden');
    });
}

function closeModal() {
    loginModal.classList.add('hidden');
}

if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
if (loginModal) {
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal();
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = loginForm.querySelector('input[type="email"]');
        const passwordInput = document.querySelector("#login-password");
        const email = emailInput.value;
        const password = passwordInput.value;

        // Busca a lista de usuários do localStorage
        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCineStream')) || [];

        // Procura pelo usuário com o email e senha correspondentes
        const usuarioEncontrado = usuariosCadastrados.find(user => user.email === email && user.password === password);

        if (usuarioEncontrado) {
            // Se o usuário for encontrado, salva o status de login
            localStorage.setItem('assinante', 'true');
            localStorage.setItem('currentUserEmail', usuarioEncontrado.email);

            // Se o usuário for admin, salva essa informação também
            if (usuarioEncontrado.isAdmin) {
                localStorage.setItem('isAdmin', 'true');
            }

            if (!localStorage.getItem('planoAtual')) {
                localStorage.setItem('planoAtual', 'Padrão');
            }
            window.location.reload();
        } else {
            // Se não, exibe uma mensagem de erro
            alert('Email ou senha incorretos.');
        }
    });
}
