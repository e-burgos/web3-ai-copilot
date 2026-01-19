import { useChainId, useSwitchChain } from 'wagmi';
import { supportedChains, chainNames } from '@web3-ai-copilot/wallet';
import { Select, SelectOption } from '@e-burgos/tucu-ui';

export function ChainSelector() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const handleChainSelect = (selectedChain: SelectOption) => {
    if (selectedChain.value !== chainId.toString() && switchChain) {
      switchChain({ chainId: Number(selectedChain.value) });
    }
  };

  return (
    <Select
      options={supportedChains.map((chain) => ({
        name: chainNames[chain.id] || chain.name,
        value: chain.id.toString(),
      }))}
      value={chainId?.toString()}
      onChange={(value: SelectOption) => handleChainSelect(value)}
      className="min-w-[120px]"
      placeholder="Select a chain"
      disabled={isPending}
      variant="ghost"
    />
  );
}
