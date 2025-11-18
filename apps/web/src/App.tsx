import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@web3-ai-copilot/wallet';
import { useThemeStore } from '@web3-ai-copilot/app-state';
import { WalletConnect } from './components/WalletConnect';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { AICopilotSidebar } from './components/AICopilotSidebar';
import { NftViewer } from './components/NftViewer';
import { DefiPositions } from './components/DefiPositions';
import { ExportButton } from './components/ExportButton';
import { ThemeToggle } from '@web3-ai-copilot/ui-components';
import { useEffect } from 'react';

function AppContent() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Web3 AI Copilot</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <ExportButton />
        </div>
        <PortfolioDashboard />
        <NftViewer />
        <DefiPositions />
      </main>

      <AICopilotSidebar />
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <AppContent />
    </WagmiProvider>
  );
}

export default App;

