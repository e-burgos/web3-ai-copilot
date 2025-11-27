import { ThemeToggle } from './ThemeToggle';
import { WalletConnect } from './WalletConnect';

export const RightHeaderContent = () => {
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <WalletConnect />
    </div>
  );
};
