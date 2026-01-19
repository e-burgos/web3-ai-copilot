import { Switch, LucideIcons } from '@e-burgos/tucu-ui';
import { PageLayout } from '../components/layout/PageLayout';
import { NftViewer } from '../components/nfts/NftViewer';
import { NftTable } from '../components/nfts/NftTable';
import NftInfoModal from '../components/nfts/NftInfoModal';
import { useNftStore } from '../store/useNtfStore';

function NFTsPage() {
  const {
    openNftInfoModal,
    switchView,
    nft,
    setSwitchView,
    setOpenNftInfoModal,
  } = useNftStore();
  return (
    <PageLayout
      title="NFTs"
      rightButton={
        <Switch
          label={switchView === 'gallery' ? 'Gallery View' : 'Table View'}
          offLabel={
            (<LucideIcons.Table className="w-4 h-4" />) as unknown as string
          }
          onLabel={
            (<LucideIcons.Grid className="w-4 h-4" />) as unknown as string
          }
          checked={switchView === 'gallery'}
          onChange={(e) => setSwitchView(e ? 'gallery' : 'table')}
        />
      }
    >
      {switchView === 'gallery' ? <NftViewer /> : <NftTable />}
      <NftInfoModal
        open={openNftInfoModal}
        onClose={() => setOpenNftInfoModal(false)}
        nft={nft || null}
      />
    </PageLayout>
  );
}

export default NFTsPage;
