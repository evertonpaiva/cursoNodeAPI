module.exports = function (app) {
    app.get('/pagamentos', function(req, res){
        console.log('Teste');
        res.send('OK');
    });

    app.delete('/pagamentos/pagamento/:id', function (req, res){
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        const connection = app.persistencia.connectionFactory();
        const pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro){
            if (erro) {
                res.status(500).send(erro);
                return;
            }

            console.log('pagamento cancelado');
            res.status(204).send(pagamento);
        });
    });

    app.put('/pagamentos/pagamento/:id', function (req, res){

        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        const connection = app.persistencia.connectionFactory();
        const pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro){
            if (erro) {
                res.status(500).send(erro);
                return;
            }

            console.log('pagamento confirmado');
            res.send(pagamento);
        });

    });

    app.post('/pagamentos/pagamento', function(req, res){
       var pagamento = req.body;

        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.")
            .notEmpty();

        req.assert("valor", "Valor é obrigatório e deve ser um decimal.")
            .notEmpty()
            .isFloat();

        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres")
            .notEmpty()
            .len(3,3);

        var errors = req.validationErrors();

        if (errors){
            console.log("Erros de validação encontrados");
            res.status(400).send(errors);
            return;
        }
        console.log('processando pagamento...');

       pagamento.status = 'CRIADO';
       pagamento.data = new Date();

       const connection = app.persistencia.connectionFactory();
       const pagamentoDao = new app.persistencia.PagamentoDao(connection);

       pagamentoDao.salva(pagamento, function(erro, resultado) {
           if(erro){
               console.log('Erro ao inserir pagamento:' + erro);
               res.status(500).send(erro);
           } else {
               pagamento.id = resultado.insertId;
               console.log('pagamento criado');
               res.location('/pagamentos/pagamento/' + pagamento.id);

               var response = {
                 dados_do_pagamento: pagamento,
                 links: [
                     {
                         href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                         rel: "confirmar",
                         method: "PUT"
                     },
                     {
                         href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                         rel: "cancelar",
                         method: "DELETE"
                     }
                 ]
               };

               res.status(201).json(response);
           }
       });

    });
};

