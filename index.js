const http = require('http');
const httpProxy = require('http-proxy');

// Cria um servidor proxy
const proxy = httpProxy.createProxyServer({});

// Função para logar erros de proxy
function handleProxyError(err, req, res) {
  console.error(`Proxy error: ${err.message}`);
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Bad gateway');
}

// Cria um servidor HTTP
const server = http.createServer((req, res) => {
  const targetUrl = 'http://speedhosting.cloud:2009';

  // Verifica se o método é permitido
  if (!['GET', 'POST'].includes(req.method)) {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    return res.end('Method Not Allowed');
  }

  // Define o timeout para 30 segundos
  req.setTimeout(30000, () => {
    res.writeHead(504, { 'Content-Type': 'text/plain' });
    res.end('Gateway Timeout');
  });

  // Faz o proxy da requisição
  proxy.web(req, res, { target: targetUrl }, (err) => {
    handleProxyError(err, req, res);
  });
  
  // Lida com erros do proxy
  proxy.on('error', (err) => {
    console.error('Proxy error:', err);
  });
});

// Lida com erros do servidor
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Inicia o servidor na porta 80
server.listen(80, () => {
  console.log('Proxy server listening on port 80');
});
