import { Modal } from '@e-burgos/tucu-ui';
import { NftItem } from '@web3-ai-copilot/data-hooks';
import { formatCurrency } from '@web3-ai-copilot/shared-utils';

const NftInfoModal = ({
  open,
  onClose,
  nft,
}: {
  open: boolean;
  onClose: () => void;
  nft: NftItem | null;
}) => {
  if (!nft) {
    return null;
  }

  return (
    <Modal
      isOpen={open}
      setIsOpen={onClose}
      closeable
      hideButtons={true}
      buttonContainer={null}
      className="w-full max-w-2xl"
      text={{
        title: nft.name,
      }}
    >
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">NFT: {nft.name}</h1>
            <p className="text-sm text-muted-foreground">
              Collection: {nft.collection}
            </p>
          </div>
          <div className="flex flex-col justify-start items-start border border-border rounded-lg p-2 min-w-20">
            <h2 className="text-sm font-bold">Current Price</h2>
            <p className="text-2xl font-bold text-brand">
              {formatCurrency(nft.value || 0, 'USD')}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Description</h2>
          <p className="text-sm text-muted-foreground">{nft.description}</p>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover rounded-xl shadow-lg p-2 bg-dark dark:bg-light max-w-[calc(100%-2rem)] mx-auto"
          />
        </div>
      </div>
    </Modal>
  );
};

export default NftInfoModal;
