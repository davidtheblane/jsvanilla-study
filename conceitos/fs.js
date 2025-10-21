const fs = require('fs');

const texto = `Quase perfeito! 👏 Você acertou o caminho do arquivo e a mensagem a ser escrita.

A sua resposta está na ordem certa. O único detalhe que falta, e que é fundamental para qualquer função assíncrona, é o callback.

A fs.writeFile precisa de um terceiro argumento: a função de callback que será chamada quando a escrita terminar. A principal diferença é que, como você não está lendo dados, o callback aqui serve apenas para nos avisar se a operação foi um sucesso ou se ocorreu algum erro.

Veja como o código completo ficaria:`

fs.writeFile('texto_longo.txt', texto, (err) => {
    if(err) {
        console.log('Erro ao criar o arquivo', err)
    }

    console.log('Arquivo criado com sucesso!')
});

fs.readFile('texto_longo.txt', (err, data) => {
    if(err) {
        console.log('Erro ao ler o arquivo', err)
    }

    console.log(data.toString());
})