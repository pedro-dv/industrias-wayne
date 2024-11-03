
process.env.NODE_NO_WARNINGS = '1';

// // Importações
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const flash = require('express-flash');
const session = require('express-session');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const multer = require('multer');

// DataBase
const connection = require('./config/connection');

//Configurações de variáveis e constantes
const app = express();
const secretKey = '3c!B!47gR_kR#8gL!e34s*P%f';
const PORT = 3001;

//---------------Configuração do storage do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Define a pasta onde os arquivos serão armazenados
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Define o nome do arquivo
    }
});                                                    // Inicializa o multer
const upload = multer({ storage: storage });

const fs = require('fs');                              // Verifica se o diretório 'uploads' existe, se não,cria
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}


//---------------------Middleware
app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(cookieParser());
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use('/uploads', express.static('uploads')); // Serve arquivos do diretório 'uploads'

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de mensagens flash
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

//Funções de autenticação
function authenticateToken(req, res, next) {
    const token = req.cookies.authToken;
    if (!token) return res.redirect('/login');
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/login');
        req.user = user;
        next();
    });
}



//Rotas Inicio ----------------------------------------------------------------------------------------------------
app.get('/', (req, res) => {
    connection.query('SELECT * FROM recursos', (err, recursos) => {
        if (err) {
            console.error('Erro ao buscar recursos:', err);
            return res.render('index', { title: 'Página Inicial', recursos: [], isHome: true });
        }
        res.render('index', { title: 'Página Inicial', recursos, isHome: true });
    });
});


// Rota dashboard (principal logado)
app.get('/dashboard', authenticateToken, (req, res) => {
    connection.query('SELECT * FROM recursos', (err, recursos) => {
        if (err) {
            req.flash('error', 'Erro ao buscar recursos');
            return res.redirect('/');
        }
        res.render('dashboard', { title: 'Dashboard das Indústrias Wayne', recursos, isHome: false });
    });
});



// Rotas para adincinar recursos
app.post('/recursos/adicionar', upload.single('imagem'), (req, res) => {
    const { nome, tipo, quantidade, descricao } = req.body;
    const imagem = req.file ? req.file.filename : null; // Obtemos o nome da imagem
    const query = 'INSERT INTO recursos (nome, tipo, quantidade, descricao, imagem) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [nome, tipo, quantidade, descricao, imagem], (err) => {
        if (err) {
            console.error('Erro ao adicionar recurso:', err);
            req.flash('error', 'Erro ao adicionar recurso');
            return res.redirect('/dashboard');
        }
        req.flash('success', 'Recurso adicionado com sucesso!');
        res.redirect('/dashboard');
    });
});


//Rota para Deletar recurso
app.post('/recursos/deletar/:id', (req, res) => {
    const recursoId = req.params.id;
    console.log('Requisição para deletar recurso com ID:', recursoId); 

    const query = 'DELETE FROM recursos WHERE id = ?';
    connection.query(query, [recursoId], (err) => {
        if (err) {
            console.error('Erro ao deletar recurso:', err);
            req.flash('error', 'Erro ao deletar recurso');
            return res.redirect('/dashboard');
        }
        req.flash('success', 'Recurso deletado com sucesso!');
        res.redirect('/dashboard');
    });
});


// Rota para editar recurso
app.get('/recursos/editar/:id', authenticateToken, (req, res) => {
    const recursoId = req.params.id;
    const query = 'SELECT * FROM recursos WHERE id = ?';

    connection.query(query, [recursoId], (err, resultados) => {
        if (err) {
            console.error('Erro ao buscar recurso para edição:', err);
            req.flash('error', 'Erro ao buscar recurso');
            return res.redirect('/dashboard');
        }
        if (resultados.length === 0) {
            req.flash('error', 'Recurso não encontrado');
            return res.redirect('/dashboard');
        }
        res.render('editar_recurso', { title: 'Editar Recurso', recurso: resultados[0], isHome: false  });
    });
});



// Rota para atualizar recurso
app.post('/recursos/atualizar/:id', upload.single('imagem'), (req, res) => {
    const recursoId = req.params.id;
    const { nome, tipo, quantidade, descricao } = req.body;
    const imagem = req.file ? req.file.filename : null; // Nova imagem se fornecida

    // Se uma nova imagem não foi enviada, mantenha a imagem existente
    const query = 'UPDATE recursos SET nome = ?, tipo = ?, quantidade = ?, descricao = ?, imagem = COALESCE(?, imagem) WHERE id = ?';
    connection.query(query, [nome, tipo, quantidade, descricao, imagem, recursoId], (err) => {
        if (err) {
            console.error('Erro ao atualizar recurso:', err);
            req.flash('error', 'Erro ao atualizar recurso');
            return res.redirect('/dashboard');
        }
        req.flash('success', 'Recurso atualizado com sucesso!');
        res.redirect('/dashboard');
    });
});


// Rotas de autenticação
app.get('/register', (req, res) => {
    res.render('register', { title: 'Registro', user: req.user, isHome: false  });
});

app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    connection.query(query, [nome, email, hashedPassword], (err) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            req.flash('error', 'Erro ao registrar usuário');
            return res.redirect('/register');
        }
        req.flash('success', 'Usuário registrado com sucesso!');
        res.redirect('/login');
    });
});


// Rota de login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login',isHome: false  });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            req.flash('error', 'Credenciais inválidas');
            return res.redirect('/login');
        }
        const hashedPassword = results[0].senha;
        const match = await bcrypt.compare(senha, hashedPassword);
        if (!match) {
            req.flash('error', 'Credenciais inválidas');
            return res.redirect('/login');
        }
        const token = jwt.sign({ id: results[0].id, email: results[0].email }, secretKey, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true });
        req.flash('success', 'Login realizado com sucesso!');
        res.redirect('/dashboard');
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    req.flash('success', 'Logout realizado com sucesso!');
    res.redirect('/');
});



// Rota para erro 404
app.use((req, res) => {
    res.status(404).render('errors/404', { title: 'Página Não Encontrada' });
});

// Rota para erro 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500', { title: 'Erro Interno do Servidor' });
});







// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
