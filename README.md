# JamSwipe - Instruções de execução

Este projeto contém o frontend e o backend da aplicação JamSwipe.

## 1. Iniciar com Docker (recomendado)

No diretório raiz do projeto, execute:

```bash
docker compose up --build -d
```

Isso irá:

- Levantar um serviço MongoDB
- Buildar e iniciar o backend

## 2. Popular o banco de dados com músicas de exemplo (execute apenas uma vez ou se o banco estiver vazio)

```bash
curl -X POST http://localhost:5000/api/music/seed
```

Isso acionará a rota existente que popula a coleção `Music` com amostras.

## 4. Executar manualmente o frontend (ex.: em um servidor Ubuntu)

1. Navegar para o diretório do frontend, instalar dependências e iniciar o servidor de desenvolvimento:

```bash
cd /home/ubuntu/jamswipe-frontend
pnpm install
pnpm run dev --host
```

## Observações e dicas

- Depois que o `docker compose up` estiver rodando, o backend estará disponível em `http://localhost:5000`.
- Não commit suas credenciais reais. Use `backend/.env` localmente e não o suba no repositório.
- Se preferir que a aplicação faça seeding automaticamente na primeira inicialização, posso adicionar uma flag de ambiente para ativar esse comportamento.

Se quiser, eu atualizo o `server.js` para executar o seed automaticamente quando uma variável de ambiente (ex.: `RUN_SEED_ON_START=true`) estiver presente.
