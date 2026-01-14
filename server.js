require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexão MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erro ao conectar ao MySQL:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados MySQL!');
        connection.release();
    }
});

// Rota de Cadastro
app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    try {
        const hash = await bcrypt.hash(senha, 10);
        const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
        
        db.query(sql, [nome, email, hash], (err) => {
            if (err) {
                return res.status(500).json({ error: "Email já cadastrado" });
            }
            res.json({ message: "Usuário cadastrado com sucesso!" });
        });
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// Rota de Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: "Usuário ou senha incorreto" });
        }

        const usuario = results[0];
        const match = await bcrypt.compare(senha, usuario.senha);

        if (match) {
            // Gera Token JWT
            const token = jwt.sign(
                { id: usuario.id, nome: usuario.nome },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ 
                success: true, 
                message: "Login realizado!", 
                token: token, 
                user: usuario.nome 
            });
        } else {
            res.status(401).json({ error: "Usuário ou senha incorreto" });
        }
    });
});

// Middleware de verificação de Token (Para rotas protegidas futuras)
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "Token não fornecido" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token inválido" });
        req.userId = decoded.id;
        next();
    });
}

// Rota para Dashboard (apenas serve o arquivo, a proteção é feita no front)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

// Redireciona raiz para index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});