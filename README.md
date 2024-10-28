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
- **Estilização Futuramente**: Pretendemos utilizar Bootstrap 4 para uma interface mais estilizada e amigável
- **Autenticação Futuramente**: Implementaremos um sistema de autenticação de login para maior segurança

## Estrutura de Arquivos

```plaintext
industrias-wayne/
│
├── app.js                  # Arquivo principal da aplicação
├── package.json            # Dependências do projeto
├── views/                  # Páginas EJS
│   ├── layout.ejs          # Layout padrão
│   ├── dashboard.ejs       # Dashboard de visualização
│   └── editar_recurso.ejs  # Página de edição de recursos
│
├── public/                 # Arquivos estáticos
│   └── css/ 
    └── js/                # Estilos personalizados
│
└── README.md               # Documentação do projeto
