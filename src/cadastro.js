document.getElementById('button').addEventListener('click', processaFormCadastro);

async function processaFormCadastro(event) {
    event.preventDefault();

    // Coleta os valores dos campos do formulário
    var nome = document.getElementById('nome').value.trim();
    var sobrenome = document.getElementById('sobrenome').value.trim();
    var telefone = document.getElementById('telefone').value.trim();
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;
    var passwordConfirme = document.getElementById('passwordConfirme').value;

    // Função para validar o formato do e-mail
    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    // Valida o e-mail
    if (!validarEmail(email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    // Função para validar o telefone no formato DDD + número (fixo ou celular)
    function validarTelefone(telefone) {
        // Regex para validar DDD + 8 ou 9 dígitos (exemplo: 21912345678 ou 2123456789)
        const regexCelular = /^\d{2}9\d{8}$/; // Para celulares (DDD + 9 + 8 dígitos)
        const regexFixo = /^\d{2}\d{8}$/; // Para fixos (DDD + 8 dígitos)

        // Verifica se é celular ou fixo
        return regexCelular.test(telefone) || regexFixo.test(telefone);
    }

    // Validação do telefone
    if (!validarTelefone(telefone)) {
        alert("Por favor, insira um telefone válido no formato DDD + número (exemplo: 31982345678 para celular ou 3136456789 para fixo).");
        return;
    }

    // Verifica se todos os campos foram preenchidos
    if (!nome || !sobrenome || !telefone || !email || !password || !passwordConfirme) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Verifica se as senhas são iguais
    if (password !== passwordConfirme) {
        alert("As senhas não coincidem!");
        return;
    }



    // Função para validar a força da senha
    function validarSenha(senha) {
        // A senha deve ter pelo menos 6 caracteres, incluindo letras e números
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return regex.test(senha);
    }

    // Valida a senha
    if (!validarSenha(password)) {
        alert("A senha deve ter pelo menos 6 caracteres e incluir letras e números.");
        return;
    }

    // Cria o objeto do usuário
    const usuario = {
        nome: nome,
        sobrenome: sobrenome,
        telefone: telefone,
        email: email,
        password: password
    };

    // Mostra um feedback de carregamento para o usuário
    document.getElementById('button').disabled = true; // Desabilita o botão enquanto processa
    document.getElementById('button').textContent = 'Cadastrando...';

    try {
        // Envia os dados para o servidor
        const response = await fetch('https://backendong-final.onrender.com/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'loginUsuario.html'; // Redireciona para a página de login
        } else {
            const errorData = await response.json();
            // Tratamento para erro de e-mail já cadastrado
            if (errorData.message === 'E-mail já cadastrado') {
                alert('Este e-mail já está em uso. Tente outro.');
            } else {
                alert('Erro ao cadastrar usuário: ' + (errorData.message || 'Tente novamente.'));
            }
        }

    } catch (error) {
        console.error('Erro ao enviar dados de cadastro:', error);
        alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    } finally {
        // Restaura o estado do botão após o processo
        document.getElementById('button').disabled = false;
        document.getElementById('button').textContent = 'Cadastrar';

        // Exibe o ícone de carregamento, caso exista
        if (document.getElementById('loadingIcon')) {
            document.getElementById('loadingIcon').style.display = 'none';
        }

    }
}

// Alterna a visibilidade da senha
document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    // Opcional: Mudar o ícone
    this.textContent = type === "password" ? "🔓" : "🔒";
});

// Alterna a visibilidade da confirmação de senha
document.getElementById("togglePasswordConfirme").addEventListener("click", function () {
    const passwordConfirmeField = document.getElementById("passwordConfirme");
    const type = passwordConfirmeField.getAttribute("type") === "password" ? "text" : "password";
    passwordConfirmeField.setAttribute("type", type);

    // Opcional: Mudar o ícone
    this.textContent = type === "password" ? "🔓" : "🔒";
});
