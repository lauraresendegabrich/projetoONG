
document.getElementById('button').addEventListener('click', processaFormLoginAdm);

async function processaFormLoginAdm(event) {
    event.preventDefault();

    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;

    const resultadoLogin = await loginAdmin(email, password);

    if (resultadoLogin) {
        window.location.href = 'RelatorioAdm.html';
    }
}

async function loginAdmin(email, password) {
    try {
        const response = await fetch('http://localhost:30079/adminLogin', {  // URL para o login do admin
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();  // Pega a resposta em JSON

        if (response.ok) {
            console.log('Login bem-sucedido:', data);
            localStorage.setItem('token', data.token);  // Armazena o token
            console.log('Token armazenado:', localStorage.getItem('token'));  // Verifique se o token foi armazenado
            return true;
        } else {
            // Login falhou, exibe a mensagem do backend
            alert(data.message || 'Erro desconhecido ao fazer login!');
            return false;
        }
    } catch (error) {
        console.error('Erro ao fazer login do administrador:', error);
        alert('Erro na conexão com o servidor');
        return false;
    }
}



document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    // Opcional: Mudar o ícone
    this.textContent = type === "password" ? "🔓" : "🔒";
});


// Enviar formulário com Enter
document.getElementById("input-login").addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        processaFormLoginAdm(event);
    }
});