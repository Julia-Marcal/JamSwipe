````markdown
# JamSwipe

Aplicação interativa para descoberta, listagem e reprodução de músicas, integrando backend, banco de dados e frontend.

---

## 🎯 Objetivo da Aplicação

O JamSwipe permite que o usuário navegue por músicas, visualize dados armazenados no banco e interaja com o conteúdo em uma interface dinâmica.

Esta entrega corresponde à **Iteração 2**, incluindo:  
✅ Estrutura backend funcional  
✅ Base MongoDB com rota de seed  
✅ Execução via Docker  
✅ Frontend executável localmente  
✅ README documentado para desenvolvedores

---

## 🛠️ Tecnologias Utilizadas

| Camada                 | Tecnologia                             |
| ---------------------- | -------------------------------------- |
| Backend                | Node.js + Express                      |
| Banco de Dados         | MongoDB                                |
| Frontend               | (React/Vite — ajustar caso necessário) |
| Gerenciador de pacotes | pnpm (ou npm)                          |
| Contêinerização        | Docker e Docker Compose                |

---

## 📌 Pré-requisitos

| Recurso                 | Necessário?               |
| ----------------------- | ------------------------- |
| Git instalado           | ✅                        |
| Docker + Docker Compose | ✅ (execução recomendada) |
| Node.js (v18+)          | ✅ (para execução manual) |
| pnpm ou npm             | ✅                        |

---

## 🚀 1. Executar a aplicação com Docker (recomendado)

No diretório raiz do projeto:

```bash
docker compose up --build -d
```
````

Isso irá:

- Subir o banco MongoDB
- Buildar e iniciar o backend

Backend disponível em:

```
http://localhost:5000
```

---

## 🎵 2. Popular o banco com músicas de exemplo

```bash
curl -X POST http://localhost:5000/api/music/seed
```

Essa rota insere dados reais na coleção `Music`.

---

## 🖥️ 3. Executar o frontend manualmente

```bash
cd frontend
pnpm install       # ou npm install
pnpm run dev --host
```

Acesse via navegador:

```
http://localhost:5173
```

---

## 🔧 4. Executando o backend separadamente

```bash
cd backend
npm install
npm start
```

Backend disponível em:

```
http://localhost:5000
```

---

## 📂 Estrutura do Projeto

```
/JamSwipe
 ├── backend
 ├── frontend
 ├── docker-compose.yml
 └── README.md
```

---

## 🔐 Variáveis de ambiente

- O backend utiliza o arquivo `.env`
- Ele **não deve ser commitado**
- Exemplo de configuração local:

```
MONGO_URI=mongodb://localhost:27017/jamswipe
```

---

## 🧪 Seeds automáticos (opcional)

Se quiser popular a base automaticamente ao iniciar o backend, adicione no `.env`:

```
RUN_SEED_ON_START=true
```

---

## 📌 Versão e Controle de Versão

- Tag da Iteração 1: `v1`
- Tag da Iteração 2: `v2`
- Branch principal: `main`

---

## ✅ Status da Entrega

| Item                               | Situação |
| ---------------------------------- | -------- |
| Backend funcional                  | ✅       |
| Seed da base MongoDB               | ✅       |
| Execução via Docker                | ✅       |
| Execução manual documentada        | ✅       |
| README completo para desenvolvedor | ✅       |
| Tag `v2` criada                    | ✅       |

---
