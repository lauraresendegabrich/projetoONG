// Função para obter as informações do usuário com o token
async function obterPerfil() {
    try {
        const token = localStorage.getItem('token');
        console.log("Token obtido:", token);

        if (!token) {
            alert("Usuário não autenticado. Redirecionando para a página de login...");
            window.location.href = 'loginUsuario.html';
            return;
        }

        const response = await fetch('http://localhost:30079/perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Dados do usuário obtidos:", data);

            if (data && data.user) {
                document.getElementById('nome').value = data.user.nome || '';
                document.getElementById('sobrenome').value = data.user.sobrenome || '';
                document.getElementById('telefone').value = data.user.telefone || '';
                document.getElementById('email').value = data.user.email || '';

                document.getElementById('nome_usuario').innerText = data.user.nome || 'Usuário';
            } else {
                console.error("Estrutura de dados inesperada:", data);
                alert("Erro ao obter o perfil do usuário. Dados inválidos recebidos.");
            }
        } else if (response.status === 401) {
            alert("Sessão expirada ou token inválido. Redirecionando para a página de login...");
            window.location.href = 'loginUsuario.html';
        } else {
            alert("Erro ao obter o perfil do usuário. Tente novamente mais tarde.");
        }
    } catch (error) {
        console.error("Erro ao obter perfil do usuário:", error);
        alert("Erro na conexão com o servidor. Tente novamente mais tarde.");
    }
}

// Função para habilitar edição dos campos
function habilitarEdicao() {
    const nomeField = document.getElementById('nome');
    const sobrenomeField = document.getElementById('sobrenome');
    const telefoneField = document.getElementById('telefone');
    const emailField = document.getElementById('email');

    // Habilita os campos para edição, exceto o campo de e-mail
    if (nomeField.hasAttribute('readonly')) {
        nomeField.removeAttribute('readonly');
        sobrenomeField.removeAttribute('readonly');
        telefoneField.removeAttribute('readonly');
    }

    // O campo de email permanece readonly
    emailField.setAttribute('readonly', true);

    // Oculta o botão "Editar" e exibe o botão "Salvar"
    document.querySelector('.btn.editar').style.display = 'none';
    document.querySelector('.btn.salvar').style.display = 'inline-block';
}

// Função para salvar as informações editadas do usuário
async function salvarPerfil() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Usuário não autenticado. Redirecionando para a página de login...");
            window.location.href = 'loginUsuario.html';
            return;
        }

        const nome = document.getElementById('nome').value;
        const sobrenome = document.getElementById('sobrenome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value; // Email não será alterado

        const response = await fetch('http://localhost:30079/perfil', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                sobrenome,
                telefone,
                email // Email permanece o mesmo
            })
        });

        if (response.ok) {
            alert("Perfil atualizado com sucesso!");

            // Desabilita a edição dos campos
            document.getElementById('nome').setAttribute('readonly', true);
            document.getElementById('sobrenome').setAttribute('readonly', true);
            document.getElementById('telefone').setAttribute('readonly', true);
            document.getElementById('email').setAttribute('readonly', true);

            // Exibe o botão "Editar" e oculta o botão "Salvar"
            document.querySelector('.btn.editar').style.display = 'inline-block';
            document.querySelector('.btn.salvar').style.display = 'none';
        } else {
            alert("Erro ao atualizar o perfil. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao salvar perfil do usuário:", error);
        alert("Erro na conexão com o servidor. Tente novamente mais tarde.");
    }
}

// Chama a função ao carregar a página
window.onload = function() {
    obterPerfil(); // Certifique-se de que o perfil é carregado ao abrir a página
    document.querySelector('.btn.editar').disabled = false; // Garante que o botão "Editar" esteja habilitado
};

// Adiciona eventos aos botões "Editar" e "Salvar"
document.querySelector('.btn.editar').addEventListener('click', function() {
    habilitarEdicao(); // Habilita a edição no primeiro clique
    document.querySelector('.btn.editar').disabled = true; // Desabilita o botão "Editar" após ser clicado
});
document.querySelector('.btn.salvar').addEventListener('click', salvarPerfil);


