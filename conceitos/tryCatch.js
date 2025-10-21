const fs = require('fs/promises'); // Usando a versão de Promises do módulo FS

async function processarArquivo() {
  try {
    const conteudo = await fs.readFile('meuarquivo.txt', 'utf-8');
    
    console.log('Conteúdo lido com sucesso:');
    console.log(conteudo);
    
  } catch (err) {
    // Se o arquivo não existir ou qualquer outro erro acontecer
    console.error('Erro ao processar o arquivo:', err.message);
  }
}

// Para rodar a função, basta chamá-la
processarArquivo();