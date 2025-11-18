import { useThemeStore } from '@web3-ai-copilot/app-state';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </Button>
  );
}

