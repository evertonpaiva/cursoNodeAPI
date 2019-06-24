const restify = require('restify');

const cliente = restify.createJsonClient({
    url: 'http://localhost:3001'
});

cliente.post('/cartoes/autoriza',
    function(erro, req, resp, retorno){
        console.log('consumindo servico de cartoes');
        console.log(retorno);
    }
);
