# Web3 AI Copilot Dashboard

Modern, dark/light, animated and highly optimized web application that combines: Web3 (with Wagmi/Viem), blockchain analytics, an intelligent multi-chain portfolio dashboard, and an integrated AI Copilot system.

## Architecture

Nx monorepo with modular structure:

```
web3-ai-copilot/
├─ apps/
│  ├─ web/              # Frontend: Vite + React + TypeScript
│  └─ ai-gateway/       # Backend: Node + Fastify/Express - LLMs, RAG, tools
├─ libs/
│  ├─ wallet/           # wagmi/viem config, wallet connection, multi-chain support
│  ├─ ui-components/    # design system (components, tradingview wrappers)
│  ├─ app-state/        # zustand stores (theme, UI state)
│  ├─ data-hooks/       # react-query hooks, zerion API wrappers
│  ├─ ai-config/        # prompts, schemas (zod), adapters for LLM providers
│  ├─ rag-services/     # embeddings, vector-store adapters
│  ├─ trading-charts/   # TradingView components (Lightweight Charts + Widget)
│  ├─ shared-utils/     # shared utilities (formatters, validators)
│  └─ export-services/  # PDF/CSV export services
└─ tools/               # scripts, infra helpers
```

## Technologies

### Frontend

- React + TypeScript (strict)
- Vite 7.2
- Tailwind CSS v4.1 (with @tailwindcss/vite plugin, dark/light mode)
- Wagmi + Viem (wallet connection, on-chain reads)
- React Query (data fetching & caching)
- Zustand (UI state)
- TradingView Lightweight Charts + Advanced Widget

### Backend

- Node + Fastify/Express (or serverless)
- LangChainJS (pipelines, chains)
- OpenAI SDK / Anthropic SDK
- Vector DB: Supabase pgvector / Pinecone / Qdrant
- Zod (schemas & validation)

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

**Frontend (apps/web/.env.local):**
Copy `apps/web/.env.example` to `apps/web/.env.local` and configure:

- `VITE_ZERION_API_KEY` - Zerion API key (required)
- `VITE_WALLET_CONNECT_PROJECT_ID` - WalletConnect Project ID (optional)
- `VITE_AI_GATEWAY_URL` - AI Gateway backend URL (default: http://localhost:3001)

**Backend (apps/ai-gateway/.env):**
Copy `apps/ai-gateway/.env.example` to `apps/ai-gateway/.env` and configure:

- `PORT` - Server port (default: 3001)
- `OPENAI_API_KEY` - OpenAI API key (optional, to use OpenAI)
- `ANTHROPIC_API_KEY` - Anthropic API key (optional, to use Anthropic)
- `LLAMA_API_URL` - Local Llama server URL (optional)
- `LLAMA_API_KEY` - Llama API key (optional)
- `DEFAULT_AI_PROVIDER` - Default provider: openai, anthropic, or llama

3. Run development:

Frontend:

```bash
pnpm dev
```

Backend:

```bash
pnpm dev:gateway
```

## Project Structure

- `apps/web` - Main frontend application
- `apps/ai-gateway` - Backend for AI Copilot
- `libs/wallet` - Wagmi/Viem configuration and Web3 utilities for wallet
- `libs/ui-components` - Reusable UI components
- `libs/app-state` - Zustand stores for application state
- `libs/data-hooks` - React Query hooks for portfolio data
- `libs/ai-config` - Configuration and adapters for LLM providers
- `libs/rag-services` - Vector store and embeddings services
- `libs/trading-charts` - TradingView chart components
- `libs/shared-utils` - Shared general utilities
- `libs/export-services` - PDF/CSV export services

## Features

- ✅ Multi-chain wallet connection (Ethereum, Arbitrum, Optimism, Base, Polygon)
- ✅ Portfolio dashboard with automatic detection of tokens, NFTs, and DeFi
- ✅ Zerion API integration
- ✅ Modern UI with dark/light mode and smooth animations
- ✅ AI Copilot with support for multiple LLM providers
- ✅ RAG with vector store for historical analysis
- ✅ TradingView charts (Lightweight + Advanced Widget)
- ✅ Portfolio export (PDF/CSV)
- ✅ NFT viewer
- ✅ DeFi positions visualization (pools)

## Development

```bash
# Install dependencies
pnpm install

# Run frontend
pnpm dev

# Run backend (in another terminal)
pnpm dev:gateway

# Build
pnpm build

# Lint
pnpm lint              # Lint a specific project (requires project name)
pnpm lint:all          # Lint all projects in the monorepo
pnpm lint:fix          # Lint and apply automatic fixes to all projects
pnpm lint:debug        # Lint with detailed output (verbose) for debugging
pnpm lint:errors       # Lint showing only errors in stream format
pnpm lint:json         # Lint with JSON output for processing
pnpm lint:summary      # Summary of lint errors by project

# Test
pnpm test
```

## Important Notes

- **Zerion API**: You need a Zerion API key to get portfolio data. Sign up at https://zerion.io/
- **WalletConnect**: Optional but recommended for better wallet connection UX
- **AI Providers**: At least one AI provider must be configured to use the AI Copilot
- **Vector Store**: Vector store integration (RAG) is optional and requires additional configuration

## License

MIT
