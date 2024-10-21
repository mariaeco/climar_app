//FUNÇÃO PARA REALIZAR DOWNLOAD DO JSON E NÃO PRECISAR FAZER AS REQUISIÇÕES ENQUANTO TESTAMOS

export function downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);

    // Cria um blob com o conteúdo JSON
    const blob = new Blob([jsonStr], { type: 'application/json' });

    // Cria uma URL temporária para o arquivo blob
    const url = URL.createObjectURL(blob);

    // Cria um elemento <a> para iniciar o download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Anexa o link ao corpo da página
    document.body.appendChild(a);

    // Simula o clique para iniciar o download
    a.click();

    // Remove o link após o download
    document.body.removeChild(a);

    // Libera a URL
    URL.revokeObjectURL(url);
}


export function loadJSONFile(fileName) {
    return fetch(`js/data/${fileName}`) // Caminho relativo à pasta 'data'
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar o arquivo JSON: ${fileName}`);
            }
            return response.json(); // Converte a resposta em JSON
        })
        .catch(error => {
            console.error('Erro:', error);
            throw error;
        });
}


export function fetchFraseAleatoria(clima) {
    return fetch('js/frases.json') // Caminho do arquivo JSON
        .then(response => response.json())
        .then(data => {
            const frases = data[clima];
            const indiceAleatorio = Math.floor(Math.random() * frases.length); // Seleciona um índice aleatório
            return frases[indiceAleatorio]; // Retorna a frase aleatória
        })
        .catch(error => {
            console.error("Erro ao carregar as frases: ", error);
            return "Temperatura alta! Mantenha-se hidratado."; // Frase padrão em caso de erro
        });
}