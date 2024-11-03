# Indústrias Wayne

Este é o projeto "Indústrias Wayne", uma plataforma web full stack que fornece soluções para gerenciamento de segurança e recursos internos para a empresa fictícia Indústrias Wayne, conhecida por seu legado de inovação em Gotham City. 

## Visão Geral do Projeto

A aplicação foi projetada para otimizar os processos de segurança e gestão de recursos nas instalações das Indústrias Wayne. O sistema possui recursos de controle de acesso, inventário de equipamentos de segurança e um painel de visualização de dados relevante para a segurança da empresa.

### Funcionalidades Principais

- **Sistema de Gestão de Segurança**: Controle de acesso a áreas restritas com gerenciamento de diferentes tipos de usuários.
- **Gestão de Recursos**: Gerenciamento de inventário de equipamentos e dispositivos de segurança, com opções para adicionar, editar e excluir itens.
- **Dashboard de Visualização**: Interface gráfica para monitorar dados de segurança e recursos.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: EJS para renderização dinâmica de páginas
- **Banco de Dados**: MySQL, gerenciado pelo MySQL Workbench
- **Estilização ***: Pretendemos utilizar Bootstrap 4 para uma interface mais estilizada e amigável
- **Autenticação ***: Implementaremos um sistema de autenticação de login para maior segurança

## Dependências (Bibliotecas)

cookie-parser       <-- Middleware para analisar cookies
express             <-- Framework web para o Node.js
mysql2              <-- Cliente MySQL para Node.js
body-parser         <-- Middleware para analisar o corpo das requisições
express-ejs-layouts <-- Suporte para layouts em EJS
express-flash       <-- Exibir mensagens flash (notificações temporárias)
express-session     <-- Middleware para gerenciar sessões de usuário
jsonwebtoken        <-- Autenticação baseada em JWT (JSON Web Token)
bcrypt              <-- Biblioteca para hashing de senhas
multer              <-- Middleware para upload de arquivos
dotenv              <-- Gerenciamento de variáveis de ambiente
validator           <-- Validação de dados de entrada
connect-flash       <-- Exibir mensagens flash usando sessions
helmet              <-- Segurança para cabeçalhos HTTP
cors                <-- Permitir requisições de diferentes domínios
morgan              <-- Logger HTTP para monitoramento de requisições



## Estrutura de Arquivos

```plaintext
industrias-wayne/
├── config
    ├── connection.js
├── node_modules  
├── public/                 # Arquivos estáticos
│   └── css/ 
    └── js/               
    ├── images/
├── uploads   
├── views/                  # Páginas EJS       
    ├── errors  
    ├── partials          
        ├── header.ejs
        ├── footer.ejs                       
│   ├── layout.ejs          # Layout padrão
│   ├── dashboard.ejs       # Dashboard de visualização
│   └── editar_recurso.ejs  # Página de edição de recursos
    ├── login.ejs
    ├── register.ejs
    ├── atualizar.ejs  
    ├── index.ejs  
├── app.js                  # Arquivo principal da aplicação
├── package.json            # Dependências do projeto
  
└── README.md               # Documentação do projeto


