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
- **Feedback** — thumbs up/down logged to LangSmith and SQLite, with a mandatory reason picker for thumbs-down
- **Persistence** — conversations and messages are saved to SQLite and reloaded across sessions
- **Chat threads** — sidebar to start new chats and switch between past conversations
- **Auto-scroll** — chat viewport sticks to the bottom while streaming, with a "scroll to bottom" button when scrolled up
- **Guided tour** — interactive walkthrough of the UI for first-time users (replayable via the help icon)
- **Copy to clipboard** — copy any assistant response with one click
- **Dark mode** — toggle between light and dark themes (persisted across sessions)
- **Suggested questions** — clickable starter prompts shown on a new chat
- **Export conversation** — download the current conversation as a Markdown file
- **Source preview** — click a source chip to view and copy its citation
- **Conversation rename/delete** — manage saved conversations directly from the sidebar
- **Inline citations** — assistant responses cite sources inline as `[1]`, `[2]`, etc., with a hover preview and source snippets
- **Response regeneration** — regenerate any assistant response and switch between previously generated versions
- **Responsive layout** — off-canvas sidebar drawer and adaptive spacing across mobile, tablet, and desktop

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
| `feature/chat-threads` | Sidebar with conversation history + new chat |
| `feature/auto-scroll` | Smart auto-scroll + scroll-to-bottom button |
| `feature/guided-tour` | Interactive onboarding tour (react-joyride) |
| `feature/copy-message` | Copy-to-clipboard button on assistant messages |
| `feature/dark-mode` | Dark mode toggle with class-based theme support |
| `feature/suggested-questions` | Suggested starter questions on empty chat |
| `feature/export-conversation` | Export conversation as Markdown |
| `feature/source-preview` | Source citation preview modal |
| `feature/conversation-management` | Conversation rename and delete from sidebar |
| `feature/citation-rendering` | Inline `[n]` citation markers, hover tooltip, and source snippets |
| `feature/response-regeneration` | Regenerate action, SSE handling, and version switcher |
| `feature/feedback-reason-ui` | Mandatory reason picker for thumbs-down feedback |
| `feature/responsive-design` | Off-canvas sidebar drawer and responsive layout across the app |

The backend (`Dar_RAG`) also gained branches for: `feature/db-setup` (SQLite schema), `feature/persistence-endpoints` (conversation CRUD + persistence wired into streaming), `feature/conversational-routing` and `feature/three-way-query-routing` (query classification), `feature/rename-conversation` (PATCH endpoint for renaming conversations), `feature/citation-snippets-backend` (per-source snippets and numbered `[n]` citation prompting), `feature/regenerate-endpoint` (message version history and regeneration endpoints), and `feature/feedback-db-and-reason` (feedback persisted to SQLite with mandatory negative-feedback reasons).
