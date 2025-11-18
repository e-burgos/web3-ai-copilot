import { useWallet } from '@web3-ai-copilot/wallet';
import { Button } from '@web3-ai-copilot/ui-components';
import { formatAddress } from '@web3-ai-copilot/shared-utils';

export function WalletConnect() {
  const { address, isConnected, connectors, isPending, connectWallet, disconnectWallet } =
    useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{formatAddress(address)}</span>
        <Button variant="secondary" size="sm" onClick={disconnectWallet}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          variant="primary"
          size="sm"
          onClick={() => connectWallet(connector.id)}
          disabled={isPending}
        >
          {isPending ? 'Connecting...' : `Connect ${connector.name}`}
        </Button>
      ))}
    </div>
  );
}

