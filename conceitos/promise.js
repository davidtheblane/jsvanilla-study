// Apenas um exemplo visual. Na prática, você usaria o módulo 'fs' com Promises.
function lerArquivoPromise() {
  return new Promise((resolve, reject) => {
    // Simula uma operação assíncrona que termina com sucesso
    setTimeout(() => {
      resolve('Conteúdo do arquivo lido.');
    }, 1000);
  });
}

lerArquivoPromise()
  .then(conteudo => {
    console.log('Primeiro passo: sucesso!');
    console.log(conteudo);
    // Retorna uma nova Promise para a próxima etapa
    return 'Conteúdo processado para a próxima etapa.';
  })
  .then(conteudoProcessado => {
    console.log('Segundo passo: sucesso!');
    console.log(conteudoProcessado);
  })
  .catch(err => {
    console.error('Ocorreu um erro em alguma das etapas:', err);
  });