import { useChainId, useSwitchChain } from 'wagmi';
import { supportedChains, chainNames } from '@web3-ai-copilot/wallet';
import { InputSelect, InputSelectOption } from '@e-burgos/tucu-ui';

export function ChainSelector() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const handleChainSelect = (selectedChain: InputSelectOption) => {
    if (selectedChain.value !== chainId.toString() && switchChain) {
      switchChain({ chainId: Number(selectedChain.value) });
    }
  };

  return (
    <InputSelect
      options={supportedChains.map((chain) => ({
        name: chainNames[chain.id] || chain.name,
        value: chain.id.toString(),
      }))}
      value={chainId?.toString()}
      onChange={(value: InputSelectOption) => handleChainSelect(value)}
      className="min-w-[120px]"
      placeholder="Select a chain"
      disabled={isPending}
      variant="ghost"
    />
  );
}
