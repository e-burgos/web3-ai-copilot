import { useWallet } from '@web3-ai-copilot/wallet';
import { Button, LucideIcons, Typography } from '@e-burgos/tucu-ui';
import { ThemeToggle } from './ThemeToggle';
import { WalletWalletConnect, WalletMetamask } from '@web3icons/react';
import { useState, useRef, useEffect } from 'react';

export function WalletDisconnected() {
  const { connectors, isPending, connectWallet } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredConnectors = connectors.filter(
    (connector) => connector.id !== 'injected'
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConnect = async (connectorId: string) => {
    await connectWallet(connectorId);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="hidden sm:block md:block">
        <ThemeToggle />
      </span>

      <div className="relative" ref={dropdownRef}>
        <Button
          size="small"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
          className="!px-4"
        >
          <div className="flex items-center gap-2">
            {isPending ? (
              <>
                <LucideIcons.Loader2 className="animate-spin h-4 w-4" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <LucideIcons.Wallet className="w-4 h-4" />
                <span className="hidden sm:block md:block">Connect Wallet</span>
                <LucideIcons.ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </div>
        </Button>

        {isOpen && !isPending && (
          <div className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg bg-white dark:bg-light-dark border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slide-down">
            {/* Header */}
            <div className="p-4 bg-muted border-b border-gray-200 dark:border-gray-700">
              <Typography
                tag="h4"
                className="text-sm font-semibold text-foreground"
              >
                Connect Your Wallet
              </Typography>
              <Typography
                tag="p"
                className="text-xs text-muted-foreground mt-1"
              >
                Choose your preferred wallet to continue
              </Typography>
            </div>

            {/* Wallet Options */}
            <div className="py-2 max-h-80 overflow-y-auto">
              {filteredConnectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-muted transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    {connector.name === 'MetaMask' ? (
                      <WalletMetamask />
                    ) : (
                      <WalletWalletConnect variant="mono" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Typography
                      tag="p"
                      className="text-sm font-medium text-foreground group-hover:text-primary transition-colors"
                    >
                      {connector.name}
                    </Typography>
                    <Typography
                      tag="p"
                      className="text-xs text-muted-foreground"
                    >
                      Connect with {connector.name}
                    </Typography>
                  </div>
                  <LucideIcons.ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-muted border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-2">
                <LucideIcons.Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <Typography tag="p" className="text-xs text-muted-foreground">
                    New to Web3?{' '}
                    <a
                      href="https://ethereum.org/en/wallets/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Learn more about wallets
                    </a>
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slide-down {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-down {
            animation: slide-down 0.2s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
