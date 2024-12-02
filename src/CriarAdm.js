const modal = document.getElementById('modal-create');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const form = document.getElementById('create-form');
const token = localStorage.getItem('token');


document.getElementById('create-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    document.getElementById('modal-create').style.display = 'flex';

    document.getElementById('confirmBtn').onclick = async function () {
        document.getElementById('modal-create').style.display = 'none';

        // Coletar os valores dos inputs
        const eventId = document.getElementById('event_ID').value;
        const eventName = document.getElementById('event_name').value;
        const eventDescription = document.getElementById('event_description').value;
        const eventDate = document.getElementById('event_date').value;
        const eventTime = document.getElementById('event_time').value;
        const eventSlots = document.getElementById('event_slots').value;
        const eventLocation = document.getElementById('event_location').value;
        const eventDuration = document.getElementById('event_duration').value;
        const eventResponsible = document.getElementById('event_responsible').value;

        // Montar o payload
        const data = {
            event_ID: eventId,
            event_name: eventName,
            event_description: eventDescription,
            event_date: eventDate,
            event_time: eventTime,
            event_slots: eventSlots,
            event_location: eventLocation,
            event_duration: eventDuration,
            event_responsible: eventResponsible,
        };

        try {

            const token = localStorage.getItem('token');
            console.log("Token obtido:", token);

            if (!token) {
                alert("Usuário não autenticado. Redirecionando para a página de login...");
                window.location.href = 'loginUsuario.html';
                return;
            }
            // Enviar os dados para a rota do backend
            const response = await fetch('http://localhost:30079/api/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Evento criado com sucesso!');
            } else {
                const error = await response.json();
                alert('Erro ao criar evento: ' + (error.message || 'Erro desconhecido.'));
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao criar evento: ' + error.message);
        }
    }
    document.getElementById('cancelBtn').onclick = function () {
        document.getElementById('modal-create').style.display = 'none';
    };
});

function logout(event) {
    // Previne o comportamento padrão do link
    event.preventDefault();

    // Remover o token do localStorage
    localStorage.removeItem('token'); // ou sessionStorage.removeItem('token') se for o caso

    // Redirecionar para a página de login
    window.location.href = 'paginainicial.html'; // Ou qualquer página de login
}

async function verificarToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Usuário não autenticado. Redirecionando para a página de login...');
        window.location.href = 'loginUsuario.html';
        return; // Para evitar que o restante do código seja executado
    } else {
        console.log("Token obtido:", token);

        try {
            // Enviar os dados para a rota do backend
            const response = await fetch('http://localhost:30079/api/verificar-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Erro ao verificar token:", error);
                alert('Sessão inválida ou expirada. Redirecionando para a página de login...');
                window.location.href = 'loginUsuario.html';
            } else {
                console.log("Token válido.");
                // Outras ações caso o token seja válido
            }
        } catch (error) {
            console.error('Erro ao verificar o token:', error);
            alert('Erro ao verificar token. Redirecionando para a página de login...');
            window.location.href = 'loginUsuario.html';
        }
    }
}

// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', verificarToken);


// Fechar o modal clicando fora dele
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Chama a função ao carregar o script
verificarToken();