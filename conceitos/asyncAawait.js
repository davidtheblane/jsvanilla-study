// A palavra-chave 'async' na frente da função
async function processarArquivo() {
  try {
    // A palavra-chave 'await' na frente da chamada de uma Promise
    const conteudo = await lerArquivoPromise(); 
    console.log('Primeiro passo: sucesso!');
    console.log(conteudo);
    
    // O código aqui continua como se fosse síncrono
    const conteudoProcessado = 'Conteúdo processado para a próxima etapa.';
    console.log('Segundo passo: sucesso!');
    console.log(conteudoProcessado);

  } catch (err) {
    console.error('Ocorreu um erro:', err);
  }
}

// Para rodar a função, basta chamá-la
processarArquivo();