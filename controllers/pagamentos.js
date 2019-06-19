module.exports = function (app) {
    app.get('/pagamentos', function(req, res){
        console.log('Teste');
        res.send('OK');
    });
};
