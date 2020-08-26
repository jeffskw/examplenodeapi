const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bdcliente',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});



//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');

//Pega todos clientes
app.get('/clientes', (req, res) => {
    mysqlConnection.query('SELECT * FROM Cliente', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Pegar um cliente por id
app.get('/clientes/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM cliente WHERE Nome = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Deletar um cliente por id
app.delete('/clientes/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM cliente WHERE Id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deletado com sucesso.');
        else
            console.log(err);
    })
});




//Inserir um cliente
app.post('/clientes', (req, res) => {
    console.log(req.body)
    mysqlConnection.query('INSERT INTO cliente (Id,Nome,Sobrenome) VALUES (?,?,?)', [req.body.Id, req.body.Nome, req.body.Sobrenome], (err, results, fields) => {
        if (!err)
            res.send('Inserido com sucesso.');
        else
            console.log(err);
    })
});

//Atualizar clientes
app.put('/clientes', function (req, res) {
    mysqlConnection.query('UPDATE cliente SET Nome= ?, Sobrenome = ? where Id = ?', [req.body.Nome, req.body.Sobrenome, req.body.Id], function (err, results, fields) {
        if (!err)
            res.send('Atualizado com sucesso.');
        else
            console.log(err);
    })
});