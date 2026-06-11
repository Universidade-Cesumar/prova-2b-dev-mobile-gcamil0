# SysAlmoxarifado 📦

Sistema mobile de controle de estoque do almoxarifado do curso técnico de enfermagem.

## Sobre o projeto

Esse app foi desenvolvido para ajudar a instrutora Camila a gerenciar o estoque de materiais do almoxarifado, substituindo as planilhas Excel por uma interface mobile conectada a uma API. O sistema permite cadastrar novos materiais e visualizar o inventário atual em tempo real.

## Tecnologias utilizadas

- React Native
- Expo
- Hooks (useState, useEffect)
- Fetch API
- Async/Await
- MockAPI.io

## Como instalar

```bash
# clone o repositório
git clone https://github.com/Universidade-Cesumar/prova-2b-dev-mobile-gcamil0

# entre na pasta do projeto
cd prova-2b-dev-mobile-gcamil0

# instale as dependências
npm install
```

## Como executar

```bash
# inicia o servidor de desenvolvimento
npm start

# ou direto no android
npm run android

# ou direto no ios
npm run ios
```

Após rodar o `npm start`, escaneie o QR Code com o aplicativo **Expo Go** no celular.

## Estrutura do projeto

prova-2b-dev-mobile-gcamil0/
├── App.js              # tela principal com formulário e listagem
├── index.js            # ponto de entrada do app
├── package.json        # dependências do projeto
├── jest.config.js      # configuração dos testes
├── tests/          # testes automatizados
│   └── sprint1.test.js
└── assets/             # imagens e ícones