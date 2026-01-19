import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@web3-ai-copilot/wallet';
import { LAYOUT_OPTIONS, ThemeProvider } from '@e-burgos/tucu-ui';
import { useRouterConfig } from './router/RouterConfig';
import { AppLogo } from './components/header/AppLogo';
import { RightHeaderContent } from './components/header/RightHeaderContent';

function App() {
  const routerConfig = useRouterConfig();
  return (
    <WagmiProvider config={wagmiConfig}>
      <ThemeProvider
        layout={LAYOUT_OPTIONS.ADMIN}
        isAuthenticated={true}
        logo={{
          name: 'Web3',
          secondName: 'AICopilot',
          logo: <AppLogo className="w-12 h-12" />,
        }}
        rightButton={<RightHeaderContent />}
        menuItems={routerConfig}
        contentClassName="!m-0 !p-0"
      />
    </WagmiProvider>
  );
}

export default App;
