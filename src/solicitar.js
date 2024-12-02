// Função para obter o nome do usuário logado usando o token
async function obterNome() {
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
            console.log("Formato dos dados do usuário:", JSON.stringify(data, null, 2)); // Exibe o formato completo

            if (data && data.user) {
                // Exibe o nome do usuário no local apropriado
                document.getElementById('nome_usuario').innerText = data.user.nome || 'Usuário';
            } else {
                console.error("Estrutura de dados inesperada:", data);
                alert("Erro ao obter o nome do usuário. Dados inválidos recebidos.");
            }
        } else if (response.status === 401) {
            alert("Sessão expirada ou token inválido. Redirecionando para a página de login...");
            window.location.href = 'loginUsuario.html';
        } else {
            alert("Erro ao obter o nome do usuário. Tente novamente mais tarde.");
        }
    } catch (error) {
        console.error("Erro ao obter nome do usuário:", error);
        alert("Erro na conexão com o servidor. Tente novamente mais tarde.");
    }
}

// Função para validar se todos os campos estão preenchidos
function validarCampos() {
    const nomeEvento = document.querySelector('input[placeholder="Nome do evento"]').value;
    const dataEvento = document.querySelector('input[placeholder="Escolha o dia"]').value;
    const horaEvento = document.querySelector('input[placeholder="Escolha o horário"]').value;
    const localEvento = document.querySelector('input[placeholder="Local"]').value;
    const duracaoEvento = document.querySelector('input[placeholder="Duração (HH:MM:SS)"]').value;
    const numeroVagas = document.querySelector('input[placeholder="Número de vagas"]').value;
    const nomeResponsavel = document.querySelector('input[placeholder="Nome do Responsável"]').value;
    const descricaoEvento = document.querySelector('textarea[placeholder="Descrição"]').value;

    console.log("Valores dos campos:", { nomeEvento, dataEvento, horaEvento, localEvento, duracaoEvento, numeroVagas, nomeResponsavel, descricaoEvento });

    // Verifica se algum campo está vazio
    if (!nomeEvento || !dataEvento || !horaEvento || !localEvento || !duracaoEvento || !numeroVagas || !nomeResponsavel || !descricaoEvento) {
        alert("Por favor, preencha todos os campos.");
        return false; // Retorna false se algum campo estiver vazio
    }

    // Verifica se a data do evento é anterior ao dia atual
    const hoje = new Date();
    const dataSelecionada = new Date(dataEvento);
    if (dataSelecionada < hoje.setHours(0, 0, 0, 0)) { // Remove a hora para comparar apenas a data
        alert("A data do evento não pode ser anterior ao dia de hoje.");
        return false; // Retorna false se a data for inválida
    }
    // Validação do formato de duração (HH:MM:SS)
    const regexDuracao = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/; // Formato 00:00:00 a 23:59:59
    if (!regexDuracao.test(duracaoEvento)) {
        alert("A duração deve estar no formato HH:MM:SS (por exemplo, 02:30:00).");
        return false; // Retorna false se a duração estiver em formato inválido
    }


    return true; // Retorna true se todos os campos estiverem preenchidos
}

// Função para enviar solicitação de evento
async function enviarSolicitacaoEvento() {
    try {

        // Verifica se os campos foram preenchidos corretamente
        if (!validarCampos()) {
            return; // Interrompe a execução caso a validação falhe
        }
        // Capturando os dados do formulário
        const nomeEvento = document.querySelector('input[placeholder="Nome do evento"]').value;
        const dataEvento = document.querySelector('input[placeholder="Escolha o dia"]').value; // Ex: '2024-11-22'
        const horaEvento = document.querySelector('input[placeholder="Escolha o horário"]').value; // Ex: '00:59'
        const localEvento = document.querySelector('input[placeholder="Local"]').value;
        const duracaoEvento = document.querySelector('input[placeholder="Duração (HH:MM:SS)"]').value; // Ex: '02:00:00'
        const numeroVagas = Number(document.querySelector('input[placeholder="Número de vagas"]').value);  // Convertendo para número
        const nomeResponsavel = document.querySelector('input[placeholder="Nome do Responsável"]').value;
        const descricaoEvento = document.querySelector('textarea[placeholder="Descrição"]').value;

        // Obtendo o token de autenticação do localStorage
        const token = localStorage.getItem('token');
        console.log("Token de autenticação para solicitação de evento:", token);

        if (!token) {
            alert("Usuário não autenticado. Redirecionando para a página de login...");
            window.location.href = 'loginUsuario.html';
            return;
        }

        // Decodificando o token para obter o ID do usuário
        const decodedToken = jwt_decode(token);  // Usa a biblioteca 'jwt-decode' para decodificar o token JWT
        const idUsuario = decodedToken.id; // ID do usuário extraído do token
        console.log("ID do usuário obtido do token:", idUsuario);

        // Garantindo que a data esteja no formato correto 'YYYY-MM-DD'
        const dataFormatada = formatarData(dataEvento);  // Função que converte a data
        const horarioFormatado = formatarHorario(horaEvento);  // Função que converte o horário
        const duracaoFormatada = formatarDuracao(duracaoEvento);  // Função que converte a duração

        // Formatando os dados para enviar ao servidor
        const dadosEvento = {
            ID_Usuario: idUsuario,
            Nome: nomeEvento,
            Descricao: descricaoEvento,
            Status: 'em analise',
            Data: dataFormatada,  // Data formatada no padrão 'YYYY-MM-DD'
            Horario: horarioFormatado, // Horário formatado no padrão 'HH:MM:SS'
            Num_Vagas: numeroVagas, // Convertido para número inteiro
            Local: localEvento,
            Duracao: duracaoFormatada, // Duração formatada no padrão 'HH:MM:SS'
            Nome_Responsavel: nomeResponsavel
        };

        console.log("Dados do evento a serem enviados:", dadosEvento);

        // Envia os dados para o servidor
        const response = await fetch('http://localhost:30079/solicitarEvento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosEvento)
        });

        console.log("Resposta do servidor após enviar solicitação de evento:", response);

        if (response.ok) {
            alert("Solicitação de evento enviada com sucesso!");
            // Limpa os campos do formulário
            document.querySelectorAll('input').forEach(input => input.value = '');
            document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
            window.location.href = 'status.html'; // Redireciona após o envio
        } else {
            const errorData = await response.json();
            alert(`Erro ao enviar a solicitação de evento: ${errorData.message || 'Tente novamente'}`);
        }
    } catch (error) {
        console.error("Erro ao enviar solicitação de evento:", error);
        alert("Erro na conexão com o servidor. Tente novamente mais tarde.");
    }
}
// Função para formatar a data para o padrão 'YYYY-MM-DD'
function formatarData(data) {
    // Garantir que a data está no formato 'YYYY-MM-DD' mesmo se o usuário inserir algo diferente
    const partesData = data.split('-'); // A data vem como 'YYYY-MM-DD'
    if (partesData.length === 3) {
        const ano = partesData[0];
        const mes = partesData[1].padStart(2, '0');  // Garantindo que o mês tenha 2 dígitos
        const dia = partesData[2].padStart(2, '0');  // Garantindo que o dia tenha 2 dígitos
        return `${ano}-${mes}-${dia}`;
    }
    return data; // Caso o formato seja inesperado, retorna o valor original
}

// Função para formatar o horário para o padrão 'HH:MM:SS'
function formatarHorario(horario) {
    const partesHora = horario.split(':');
    const horas = partesHora[0].padStart(2, '0');  // Garantindo que a hora tenha 2 dígitos
    const minutos = partesHora[1].padStart(2, '0');  // Garantindo que os minutos tenham 2 dígitos
    const segundos = partesHora[2] ? partesHora[2].padStart(2, '0') : '00';  // Garantindo que os segundos tenham 2 dígitos, caso não fornecido
    return `${horas}:${minutos}:${segundos}`;
}

// Função para formatar a duração para o padrão 'HH:MM:SS'
function formatarDuracao(duracao) {
    const partesDuracao = duracao.split(':');
    const horas = partesDuracao[0].padStart(2, '0');  // Garantindo que a hora tenha 2 dígitos
    const minutos = partesDuracao[1].padStart(2, '0');  // Garantindo que os minutos tenham 2 dígitos
    const segundos = partesDuracao[2] ? partesDuracao[2].padStart(2, '0') : '00';  // Garantindo que os segundos tenham 2 dígitos, caso não fornecido
    return `${horas}:${minutos}:${segundos}`;
}

// Chama a função ao carregar a página
window.onload = function () {
    console.log("Carregando a página, obtendo nome do usuário...");
    obterNome(); // Certifique-se de que o nome do usuário é carregado ao abrir a página
};

// Adiciona evento ao botão "Enviar" do formulário
document.querySelector('.submit-btn').addEventListener('click', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    console.log("Botão 'Enviar' clicado. Enviando solicitação de evento...");
    enviarSolicitacaoEvento(); // Envia a solicitação de evento
});

// Adiciona evento ao botão "Cancelar" para limpar os inputs
document.querySelector('.cancel-btn').addEventListener('click', function (event) {
    // Impede o comportamento padrão do botão
    event.preventDefault();
    console.log("Botão 'Cancelar' clicado. Limpando campos do formulário...");

    // Limpa todos os campos de entrada no formulário
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = ''; // Limpa o valor de cada input
    });

    // Limpa o conteúdo de áreas de texto (textarea), caso haja
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.value = ''; // Limpa o valor de cada textarea
    });
});