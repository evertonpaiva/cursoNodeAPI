const logger = require('../servicos/logger');

module.exports = function (app) {
    const PAGAMENTO_CRIADO = "CRIADO";
    const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
    const PAGAMENTO_CANCELADO = "CANCELADO";

    app.get('/pagamentos', function(req, res){
        console.log('Teste');
        res.send('OK');
    });

    app.get('/pagamentos/pagamento/:id', function(req, res){
        var id = req.params.id;
        console.log('consultando pagamento: ' + id);
        logger.info('consultando pagamento: ' + id);

        const memcachedClient = app.servicos.memcachedClient();
        memcachedClient.get('pagamento-' + id, function (erro, retorno) {
            if(erro || !retorno){
                console.log('MISS - chave não encontrada');

                const connection = app.persistencia.connectionFactory();
                const pagamentoDao = new app.persistencia.PagamentoDao(connection);

                pagamentoDao.buscaPorId(id, function(erro, resultado){
                    if(erro){
                        console.log('erro ao consultar no banco: ' + erro);
                        res.status(500).send(erro);
                    }
                    console.log('pagamento encontrado: ' + JSON.stringify(resultado));
                    res.json(resultado);
                });
            } else {
                console.log('HIT - valor: ' + JSON.stringify(retorno));
                res.json(retorno);
            }
        });
    });

    app.delete('/pagamentos/pagamento/:id', function (req, res){
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CANCELADO;

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
        pagamento.status = PAGAMENTO_CONFIRMADO;

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
       var pagamento = req.body["pagamento"];

        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatória.")
            .notEmpty();

        req.assert("pagamento.valor", "Valor é obrigatório e deve ser um decimal.")
            .notEmpty()
            .isFloat();

        req.assert("pagamento.moeda", "Moeda é obrigatória e deve ter 3 caracteres")
            .notEmpty()
            .len(3,3);

        var errors = req.validationErrors();

        if (errors){
            console.log("Erros de validação encontrados");
            res.status(400).send(errors);
            return;
        }
        console.log('processando pagamento...');

       pagamento.status = PAGAMENTO_CRIADO;
       pagamento.data = new Date();

       const connection = app.persistencia.connectionFactory();
       const pagamentoDao = new app.persistencia.PagamentoDao(connection);

       pagamentoDao.salva(pagamento, function(erro, resultado) {
           if (erro){
               console.log('Erro ao inserir pagamento:' + erro);
               res.status(500).send(erro);
           } else {
               pagamento.id = resultado.insertId;
               console.log('pagamento criado');

               var memcachedClient = app.servicos.memcachedClient();
               memcachedClient.set(
                   'pagamento-' + pagamento.id,
                   pagamento,
                   60000,
                   function(erro){
                        console.log('nova chave adicionada ao cache: pagamento-' + pagamento.id);
                   }
               );

               if (pagamento.forma_de_pagamento == 'cartao') {
                   var cartao = req.body["cartao"];
                   console.log(cartao);

                   var clienteCartoes = new app.servicos.clienteCartoes();

                   clienteCartoes.autoriza(cartao,
                       function (exception, request, response, retorno) {
                           if(exception){
                                console.log(exception);

                                res.status(400).send(exception);
                                return;
                           }

                           console.log(retorno);
                           res.location('/pagamentos/pagamento/' + pagamento.id);

                           response = {
                               dados_do_pagamento: pagamento,
                               cartao: retorno,
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
                           return;
                   });

               } else {
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
           }
       });

    });
};

