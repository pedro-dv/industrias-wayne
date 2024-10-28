// Ignora avisos de depreciação
process.env.NODE_NO_WARNINGS = '1';

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts')
const flash = require('express-flash')
const session = require('express-session'); // Adicionado para sessões

const app = express();


// Configuração para sessão e flash messages
app.use(session({
    secret: 'sua_chave_secreta',  // Altere para uma chave segura
    resave: false,
    saveUninitialized: true
}));
app.use(flash());



app.use((req, res, next) => {
    res.locals.title = 'Indústrias Wayne';
    res.locals.successMessage = req.flash('success') // Configuração global para mensagens de sucesso
    next();
});


// Usa o express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout'); // Define o layout padrão

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("public"))

// Conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'L1nux2906*',
    database: 'industrias_wayne'
});

// Definindo layout principal para o dashboard ------------------------------------------------------------
app.get('/dashboard', (req, res) => {
    connection.query('SELECT * FROM recursos', (err, recursos) => {
        if (err) throw err;
        res.render('dashboard', { title: 'Dashboard das Indústrias Wayne', recursos });
    });
});


// Rota para adicionar recurso
app.post('/recursos/adicionar', (req, res) => {
    const { nome, tipo, quantidade } = req.body;
    connection.query('INSERT INTO recursos (nome, tipo, quantidade) VALUES (?, ?, ?)', [nome, tipo, quantidade], (err) => {
        if (err) throw err;
        req.flash('success', 'Recurso adicionado com sucesso!');
        res.redirect('/dashboard');
    });
});


// Rota para deletar um recurso
app.post('/recursos/deletar/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM recursos WHERE id = ?', [id], (err) => {
        if (err) throw err;
        req.flash('success', 'Recurso deletado com sucesso!');
        res.redirect('/dashboard');
    });
});


// Rota para exibir o formulário de edição
app.get('/recursos/editar/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM recursos WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editar_recurso', { title: 'Editar Recurso', recurso: results[0] });
    });
});


// Rota para salvar as edições do recurso
app.post('/recursos/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nome, tipo, quantidade } = req.body;
    connection.query(
        'UPDATE recursos SET nome = ?, tipo = ?, quantidade = ? WHERE id = ?',
        [nome, tipo, quantidade, id],
        (err) => {
            if (err) throw err;
            req.flash('success', 'Recurso atualizado com sucesso!');
            res.redirect('/dashboard');
        }
    );
});


// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
