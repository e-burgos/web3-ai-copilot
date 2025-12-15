import { ThemeToggle } from './ThemeToggle';
import { useWallet } from '@web3-ai-copilot/wallet';
import { formatAddress } from '@web3-ai-copilot/shared-utils';
import { LucideIcons, Button } from '@e-burgos/tucu-ui';
import { useState, useRef, useEffect } from 'react';
import { ChainSelector } from './ChainSelector';

export const WalletConnected = () => {
  const { address, disconnectWallet } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const copyToClipboard = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative" ref={dropdownRef}>
        <Button
          size="small"
          variant="ghost"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-4!"
        >
          <div className="flex items-center gap-1">
            <LucideIcons.User className="w-4 h-4" />
            <span className="hidden sm:block md:block lg:block">
              {formatAddress(address || '')}
            </span>
            <LucideIcons.ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white dark:bg-light-dark border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slide-down">
            {/* Address Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Wallet Address
              </p>
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors group"
              >
                <span className="text-sm font-mono text-foreground truncate">
                  {address || ''}
                </span>
                <div className="shrink-0">
                  {isCopied ? (
                    <LucideIcons.Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <LucideIcons.Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
              </button>
              {isCopied && (
                <p className="text-xs text-green-500 mt-1 text-center animate-fade-in">
                  Copied to clipboard!
                </p>
              )}
            </div>

            {/* Chain Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LucideIcons.Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Chain
                  </span>
                </div>
                <ChainSelector />
              </div>
            </div>

            {/* Theme Toggle Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LucideIcons.Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Theme
                  </span>
                </div>
                <ThemeToggle />
              </div>
            </div>

            {/* Disconnect Button */}
            <div className="p-3">
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors group"
              >
                <LucideIcons.LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Disconnect Wallet</span>
              </button>
            </div>
          </div>
        )}
      </div>

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
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-slide-down {
            animation: slide-down 0.2s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
        `}</style>
    </div>
  );
};
