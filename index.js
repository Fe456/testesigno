const port = 3000;

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(express.static('./pages'));

var con = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "PUC@1234",
    database: "testeSigno",
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Listen for connection-level errors
con.on('error', (err) => {
  console.error('Database connection error:', err);
  
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log("Error: ", err.code);
  }
});

// ENQUETES CRUD

router.post('/enquetes', async (req,res) => {
    console.log(req.body);

    try {
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

        const [result] = await con.query(q, [values]);
        console.log(result);
        res.status(201).json({ message: "Enquete salva com sucesso!", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/enquetes/:id', async (req,res) => {
    console.log(req.body);

    try {
        const { id } = req.params;
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

        const updValues = [
            nome,
            DATAINICIO,
            DATATERMINO,
            DESCR,
            opt1,
            opt2,
            opt3,
            id
        ];

        const q = "UPDATE enquetes SET NOME = ?, DATAINICIO = ?, DATATERMINO = ?, DESCR = ?, opt1 = ?, opt2 = ?, opt3 = ? WHERE ID = ?";
        const [result] = await con.query(q, updValues);
        console.log(result);
        res.status(201).json({ message: "Enquete salva com sucesso!", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/enquetes', async (req,res) => {
    try {
        const q = "SELECT * FROM enquetes"

        const [result] = await con.query(q);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/enquetes/:id', async (req,res) => {
    try {
        const id = req.params.id;
        const q = "SELECT ID, NOME, DATAINICIO, DATATERMINO, DESCR, opt1, opt2, opt3 FROM enquetes WHERE ID = ?";
        const [result] = await con.query(q, id);
        console.log(result);
        res.status(200).json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/enquetes/:id', async (req,res) => {
    try {
        const id = req.param("id");
        const q = "DELETE FROM enquetes WHERE ID = ?";
        const [result] = await con.query(q, id);
        console.log(result);
        res.status(200).json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// USERS

router.post("/api/usuarios", async (req,res) => {
    console.log(req.body);

    try {
        const usuario = req.body;

        const email = usuario.email;
        const senha = usuario.senha;

        const values = [email, senha];

        var q = "INSERT INTO usuarios (EMAIL, SENHA) VALUES (?)";
        const [result] = await con.query(q, [values]);
        console.log(result);
        res.status(201).json(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/api/login", async (req, res) => {
    console.log("Login request received!");
    
    try {
        const { email, senha } = req.body;
        const q = "SELECT ID, EMAIL FROM usuarios WHERE EMAIL = ? AND SENHA = ?";

        const [result] = await con.query(q, [email, senha]);

        console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// VOTOS

router.post("/votos", async(req,res) => {
    try {
        const userID = req.body.userID;
        const enqueteID = req.body.enqueteID;
        const opcao = req.body.opcao;

        const result = await con.query(
        "INSERT INTO votos (userID, enqueteID, opcao) VALUES (?, ?, ?)",
        [userID, enqueteID, opcao]
        );

        res.status(201).json(result);
  } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao registrar voto." });
  }
});

router.delete("/votos/:id", async (req, res) => {
  try {
    const id = req.params;

    const result = await con.query(
      "DELETE FROM votos WHERE id = ?",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Voto não encontrado." });
    }

    res.json({ message: "Voto removido.", voto: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Falha ao remover voto." });
  }
});

router.get("/votos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await con.query(
      `SELECT opcao, COUNT(*) as total
       FROM votos
       WHERE enqueteID = ?
       GROUP BY opcao`,
      [id]
    );

    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar votos" });
  }
});