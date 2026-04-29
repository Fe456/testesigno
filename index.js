const port = 3000;

const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(express.static('./pages'));

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "PUC@1234",
    database: "testeSigno",
    dateStrings: true
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

router.post('/enquetes', (req,res) => {
    console.log(req.body);

    const nome = req.body.NOME;
    const DATAINICIO = req.body.DATAINICIO;
    const DATATERMINO = req.body.DATATERMINO;
    const DESCR = req.body.DESCR;
    const opt1 = req.body.opt1;
    const opt2 = req.body.opt2;
    const opt3 = req.body.opt3;

    console.log("Nome:", nome);
    console.log("Data de Início:", DATAINICIO);
    console.log("Data de Término:", DATATERMINO);
    console.log("Descrição:", DESCR);
    console.log("Opção 1:", opt1);
    console.log("Opção 2:", opt2);
    console.log("Opção 2:", opt3);

    if (!nome || !DATAINICIO || !DATATERMINO || !opt1 || !opt2) {
        return res.status(400).json({ error: "Nome, data de início e término, e ao mínimo 2 opções são obrigatórios" });
    }

    const values = [
        nome,
        DATAINICIO,
        DATATERMINO,
        DESCR,
        opt1,
        opt2,
        opt3
    ];

    const q = "INSERT INTO enquetes (`NOME`, `DATAINICIO`, `DATATERMINO`, `DESCR`, `opt1`, `opt2`,`opt3`) VALUES (?)";
    con.query(q, [values], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao salvar a enquete" });
        }
        res.status(201).json({ message: "Enquete salva com sucesso!", id: result.insertId });
    });
});

router.get('/enquetes', (req,res) => {
    const q = "SELECT * FROM enquetes"

    con.query(q,(err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
});

router.get('/enquetes/:id', (req,res) => {
    const id = req.params.id;
    const q = "SELECT ID, NOME, DATAINICIO, DATATERMINO, DESCR, opt1, opt2, opt3 FROM enquetes WHERE ID = ?";
    con.query(q, [id], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).send('Não encontrado');
        }
        res.status(200).json(result[0]);
    });
});
