process.env.NODE_NO_WARNINGS = '1';

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const flash = require('express-flash');
const session = require('express-session');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser'); // Para cookies

const secretKey = 'sua_chave_secreta_jwt';

const app = express();

// Middleware de sessão, flash e cookies
app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(cookieParser());

// Middleware para configurar mensagens de sucesso e erro
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'L1nux2906*',
    database: 'industrias_wayne'
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Middleware de layouts e body-parser
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Rota para a página inicial
app.get('/', (req, res) => {
    connection.query('SELECT * FROM recursos', (err, recursos) => {
        if (err) {
            console.error('Erro ao buscar recursos:', err);
            return res.render('index', { title: 'Página Inicial', recursos: []}); // Passa um array vazio em caso de erro
        }
        res.render('index', { title: 'Página Inicial', recursos}); // Passa os recursos para a view
    });
});


// Rota protegida para o dashboard
app.get('/dashboard', authenticateToken, (req, res) => {
    connection.query('SELECT * FROM recursos', (err, recursos) => {
        if (err) {
            req.flash('error', 'Erro ao buscar recursos');
            return res.redirect('/');
        }
        res.render('dashboard', { title: 'Dashboard das Indústrias Wayne', recursos});
    });
});




// Rota para adicionar um recurso
app.post('/recursos/adicionar', (req, res) => {
    const { nome, tipo, quantidade, descricao } = req.body; //formulário que envia esses dados
    
    const query = 'INSERT INTO recursos (nome, tipo, quantidade, descricao) VALUES (?, ?, ?, ?)';
    connection.query(query, [nome, tipo, quantidade, descricao], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar recurso:', err);
            req.flash('error', 'Erro ao adicionar recurso');
            return res.redirect('/dashboard'); // ou qualquer outra rota 
        }
        req.flash('success', 'Recurso adicionado com sucesso!');
        res.redirect('/dashboard'); // redireciona para o dashboard após o sucesso
    });
});



// Rota para exibir o formulário de registro
app.get('/register', (req, res) => {
    res.render('register', { title: 'Registro', user: req.user});
});

// Rota para processar o registro de usuário
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    console.log('Dados do registro:', { nome, email, senha }); // Adicione isso para depuração
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Consulta SQL corrigida (removendo 'tipo' ou adicionando um valor)
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    connection.query(query, [nome, email, hashedPassword], (err) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err); // Log do erro
            req.flash('error', 'Erro ao registrar usuário');
            return res.redirect('/register');
        }
        req.flash('success', 'Usuário registrado com sucesso!');
        return res.redirect('/login');
    });
});




// Rota de login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Rota para autenticação com email e senha
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            req.flash('error', 'Credenciais inválidas');
            return res.redirect('/login');
        }

        console.log("Senha digitada: ", senha)
        console.log("Hash no banco de dados: ", results[0].senha)

        // Verifica se a senha e o hash estão definidos antes de comparar
        const hashedPassword = results[0].senha;
        if (!senha || !hashedPassword) {
            req.flash('error', 'Credenciais inválidas');
            return res.redirect('/login');
        }

        const match = await bcrypt.compare(senha, hashedPassword);
        if (!match) {
            req.flash('error', 'Credenciais inválidas');
            return res.redirect('/login');
        }

        const token = jwt.sign({ id: results[0].id, email: results[0].email }, secretKey, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true });
        req.flash('success', 'Login realizado com sucesso!');
        return res.redirect('/dashboard');
    });
});

                                               // Middleware para verificar o token JWT
function authenticateToken(req, res, next) {
    const token = req.cookies.authToken;

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/login');
        req.user = user;
        next();
    });
}


// Rota para logout
app.get('/logout', (req, res) => {
    res.clearCookie('authToken'); // Remove o cookie de autenticação
    req.flash('success', 'Logout realizado com sucesso!');
    res.redirect('/'); // Redireciona para a página inicial
});












// Inicializa o servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

