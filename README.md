# CineStream - Plataforma de Catálogo de Streaming

CineStream é um protótipo de front-end para uma plataforma de streaming de filmes e séries. O projeto simula a experiência de um serviço como Netflix ou Prime Video, permitindo que os usuários naveguem por um catálogo, criem contas, escolham planos de assinatura e gerenciem seus perfis. Inclui também um painel de administração para gerenciamento de conteúdo e usuários.

## ✨ Funcionalidades

### Para Usuários
- **Visualização de Catálogo**: Navegue por uma lista de filmes e séries carregados a partir de um arquivo `data.json`.
- **Busca Dinâmica**: Filtre o catálogo em tempo real para encontrar títulos específicos.
- **Sistema de Autenticação**:
  - **Cadastro**: Crie uma nova conta ao escolher um plano de assinatura.
  - **Login/Logout**: Acesse sua conta e encerre a sessão de forma segura.
- **Gerenciamento de Conta (`conta.html`)**:
  - Visualize o plano de assinatura atual.
  - Altere o e-mail e a senha da conta.
  - Cancele a assinatura (com confirmação por senha).
  - Adicione e gerencie perfis de usuário (visual).
- **Planos de Assinatura (`assinatura.html`)**:
  - Escolha entre três planos: **Básico**, **Padrão** e **Premium**.

### Para Administradores
- **Painel de Administração (`admin.html`)**:
  - **Acesso Restrito**: Apenas usuários marcados como `isAdmin` podem acessar.
  - **Gerenciamento de Catálogo**:
    - Adicione novos filmes ou séries ao catálogo.
    - Remova títulos existentes.
    - O catálogo é carregado diretamente do `data.json` para garantir consistência.
  - **Gerenciamento de Usuários**:
    - Adicione novos usuários manualmente.
    - Remova usuários existentes.
- **Privilégios de Admin**:
  - O administrador tem, por padrão, o plano **Premium** e não pode alterá-lo.
  - As opções de "Alterar Plano" e "Cancelar Assinatura" são ocultadas para evitar a desativação da conta principal.

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura e semântica das páginas.
- **CSS3**: Estilização, layout responsivo (Flexbox) e design dos componentes.
- **JavaScript (Vanilla)**: Manipulação do DOM, interatividade, lógica de negócio e simulação de back-end com `localStorage`.

## 📂 Estrutura do Projeto

```
/
├── admin.html          # Painel de administração de conteúdo e usuários.
├── assinatura.html     # Página para escolher e assinar um plano.
├── conta.html          # Página de gerenciamento da conta do usuário.
├── index.html          # Página principal com o catálogo de filmes e séries.
├── data.json           # Arquivo JSON que atua como banco de dados do catálogo.
├── script.js           # (Não fornecido) Lógica principal da index.html (busca, login, etc.).
├── style.css           # Estilos globais.
├── admin.css           # Estilos específicos para o painel de admin.
├── assinatura.css      # Estilos específicos para a página de planos.
├── conta.css           # Estilos específicos para a página de conta.
└── README.md           # Este arquivo.
```

## ⚙️ Como Funciona

### Persistência de Dados
O projeto utiliza o `localStorage` do navegador para simular um banco de dados e o estado da sessão do usuário.

- `usuariosCineStream`: Armazena um array de objetos de usuário (email, senha, isAdmin).
- `catalogoCineStream`: Armazena uma cópia do catálogo para ser usada nas páginas, garantindo que as alterações feitas pelo admin persistam na sessão.
- `currentUserEmail`: Guarda o e-mail do usuário logado.
- `isAdmin`: Flag (`'true'`/`'false'`) que indica se o usuário logado é um administrador.
- `planoAtual`: Armazena o nome do plano de assinatura do usuário.

### Fluxo do Administrador
1.  Para criar um administrador, é necessário modificar manualmente o `localStorage`. Após criar um usuário, encontre-o no array `usuariosCineStream` e altere a propriedade `isAdmin` para `true`.
    ```javascript
    // Exemplo de como fazer no console do navegador:
    let users = JSON.parse(localStorage.getItem('usuariosCineStream'));
    let adminUser = users.find(u => u.email === 'admin@email.com');
    if (adminUser) {
      adminUser.isAdmin = true;
    }
    localStorage.setItem('usuariosCineStream', JSON.stringify(users));
    ```
2.  Ao fazer login, o sistema verifica a flag `isAdmin` e libera o acesso ao `admin.html`.
3.  A página `admin.html` sempre carrega os dados mais recentes do `data.json` para garantir que o administrador trabalhe com a versão "oficial" do catálogo.

## 🚀 Como Executar

1.  Clone ou baixe este repositório.
2.  Certifique-se de que todos os arquivos (`.html`, `.css`, `.js`, `.json`) estão na mesma pasta.
3.  Abra o arquivo `index.html` em qualquer navegador web moderno.

Para testar as funcionalidades de administrador, siga os passos descritos na seção **Fluxo do Administrador**.

## ⚠️ Limitações Importantes

Este projeto utiliza `localStorage` para simular um banco de dados, o que traz algumas limitações:

- **Dados Locais**: Os dados (usuários, catálogo, etc.) são salvos apenas no navegador e no dispositivo onde são criados. Não há sincronização entre diferentes computadores ou entre um PC e um dispositivo móvel.
- **Persistência**: Limpar o cache do navegador ou os dados do site irá apagar todas as informações salvas.
- **Segurança**: O `localStorage` não é um local seguro para armazenar dados sensíveis como senhas em um projeto real.

---

*Este projeto foi desenvolvido como parte de um estudo prático de desenvolvimento web front-end, focando na criação de uma aplicação de página única (SPA) simulada com HTML, CSS e JavaScript puro.*