// Procurar o botão
document.querySelector('#add-time').addEventListener('click', addField);


function addField() {
    // Duplicar os campos
    const newFieldContainer = document.querySelector('.schedule-item').cloneNode(true);

    // Limpar os campos
    const fields = newFieldContainer.querySelectorAll('input');

    // Para cada campo, limpar ele
    fields.forEach(function(field) {
        //pega o filed atual e limpa ele
        field.value = "";
    });

    // Colocar na página
    document.querySelector('#schedule-items').appendChild(newFieldContainer);
}