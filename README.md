# Web3 AI Copilot Dashboard

Modern, optimized, and highly functional web application that combines Web3 blockchain analytics, an intelligent multi-chain portfolio dashboard, and an integrated AI Copilot system for real-time analysis and recommendations.

## 🎯 Overview

**Web3 AI Copilot** is a comprehensive platform that enables users to:

- **Connect multiple wallets** across different blockchains (Ethereum, Arbitrum, Optimism, Base, Polygon)
- **Visualize complete portfolios** with automatic detection of tokens, NFTs, and DeFi positions
- **Analyze performance** with advanced charts and real-time metrics
- **Interact with AI** to get intelligent analysis, recommendations, and contextual answers about their portfolio
- **Export data** in PDF and CSV formats for external analysis

The application is built as an Nx monorepo, enabling modular, scalable, and maintainable development.

---

## 🏗️ Architecture

### Monorepo Structure

```
web3-ai-copilot/
├─ apps/
│  ├─ web/              # Frontend: React application with Vite
│  └─ ai-gateway/       # Backend: REST API with Express for AI
├─ libs/
│  ├─ wallet/           # Wagmi/Viem configuration and wallet management
│  ├─ data-hooks/       # React Query hooks and API clients (Zerion)
│  ├─ ai-config/        # Configuration and prompts for LLM providers
│  ├─ rag-services/     # Embeddings and vector store services (in development)
│  ├─ trading-charts/   # TradingView components (Lightweight + Widget)
│  ├─ shared-utils/     # Shared utilities (formatters, validators)
│  └─ export-services/  # PDF/CSV export services
└─ tools/               # Scripts and infrastructure helpers
```

### Data Flow

1. **User connects wallet** → `libs/wallet` handles connection with Wagmi
2. **Frontend fetches data** → `libs/data-hooks` uses React Query to fetch from Zerion API
3. **UI displays portfolio** → React components render tokens, NFTs, DeFi, and transactions
4. **User interacts with AI** → `apps/ai-gateway` processes messages with LLM and portfolio context
5. **History persists** → Zustand with localStorage maintains conversations per wallet

---

## 🛠️ Technologies

### Frontend (`apps/web`)

#### Core

- **React 18.3+** - UI library with strict TypeScript
- **Vite 7.2+** - Ultra-fast build tool with HMR
- **TypeScript 5.7+** - Static typing with strict mode

#### Styling and UI

- **Tailwind CSS v4.1+** - Utility-first CSS framework with `@tailwindcss/vite`
- **@e-burgos/tucu-ui** - Design system with pre-built components
- **@e-burgos/tucutable** - Advanced data tables with pagination and search
- **Dark/Light Mode** - Native support with smooth transitions

#### Web3 and Blockchain

- **Wagmi 2.5+** - React hooks for Ethereum
- **Viem 2.9+** - TypeScript library for interacting with Ethereum
- **@wagmi/core** - Wagmi core for advanced operations
- **Multi-chain support** - Ethereum, Arbitrum, Optimism, Base, Polygon

#### State Management and Data

- **React Query (@tanstack/react-query) 5.17+** - Data fetching, caching, and synchronization
- **Zustand 5.0+** - Lightweight state management with persistence
- **React Query DevTools** - Development tools for debugging

#### Data Visualization

- **TradingView Lightweight Charts 4.1+** - Lightweight price charts (sparklines)
- **TradingView Advanced Widget** - Complete technical analysis widget
- **Recharts 3.5+** - Additional charts for distributions

#### Export

- **jsPDF 2.5+** - PDF generation on the client
- **Native CSV** - Tabular data export

### Backend (`apps/ai-gateway`)

#### Core

- **Node.js** - JavaScript runtime
- **Express 4.21+** - Minimalist web framework
- **TypeScript** - Static typing

#### AI and LLMs

- **OpenAI SDK** - Integration with GPT-4, GPT-3.5
- **Anthropic SDK** - Integration with Claude
- **Llama** - Support for local/self-hosted models
- **Prompt system** - Configurable templates for portfolio analysis

#### Validation and Documentation

- **Zod 3.22+** - TypeScript-first schema validation
- **Swagger/OpenAPI** - Automatic API documentation
- **swagger-jsdoc** - Documentation generation from comments
- **swagger-ui-express** - Interactive UI to explore API

#### RAG (Retrieval Augmented Generation)

- **Vector Stores** - Support for Supabase pgvector, Pinecone, Qdrant (in development)
- **Embeddings** - Services for generating document embeddings (planned)
- **Context retrieval** - Semantic search to improve AI responses (planned)

---

## 📱 Developed Applications

### 1. **Web App** (`apps/web`)

React frontend application providing a complete interface for Web3 portfolio management.

#### Main Features

##### Portfolio Dashboard

- **Overview** with total value, 24h changes, distribution by type and by chain
- **Interactive charts** of asset distribution (Asset Allocation)
- **Top assets** visualized with bar charts
- **Real-time metrics** automatically updated

##### Token Management

- **Complete table** with all tokens detected across all chains
- **Price sparklines** 24h using TradingView Lightweight Charts
- **Real-time search and filtering**
- **Manual pagination** for large data volumes
- **Detailed information**: balance, price, USD value, 24h change

##### NFT Visualization

- **NFT gallery** with images and metadata
- **Collection filtering** and sorting
- **Information modal** with complete NFT details
- **Multi-chain support** for NFTs on different blockchains

##### DeFi Positions

- **Position table** in DeFi protocols (Uniswap, Aave, Compound, etc.)
- **Pool information** with APY, locked value, position type
- **Automatic detection** of liquidity pools, staking, lending
- **Performance metrics** per protocol

##### Transactions

- **Complete history** of recent transactions
- **Transfer details** with involved tokens
- **Filtering by operation type** (swap, transfer, approve, etc.)
- **Fee information** and timestamps

##### AI Copilot

- **Chat sidebar** with integrated AI assistant
- **Contextual analysis** of portfolio in real-time
- **Persistent history** per wallet using Zustand + localStorage
- **Multiple AI providers** (OpenAI, Anthropic, Llama)
- **Intelligent recommendations** based on portfolio data

##### Export

- **Export to PDF** with professional format and structured tables
- **Export to CSV** for analysis in Excel/Google Sheets
- **Includes all data**: tokens, NFTs, DeFi, transactions

#### Technical Features

- **Automatic code splitting** with React.lazy and Suspense
- **Render optimization** with React.memo and useMemo
- **Intelligent caching** with React Query to reduce requests
- **State persistence** with Zustand for UI state and chat history
- **Responsive design** adapted for mobile, tablets, and desktop
- **Accessibility** with ARIA labels and keyboard navigation

### 2. **AI Gateway** (`apps/ai-gateway`)

REST API backend providing AI services for portfolio analysis and contextual chat.

#### Main Endpoints

##### `/api/chat` (POST)

**Purpose**: Interactive chat with AI assistant about portfolio

**Request Body**:

```json
{
  "messages": [{ "role": "user", "content": "What is my best token?" }],
  "portfolioData": {
    /* portfolio data */
  },
  "provider": "openai"
}
```

**Response**:

```json
{
  "content": "Your best token is ETH with a value of $8,500...",
  "usage": {
    "promptTokens": 250,
    "completionTokens": 180,
    "totalTokens": 430
  }
}
```

**Features**:

- Zod validation of all inputs
- Automatic portfolio context in system prompt
- Support for multiple LLM providers
- Token usage tracking for cost management

##### `/api/portfolio-analysis` (POST)

**Purpose**: Complete and structured portfolio analysis

**Request Body**:

```json
{
  "portfolioData": {
    /* complete portfolio data */
  },
  "provider": "anthropic"
}
```

**Response**:

```json
{
  "content": "Detailed analysis: Your portfolio shows...",
  "usage": {
    /* tokens used */
  }
}
```

**Features**:

- Deep analysis of diversification, risk, performance
- Personalized recommendations based on real data
- Specialized prompts for financial analysis

##### `/health` (GET)

**Purpose**: Server health check

**Response**:

```json
{
  "status": "ok"
}
```

#### Technical Features

- **Robust validation** with Zod schemas for type safety
- **Centralized error handling** with custom middleware
- **Swagger/OpenAPI** for interactive documentation
- **CORS configured** for development and production
- **Modular and extensible** to add new LLM providers

---

## 📚 Developed Libraries

### 1. **@web3-ai-copilot/wallet** (`libs/wallet`)

Centralized library for wallet management and blockchain connection.

#### Features

- **Wagmi/Viem configuration** pre-configured for multiple chains
- **Custom hooks**:
  - `useWallet()` - Connection state, address, disconnect
  - `useMultiChainBalance()` - Native balance across multiple chains
- **Multi-chain support**: Ethereum, Arbitrum, Optimism, Base, Polygon
- **WalletConnect integration** optional for better UX
- **Zustand store** for global wallet state

#### Usage

```typescript
import { useWallet } from '@web3-ai-copilot/wallet';

function MyComponent() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  // ...
}
```

#### Benefits

- **Complete abstraction** of Wagmi/Viem complexity
- **Reusable** anywhere in the application
- **Type-safe** with TypeScript
- **Easy to extend** for new chains or wallets

---

### 2. **@web3-ai-copilot/data-hooks** (`libs/data-hooks`)

React Query hooks and API clients for fetching portfolio data.

#### Features

##### Data Hooks

- `useTokenData()` - Tokens with pagination and filters
- `useNftData()` - NFTs with sorting and filtering
- `useDeFiPositionsData()` - DeFi positions with metrics
- `useTransactionData()` - Recent transactions
- `usePortfolioData()` - Portfolio overview
- `useContextPortfolioData()` - **Master hook** that fetches all data

##### Zerion Client

- TypeScript wrapper for Zerion API
- Automatic pagination handling
- Data transformation to internal types
- Error handling and retry logic

##### Mappers

- `tokensMapper` - Transforms Zerion data → `TokenItem`
- `nftsMapper` - Transforms Zerion data → `NftItem`
- `deFiPositionsMapper` - Transforms Zerion data → `DefiPosition`
- `transactionsMapper` - Transforms Zerion data → `TransactionItem`

#### Usage

```typescript
import { useContextPortfolioData } from '@web3-ai-copilot/data-hooks';

function PortfolioDashboard() {
  const { data, isLoading, error } = useContextPortfolioData();
  // data contains: tokens, nfts, defiPositions, recentTransactions, portfolio
}
```

#### Benefits

- **Automatic caching** with React Query
- **Intelligent refetch** in background
- **Complete type safety** with TypeScript
- **Optimistic updates** for better UX
- **Automatic request deduplication**

---

### 3. **@web3-ai-copilot/ai-config** (`libs/ai-config`)

Centralized configuration for LLM providers and prompts.

#### Features

- **Provider configuration**: OpenAI, Anthropic, Llama
- **Specialized prompts**:
  - `getPortfolioAnalysisPrompt()` - Prompt for portfolio analysis
  - Configurable and extensible templates
- **TypeScript types** for AI providers and configurations
- **Configuration validation**

#### Usage

```typescript
import { getPortfolioAnalysisPrompt } from '@web3-ai-copilot/ai-config';

const prompt = getPortfolioAnalysisPrompt(portfolioData);
```

#### Benefits

- **Centralization** of AI logic
- **Easy maintenance** of prompts
- **Reusable** in frontend and backend
- **Versioning** of prompts for A/B testing

---

### 4. **@web3-ai-copilot/rag-services** (`libs/rag-services`)

Services for RAG (Retrieval Augmented Generation) with vector stores.

#### Current Implementation (Foundation)

The library provides the foundational structure and interfaces for RAG functionality:

- **VectorStore interface** - Abstract interface for vector store operations
- **VectorStoreService class** - Base implementation with placeholder methods
- **DocumentChunk interface** - Structure for document chunks with embeddings
- **Multi-provider support** - Configuration for Supabase pgvector, Pinecone, Qdrant

#### Planned Features (Future Implementation)

##### Vector Store Adapters

- **Supabase pgvector adapter** - Full integration with Supabase vector database
- **Pinecone adapter** - Complete Pinecone integration for production use
- **Qdrant adapter** - Qdrant vector database support

##### Embeddings Services

- **OpenAI embeddings** - Integration with OpenAI embedding models
- **Alternative embeddings** - Support for other embedding providers
- **Batch processing** - Efficient processing of large document sets

##### Document Processing

- **Text chunking** - Intelligent document splitting for optimal retrieval
- **Metadata extraction** - Automatic extraction of relevant metadata
- **Indexing pipeline** - Automated pipeline for document ingestion

##### Search and Retrieval

- **Semantic search** - Vector similarity search for context retrieval
- **Hybrid search** - Combination of vector and keyword search
- **Top-K retrieval** - Configurable result ranking and filtering

#### Usage (Future)

```typescript
import { VectorStoreService } from '@web3-ai-copilot/rag-services';

// Initialize with provider
const vectorStore = new VectorStoreService({
  provider: 'supabase',
  url: process.env.SUPABASE_URL,
  apiKey: process.env.SUPABASE_KEY,
});

// Add documents
await vectorStore.addDocuments([
  {
    id: 'doc1',
    content: 'Portfolio analysis document...',
    metadata: { type: 'analysis', date: '2024-01-01' },
  },
]);

// Search for relevant context
const results = await vectorStore.search(
  'What is my portfolio performance?',
  5
);
```

#### Benefits

- **Improved AI responses** with historical context
- **Extensible** for new vector stores
- **Abstraction** of embedding complexity
- **Scalable** architecture for production use

---

### 5. **@web3-ai-copilot/trading-charts** (`libs/trading-charts`)

React components for financial data visualization.

#### Components

##### SparklineChart

**Status**: ✅ Fully Implemented

Lightweight line charts for displaying 24h price trends in tables and compact spaces.

**Features**:

- Minimal UI with transparent background
- Customizable colors and height
- Responsive to container size
- Smooth animations
- Dark/light mode support

**Usage**:

```typescript
import { SparklineChart } from '@web3-ai-copilot/trading-charts';

<SparklineChart
  data={priceData}
  height={40}
  color="#3b82f6"
/>
```

##### PortfolioChart

**Status**: ✅ Fully Implemented

Full-featured line charts for portfolio value over time with complete TradingView styling.

**Features**:

- Full TradingView Lightweight Charts integration
- Dark/light mode with theme detection
- Grid lines and price scale
- Responsive design
- Customizable height

**Usage**:

```typescript
import { PortfolioChart } from '@web3-ai-copilot/trading-charts';

<PortfolioChart
  data={portfolioValueData}
  height={300}
/>
```

##### TradingViewWidget

**Status**: ✅ Fully Implemented

Complete TradingView Advanced Chart widget for comprehensive technical analysis.

**Features**:

- Full TradingView widget integration
- Dark/light theme support
- Symbol change capability
- Technical indicators
- Drawing tools
- Timeframe selection

**Usage**:

```typescript
import { TradingViewWidget } from '@web3-ai-copilot/trading-charts';

<TradingViewWidget
  symbol="ETHUSD"
  height={500}
/>
```

#### Planned Enhancements (Future)

- **Candlestick charts** - OHLC data visualization
- **Volume indicators** - Trading volume overlays
- **Multiple series** - Compare multiple assets on one chart
- **Custom indicators** - Add custom technical indicators
- **Export functionality** - Export charts as images

#### Benefits

- **Reusable** across multiple parts of the app
- **Performance optimized** with efficient rendering
- **Type-safe** with TypeScript
- **Responsive** and adaptable
- **Production-ready** components

---

### 6. **@web3-ai-copilot/shared-utils** (`libs/shared-utils`)

Shared utilities for formatting and validation.

#### Features

##### Formatters

- `formatAddress()` - Formats Ethereum addresses (0x1234...5678)
- `formatCurrency()` - Formats monetary values ($1,234.56)
- `formatNumber()` - Formats numbers with separators

##### Validators

- `isAddress()` - Validates Ethereum addresses
- Additional validators for Web3 data

#### Usage

```typescript
import {
  formatAddress,
  formatCurrency,
  isAddress,
} from '@web3-ai-copilot/shared-utils';

const formatted = formatAddress(address, 6, 4); // "0x1234...5678"
const currency = formatCurrency(1234.56); // "$1,234.56"
const valid = isAddress(address); // true/false
```

#### Benefits

- **Consistency** in formatting across the app
- **Reusable** in frontend and backend
- **Maintainable** - changes in one place

---

### 7. **@web3-ai-copilot/export-services** (`libs/export-services`)

Services for exporting portfolio data to PDF and CSV.

#### Features

##### PDF Export

- **Professional format** with structured tables
- **Landscape orientation** for better visualization
- **Multiple sections**: Summary, Tokens, NFTs, DeFi, Transactions
- **Borders and styles** for readability
- **Automatic page breaks**

##### CSV Export

- **Standard format** compatible with Excel/Google Sheets
- **Multiple sections** in a single file
- **UTF-8 encoding** for special characters

##### React Component

- **`ExportButton`** - Pre-built button for exporting

#### Usage

```typescript
import { exportToPdf, exportToCsv } from '@web3-ai-copilot/export-services';
// or
import { ExportButton } from '@web3-ai-copilot/export-services';

<ExportButton />
```

#### Benefits

- **Ready to use** with React component
- **Professional format** for reports
- **Compatible** with standard tools
- **Extensible** for new formats

---

## 🚀 How It Works

### Complete Application Flow

#### 1. Wallet Connection

```
User → Click "Connect Wallet"
  → Wagmi shows options (MetaMask, WalletConnect, etc.)
  → User selects wallet
  → Wallet connects
  → address saved in Zustand store
  → React Query detects address and triggers queries
```

#### 2. Data Fetching

```
React Query hooks detect address
  → useTokenData() calls Zerion API
  → useNftData() calls Zerion API
  → useDeFiPositionsData() calls Zerion API
  → useTransactionData() calls Zerion API
  → Data transformed with mappers
  → Data cached in React Query
  → UI updates automatically
```

#### 3. AI Interaction

```
User types message in chat
  → Message added to Zustand store (persisted)
  → Frontend sends POST /api/chat with:
     - Message history
     - Complete portfolio data
  → Backend validates with Zod
  → aiController builds system prompt with context
  → llmService calls LLM provider (OpenAI/Anthropic/Llama)
  → Response returned to frontend
  → Response added to Zustand store (persisted)
  → UI displays response
```

#### 4. History Persistence

```
Each message saved in Zustand
  → Zustand "persist" middleware saves to localStorage
  → History separated by wallet address
  → On page reload, history automatically restored
  → User can clear history per wallet
```

---

## 💡 Use Cases

### For End Users

1. **Multi-Chain Portfolio Management**
   - View all assets in one place
   - Compare performance across chains
   - Identify diversification opportunities

2. **Intelligent Analysis with AI**
   - Ask "What is my best token?"
   - Get personalized recommendations
   - Analyze risk and diversification

3. **Export for Accounting**
   - Generate PDF reports for taxes
   - Export CSV for Excel analysis
   - Maintain historical records

4. **Real-Time Monitoring**
   - View 24h price changes
   - Track DeFi positions
   - Performance alerts

### For Developers

1. **Integration in Other Apps**
   - Use individual libraries (`wallet`, `data-hooks`)
   - Integrate AI Gateway in existing backends
   - Reuse UI components

2. **Feature Extension**
   - Add new LLM providers
   - Integrate new vector stores
   - Add support for new chains

3. **Data Analysis**
   - Access structured portfolio data
   - Create custom dashboards
   - Integrate with analytics tools

---

## ✨ Implementation Benefits

### Monorepo Architecture (Nx)

✅ **Modular Development**: Each library is independent and reusable  
✅ **Type Safety**: Shared TypeScript between frontend and backend  
✅ **Optimized Build**: Nx caches builds and only rebuilds what's necessary  
✅ **Centralized Testing**: Shared tests and unified configuration  
✅ **Scalability**: Easy to add new apps or libraries

### Separation of Concerns

✅ **Pure Frontend**: React focuses only on UI/UX  
✅ **Specialized Backend**: AI Gateway handles only AI logic  
✅ **Reusable Libraries**: Shared code without duplication  
✅ **Maintainability**: Isolated changes don't affect other parts

### Performance

✅ **Code Splitting**: Lazy loading of heavy components  
✅ **Intelligent Caching**: React Query reduces unnecessary requests  
✅ **Render Optimization**: React.memo and useMemo where needed  
✅ **Bundle Size**: Vite optimizes and tree-shakes unused code

### Developer Experience

✅ **Strict TypeScript**: Errors detected in development  
✅ **Hot Module Replacement**: Instant changes in development  
✅ **React Query DevTools**: Visual debugging of queries  
✅ **Swagger UI**: Interactive API documentation  
✅ **ESLint + Prettier**: Consistent and clean code

### User Experience

✅ **Modern UI**: Dark/light mode with smooth transitions  
✅ **Responsive**: Works on mobile, tablets, and desktop  
✅ **Persistence**: Chat history maintained between sessions  
✅ **Visual Feedback**: Loading states, skeletons, error handling  
✅ **Accessibility**: ARIA labels and keyboard navigation

### Security

✅ **Robust Validation**: Zod schemas in backend  
✅ **Protected API Keys**: Never exposed in frontend  
✅ **Type Safety**: Prevents runtime errors  
✅ **Error Handling**: Centralized error management

### Extensibility

✅ **Multiple LLM Providers**: Easy to add new ones (Gemini, etc.)  
✅ **Vector Stores**: Support for multiple vector databases  
✅ **New Chains**: Simple configuration to add blockchains  
✅ **Plugins**: Architecture allows custom plugins

---

## 🚀 Setup and Configuration

### Prerequisites

- **Node.js** 18+ and **pnpm** 9.0+
- **Zerion API Key** (get at https://zerion.io/)
- **WalletConnect Project ID** (optional, get at https://cloud.walletconnect.com/)
- **AI Provider API Keys** (at least one):
  - OpenAI API Key (https://platform.openai.com/)
  - Anthropic API Key (https://console.anthropic.com/)
  - Or local Llama server

### Installation

```bash
# Clone repository
git clone <repository-url>
cd web3-ai-copilot

# Install dependencies
pnpm install
```

### Frontend Configuration

Create `apps/web/.env.local`:

```env
# Zerion API (required)
VITE_ZERION_API_KEY=your_api_key_here

# WalletConnect (optional)
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id

# AI Gateway URL (default: http://localhost:3001)
VITE_AI_GATEWAY_URL=http://localhost:3001
```

### Backend Configuration

Create `apps/ai-gateway/.env`:

```env
# Server port (default: 3001)
PORT=3001

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# Anthropic (optional)
ANTHROPIC_API_KEY=sk-ant-...

# Llama (optional, for local models)
LLAMA_API_URL=http://localhost:8080
LLAMA_API_KEY=your_key

# Default provider
DEFAULT_AI_PROVIDER=openai

# Vector Store (optional, for RAG - future implementation)
SUPABASE_URL=...
SUPABASE_KEY=...
# or
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
```

### Run in Development

```bash
# Terminal 1: Frontend
pnpm dev
# Opens http://localhost:4200

# Terminal 2: Backend
pnpm dev:gateway
# API available at http://localhost:3001
# Swagger UI at http://localhost:3001/api-docs
```

---

## 📝 Development Commands

```bash
# Development
pnpm dev              # Frontend (apps/web) at http://localhost:4200
pnpm dev:gateway      # Backend (apps/ai-gateway) at http://localhost:3001

# Build
pnpm build            # Build all projects

# Linting
pnpm lint             # Lint specific project (requires name)
pnpm lint:all         # Lint all projects
pnpm lint:fix         # Lint and apply automatic fixes
pnpm lint:debug       # Lint with detailed output
pnpm lint:errors      # Show only errors
pnpm lint:summary     # Summary of errors by project

# Testing
pnpm test             # Run tests for all projects

# Formatting
pnpm format           # Format code with Prettier
pnpm format:check     # Check format without changing files
```

---

## 📖 Additional Documentation

### API Documentation

Once the backend is running, access:

- **Swagger UI**: http://localhost:3001/api-docs
- Interactive documentation of all endpoints
- Request and response examples
- Test endpoints directly from the browser

### Type Structure

All TypeScript types are exported from libraries:

```typescript
// Portfolio data types
import type {
  ContextPortfolioData,
  TokenItem,
  NftItem,
  DefiPosition,
} from '@web3-ai-copilot/data-hooks/types-only';

// AI types
import type { AIProvider, ChatResponse } from '@web3-ai-copilot/ai-config';
```

---

## 🔮 Roadmap and Future Improvements

### Short Term

- [ ] **Complete RAG implementation** - Full vector store integration with Supabase, Pinecone, Qdrant
- [ ] **Embeddings service** - OpenAI and alternative embedding providers
- [ ] **Document indexing pipeline** - Automated ingestion and chunking
- [ ] **Enhanced chart components** - Candlestick charts, volume indicators

### Medium Term

- [ ] **More chain support**: Solana, Avalanche, Cosmos
- [ ] **Custom alerts**: Price change notifications
- [ ] **Historical analysis**: Long-term performance charts
- [ ] **Portfolio comparison**: Compare multiple wallets
- [ ] **Advanced export**: More formats (JSON, Excel)

### Long Term

- [ ] **Offline mode**: Local cache for offline use
- [ ] **Multi-language**: i18n support for multiple languages
- [ ] **Mobile apps**: React Native versions
- [ ] **Analytics dashboard**: Advanced analytics and insights
- [ ] **Social features**: Share portfolios and analyses

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions are welcome. Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact and Support

For questions, issues, or suggestions, please open an issue in the repository.

---

**Developed with ❤️ for the Web3 community**
