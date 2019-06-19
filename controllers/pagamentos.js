module.exports = function (app) {
    app.get('/pagamentos', function(req, res){
        console.log('Teste');
        res.send('OK');
    });

    app.post('/pagamentos/pagamento', function(req, res){
       var pagamento = req.body;
       console.log('Processando uma requisição de um novo pagamento');

       pagamento.status = 'CRIADO';
       pagamento.data = new Date();

       const connection = app.persistencia.connectionFactory();
       const pagamentoDao = new app.persistencia.PagamentoDao(connection);

       pagamentoDao.salva(pagamento, function(erro, resultado) {
           console.log('pagamento criado');
           res.json(pagamento);
       });

    });
};

