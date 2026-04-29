const port = 3000;

var express = require('express');
const router = express.Router();
var mysql = require('mysql2');
const cors = require('cors');

var app = express();
app.use(express.json());
app.use(express.static('./pages'));
app.use(router);
app.use(cors());

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "PUC@1234",
    database: "testeSigno"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});