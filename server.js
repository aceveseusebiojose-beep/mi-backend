const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./registro_medico.db');

// Configuración para leer formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Crear la tabla
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS especialistas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        numero TEXT,
        correo TEXT,
        rama_medica TEXT,
        es_cliente TEXT,
        ganador_mundial TEXT
    )`);
});

// RUTA PRINCIPAL (Para ver el formulario)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// RUTA DE REGISTRO (Aquí es donde llega el formulario)
app.post('/registrar', (req, res) => {
    console.log("Datos recibidos:", req.body); // Esto aparecerá en tu terminal de VS Code
    
    const { nombre, numero, correo, rama, cliente, mundial } = req.body;
    
    const query = `INSERT INTO especialistas (nombre, numero, correo, rama_medica, es_cliente, ganador_mundial) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [nombre, numero, correo, rama, cliente, mundial], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Error en la base de datos");
        }
        res.send(`
            <div style="font-family:sans-serif; text-align:center; padding-top:50px;">
                <h1 style="color: #0071e3;">✅ ¡Registro Guardado!</h1>
                <p>La información ya está en el archivo .db</p>
                <a href="/">Volver a registrar otro</a>
            </div>
        `);
    });
});

app.listen(3000, () => {
    console.log('Servidor activo en http://localhost:3000');
});