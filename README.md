# Dar Chat — Week 2

React frontend for the CIS Controls v8 RAG assistant built in Week 1.  
Connects to the local RAG backend via SSE streaming, renders AI responses as markdown, and logs human feedback to LangSmith.

## Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Markdown | react-markdown + remark-gfm |
| Icons | lucide-react |
| Backend | [Dar_RAG](https://github.com/assi09/Dar_RAG) (FastAPI + Weaviate + Ollama) |

## Features

- **Basic integration** — chat state management, controlled input, props-driven components
- **SSE streaming** — responses stream token-by-token via Server-Sent Events
- **Markdown rendering** — AI responses rendered with lists, bold, and code formatting
- **Loading states** — animated thinking bubble while the backend processes
- **Feedback** — thumbs up/down logged to LangSmith + local JSON via the Week 1 API

## Setup

This repo includes the Week 1 backend as a git submodule under `backend/`.

```bash
# Clone with backend included
git clone --recurse-submodules https://github.com/assi09/Dar_week2.git
cd Dar_week2

# Start the backend (in a separate terminal)
cd backend && source venv/bin/activate
docker start weaviate
HF_HUB_DISABLE_XET=1 uvicorn src.api:app --reload --port 8000

# Start the frontend
cd .. && npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Branch Structure

| Branch | Feature |
|---|---|
| `feature/static-chat-layout` | Week 2 starting point — scaffolded shell |
| `feature/basic-integration` | InputBar + ChatViewport wired with props |
| `feature/sse-streaming` | App state management + SSE stream reader |
| `feature/markdown-rendering` | react-markdown + sources + feedback UI |
| `feature/loading-states` | Animated thinking bubble |
| `feature/backend-submodule` | Dar_RAG linked as git submodule |
