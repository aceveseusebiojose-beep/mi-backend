const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./registro_medico.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS especialistas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT, numero TEXT, correo TEXT, rama_medica TEXT, es_cliente TEXT, ganador_mundial TEXT
    )`);
});

app.post('/registrar', (req, res) => {
    const { nombre, numero, correo, rama, cliente, mundial } = req.body;
    const query = `INSERT INTO especialistas (nombre, numero, correo, rama_medica, es_cliente, ganador_mundial) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nombre, numero, correo, rama, cliente, mundial], (err) => {
        if (err) return res.status(500).send("Error");
        res.send(`<h1>✅ Guardado</h1><a href="/">Volver</a>`);
    });
});

// Ruta para ver datos desde la App
app.get('/admin', (req, res) => {
    db.all("SELECT * FROM especialistas", [], (err, filas) => {
        res.json(filas);
    });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor activo en red local puerto 3000');
});