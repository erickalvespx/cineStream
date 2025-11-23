const cardContainer = document.querySelector("#card-container");
const inputBusca = document.querySelector("#input-busca");
const containerBusca = document.querySelector("#container-busca");
const botaoAssinaturaHeader = document.querySelector("#botao-assinatura");
const ctaAssinatura = document.querySelector(".cta-assinatura");
const botaoLimparFiltro = document.querySelector("#botao-limpar-filtro");
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
    // Se os dados ainda não foram carregados, busca do arquivo data.json
    if (todosOsDados.length === 0) {
        try {
            const resposta = await fetch("data.json");
            todosOsDados = await resposta.json();
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            todosOsDados = []; // Garante que não teremos dados quebrados em caso de erro
        }
    }
}

async function iniciarBusca() {
    await carregarDados(); // Garante que os dados foram carregados

    const termoBusca = inputBusca.value.toLowerCase();
    const dadosFiltrados = todosOsDados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca)
    );

    // Se o usuário está buscando, o filtro de tag é removido
    botaoLimparFiltro.classList.add('hidden');

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
        article.classList.add('card'); // Adiciona a classe 'card' ao article

        // Cria o HTML para as tags, se elas existirem
        let tagsHTML = '';
        if (dado.tags && Array.isArray(dado.tags) && dado.tags.length > 0) {
            tagsHTML = `
                <div class="card-tags">
                    ${dado.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
        }

        article.innerHTML = `
            <img class="card-imagem" src="${dado.imagem}" alt="Pôster de ${dado.nome}" />
            <div class="card-content">
                <h2 class="card-titulo">${dado.nome}</h2>
                <p class="card-descricao">${dado.descricao}</p>
                <p><strong>Ano:</strong> ${dado.ano || dado.data_criacao}</p>
                ${tagsHTML}
                <a href="${dado.link}">Leia mais</a>
            </div>
        `;

        cardContainer.appendChild(article);
    }
}

// Função para filtrar os cards ao clicar em uma tag
function configurarFiltroPorTag() {
    if (cardContainer) {
        cardContainer.addEventListener('click', async (event) => {
            // Verifica se o elemento clicado é de fato uma tag
            if (event.target.classList.contains('tag')) {
                inputBusca.value = ''; // Limpa o campo de busca
                const tagName = event.target.textContent;
                await carregarDados(); // Garante que os dados estão carregados
                const dadosFiltrados = todosOsDados.filter(dado =>
                    dado.tags && dado.tags.includes(tagName)
                );
                renderizarCards(dadosFiltrados);

                // Mostra o botão de limpar filtro
                botaoLimparFiltro.classList.remove('hidden');
            }
        });
    }
}

// Executa as inicializações assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
    inicializarUsuarios();
    verificarStatusAssinatura();

    // Adiciona o listener para o campo de busca funcionar em tempo real
    if (inputBusca) {
        inputBusca.addEventListener('input', iniciarBusca);
    }

    // Configura o listener para os cliques nas tags
    configurarFiltroPorTag();

    // Configura o listener para o botão de limpar filtro
    if (botaoLimparFiltro) {
        botaoLimparFiltro.addEventListener('click', () => {
            botaoLimparFiltro.classList.add('hidden');
            iniciarBusca(); // Chama a busca com o campo vazio, mostrando todos os cards
        });
    }
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
