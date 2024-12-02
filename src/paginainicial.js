document.addEventListener("DOMContentLoaded", function () {
    // URL da API
    const apiUrl = 'http://localhost:30079/api/eventos';

    // Contêiner onde os cards serão inseridos
    const workshopsContainer = document.getElementById('workshops-container');

    // Função para buscar eventos da API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Verifica se há eventos
            if (data.length === 0) {
                // Se não houver eventos, cria e exibe a mensagem de "Sem eventos"
                const noEventsMessage = document.createElement('div');
                noEventsMessage.classList.add('no-events-message');
                noEventsMessage.innerHTML = '<p>Não há eventos disponíveis no momento.</p>';
                workshopsContainer.appendChild(noEventsMessage);
            } else {
                // Limpa o contêiner para garantir que não há duplicação de eventos
                workshopsContainer.innerHTML = '';

                // Criar o card para cada evento
                data.forEach(evento => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    // Formatar a data
                    const dataObj = new Date(evento.Data);
                    const dataFormatada = dataObj.toLocaleDateString('pt-BR'); // Exemplo: "01/12/2024"

                    // Formatar o horário
                    const horarioFormatado = evento.Horario.slice(0, 5); // Exibe apenas "HH:MM"

                    // Adicionar conteúdo ao card
                    card.innerHTML = `
                        <h2>${evento.Nome}</h2>
                        <hr>
                        <p class="info"><i class="fas fa-calendar-alt"></i> Data: ${dataFormatada}</p>
                        <p class="info"><i class="fas fa-clock"></i> Horário: ${horarioFormatado}</p>
                        <p class="info"><i class="fas fa-map-marker-alt"></i> Local: ${evento.Local}</p>
                        <p class="info"><i class="fas fa-hourglass-start"></i> Duração: ${evento.Duracao}</p>
                        <p class="info"><i class="fas fa-users"></i> Vagas: ${evento.Num_Vagas}</p>
                        <p class="info"><strong>Professor:</strong> ${evento.Nome_Responsavel}</p>
                        <p class="info"><strong>Descrição:</strong> ${evento.Descricao || '(Adicionar aqui)'}</p>
                         <button class="button" onclick="inscreverEvento(${evento.ID_Evento})">Inscrever</button>
                    `;

                    // Adicionar o card ao contêiner
                    workshopsContainer.appendChild(card);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar eventos:', error);
        });
});

/* Calendário */
$(document).ready(function() {
    var calendarEl = document.getElementById('calendar');
    
    // Inicializando o FullCalendar
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'pt-br', // Configura o idioma para português
        events: function(info, successCallback, failureCallback) {
            // Requisição para buscar os eventos
            $.ajax({
                url: 'http://localhost:30079/api/eventos',
                method: 'GET',
                success: function(data) {
                    // Mapear os dados da API para o formato que o FullCalendar espera
                    var events = data.map(function(event) {
                        // Corrigir a data para o formato adequado
                        var startDate = new Date(event.Data); // Criando um objeto Date
                        startDate.setHours(event.Horario.split(':')[0]); // Definindo a hora
                        startDate.setMinutes(event.Horario.split(':')[1]); // Definindo os minutos

                        return {
                            title: event.Nome,
                            start: startDate.toISOString(), // Usando o formato ISO para FullCalendar
                            description: event.Descricao,
                            location: event.Local,
                            duration: event.Duracao,
                            responsible: event.Nome_Responsavel
                        };
                    });

                    // Passa os eventos formatados para o FullCalendar
                    successCallback(events);
                },
                error: function(err) {
                    console.error('Erro ao carregar eventos:', err);
                    failureCallback(err);
                }
            });
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventClick: function(info) {
            // Preenchendo o modal com as informações do evento
            $('#eventTitle').text(info.event.title);
            $('#eventDate').text(info.event.start.toLocaleDateString());
            $('#eventDescription').text(info.event.extendedProps.description);
            $('#eventLocation').text(info.event.extendedProps.location);
            $('#eventResponsible').text(info.event.extendedProps.responsible);

            // Exibindo o modal com as informações
            $('#eventModal').modal('show');
        }
    });

    // Renderizando o calendário
    calendar.render();
});

function togglePeople() {
    // Seleciona o container dos workshops
    var container = document.getElementById('workshops-container');
    
    // Alterna a classe 'show-all' que controla a exibição dos cards
    container.classList.toggle('show-all');
    
    // Altera o texto do botão de acordo com o estado atual
    var button = document.querySelector('.NeedShow');
    if (container.classList.contains('show-all')) {
        button.textContent = 'Visualizar menos';
    } else {
        button.textContent = 'Visualizar todos';
    }
}

// Função para verificar se o usuário está autenticado
async function checkUserLoggedIn() {
    const token = localStorage.getItem("token");

    if (!token) return false;

    try {
        const response = await fetch("http://localhost:30079/perfil", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            return true; // Usuário está autenticado
        } else {
           
            return false;
        }
    } catch (error) {
        console.error("Erro ao verificar o login do usuário:", error);
        return false;
    }
}

// Alterna a exibição dos botões com base no status de login
document.addEventListener("DOMContentLoaded", async function() {
    const authButtons = document.getElementById("auth-buttons");
    const profileButton = document.getElementById("profile-button");

    const isLoggedIn = await checkUserLoggedIn();

    if (isLoggedIn) {
        authButtons.style.display = "none"; // Ocultar login/cadastro
        profileButton.style.display = "inline"; // Exibir botão de perfil
    } else {
        authButtons.style.display = "inline"; // Exibir login/cadastro
        profileButton.style.display = "none"; // Ocultar botão de perfil
    }
});

function inscreverEvento(eventoID) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para se inscrever em um evento.");
        return;
    }

    // Decodificar o token para obter o ID do usuário
    const decodedToken = jwt_decode(token);
    const ID_Usuario = decodedToken.id; // Certifique-se de que o payload contém o campo "id"

    // Faz a requisição para o servidor
    fetch(`http://localhost:30079/api/eventos/${eventoID}/inscrever`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`, // Token para autenticação
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ID_Usuario }) // Envia o ID decodificado
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Inscrição realizada com sucesso!");
        } else if (data.error) {
            alert(`Erro: ${data.error}`); // Mostra a mensagem de erro do servidor
        } else {
            alert("Erro ao se inscrever no evento. Tente novamente.");
        }
    })
    .catch(error => {
        console.error('Erro ao se inscrever no evento:', error);
        alert("Erro ao conectar com o servidor. Verifique sua conexão.");
    });
}

