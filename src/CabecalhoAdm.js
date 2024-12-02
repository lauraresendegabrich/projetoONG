// Seleciona o botão flutuante e a área de opções
const floatingBtn = document.querySelector('.options');
const btnMain = document.querySelector('.btn-main');

// Adiciona um evento de clique no botão principal
btnMain.addEventListener('click', function() {
    // Alterna a classe 'show' para exibir ou esconder as opções
    floatingBtn.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    // Verifica se o clique foi fora do botão ou do menu
    if (!btnMain.contains(e.target) && !floatingBtn.contains(e.target)) {
        floatingBtn.classList.remove('show'); // Remove a classe 'show'
    }
});
