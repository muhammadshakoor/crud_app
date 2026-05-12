# CRUD App — Full Stack Monorepo

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

> A full-stack CRUD application with frontend and backend living in a single monorepo — deployed together on Vercel using a unified `vercel.json` configuration.

🔗 **Live Demo:** [crud-app-drab-ten.vercel.app](https://crud-app-drab-ten.vercel.app)

---

## ✨ Features

- ✅ Full Create, Read, Update, Delete (CRUD) operations
- ✅ Frontend and backend in a single monorepo — one repo, one deployment
- ✅ TypeScript frontend for type-safe UI development
- ✅ Serverless API functions deployed via Vercel
- ✅ Unified Vercel deployment with automatic routing between frontend and API

---

## 🏗️ Project Structure

```
crud_app/
├── frontend/          # TypeScript frontend (React / static build)
│   ├── src/
│   └── package.json
├── backend/           # Backend logic and utilities
├── api/               # Vercel serverless API functions (Node.js)
│   └── *.js           # Each file = one serverless endpoint
├── vercel.json        # Unified deployment config — routes API + frontend
└── .gitignore
```

---

## 🚀 Architecture

```mermaid
graph LR
    A[Browser] -->|Static files| B[frontend/]
    A -->|/api/* requests| C[api/*.js]
    C -->|Serverless functions| D[Vercel Node Runtime]
    B -->|Built by| E[@vercel/static-build]
    C -->|Built by| F[@vercel/node]
```

The `vercel.json` wires everything together:
- Requests to `/api/*` → serverless Node.js functions in `api/`
- All other requests → static frontend build from `frontend/`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | TypeScript · React |
| API | Node.js · Vercel Serverless Functions |
| Deployment | Vercel (monorepo config) |
| Language split | TypeScript 55% · JavaScript 44% |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm
- Vercel CLI (optional, for local dev)

### Run locally

```bash
# Clone the repo
git clone https://github.com/muhammadshakoor/crud_app.git
cd crud_app

# Install frontend dependencies
cd frontend
npm install
npm run dev

# In a separate terminal — run API locally via Vercel CLI
cd ..
npx vercel dev
```

Frontend runs at `http://localhost:5173` (or as configured)
API runs at `http://localhost:3000/api/`

### Deploy to Vercel

```bash
# From the repo root
npx vercel --prod
```

Vercel automatically detects `vercel.json` and deploys both frontend and API together.

---

## 📡 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Fetch all items |
| GET | `/api/items/:id` | Fetch single item |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

---

## 🌐 Deployment

This project uses a **monorepo Vercel deployment** strategy:

```json
{
  "version": 2,
  "builds": [
    { "src": "api/*.js", "use": "@vercel/node" },
    { "src": "frontend/package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1.js" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ]
}
```

Both the frontend static build and the serverless API functions are deployed from a single `git push` — no separate deployments needed.

---

## 📄 License

MIT © [Muhammad Shakoor](https://github.com/muhammadshakoor)
