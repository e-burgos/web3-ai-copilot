import { useTheme, InputSwitch, LucideIcons } from '@e-burgos/tucu-ui';

export function ThemeToggle() {
  const { setMode, mode } = useTheme();

  return (
    <InputSwitch
      offLabel={(<LucideIcons.Sun className="w-4 h-4" />) as unknown as string}
      onLabel={(<LucideIcons.Moon className="w-4 h-4" />) as unknown as string}
      checked={mode === 'dark'}
      onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
    />
  );
}
