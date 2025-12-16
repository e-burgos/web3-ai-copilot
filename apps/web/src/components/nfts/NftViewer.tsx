import { useAllNftsData, NFTSortType } from '@web3-ai-copilot/data-hooks';
import {
  Button,
  CardContainer,
  LucideIcons,
  Typography,
} from '@e-burgos/tucu-ui';
import { Skeleton } from '../common/Skeleton';
import { useMemo, useState } from 'react';
import { formatCurrency } from '@web3-ai-copilot/shared-utils';
import { useNftStore } from '../../store/useNtfStore';
import { NftSortFilter } from './NftSortFilter';

export function NftViewer() {
  const { setNft, setOpenNftInfoModal } = useNftStore();

  const [sort, setSort] = useState<NFTSortType>('floor_price');
  const [hoveredNft, setHoveredNft] = useState<{
    id: string;
    isHovered: boolean;
  }>({ id: '', isHovered: false });

  const {
    data: nfts,
    isLoading,
    refetch,
  } = useAllNftsData({
    sort,
  });

  const nftsData = useMemo(() => nfts?.data, [nfts]);

  return (
    <CardContainer className="flex flex-col w-full space-y-2 p-4 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center pb-4 w-full">
        <Typography tag="h3" className="text-xl font-semibold w-full">
          NFTs Gallery
        </Typography>
        <div className="flex items-center gap-2 w-full justify-end">
          <NftSortFilter sort={sort} setSort={setSort} />
          <Button
            variant="solid"
            shape="circle"
            size="tiny"
            onClick={() => refetch()}
          >
            <LucideIcons.RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" className="h-64" />
          ))}
        </div>
      )}

      {!isLoading && nftsData && nftsData.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <Typography tag="h4" className="text-muted-foreground">
            No NFTs found
          </Typography>
        </div>
      )}

      {!isLoading && nftsData && nftsData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nftsData.map((nft) => (
            <div
              key={nft.id}
              className={`border border-border rounded-lg overflow-hidden ${hoveredNft.id === nft.id && hoveredNft.isHovered ? 'border-2 shadow-lg border-brand' : ''} transition-all duration-300`}
              onMouseEnter={() => {
                setHoveredNft({ id: nft.id, isHovered: true });
              }}
              onMouseLeave={() => {
                setHoveredNft({ id: nft.id, isHovered: false });
              }}
              onClick={() => {
                setNft(nft);
                setOpenNftInfoModal(true);
              }}
            >
              {(nft.image || nft.previewImage) && (
                <img
                  src={nft.image || nft.previewImage}
                  alt={nft.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENFT%3C/text%3E%3C/svg%3E';
                  }}
                />
              )}
              <div className="p-4">
                <h4 className="font-medium truncate flex items-center justify-between gap-2">
                  {nft.name}{' '}
                  <span className="text-sm text-muted-foreground">
                    ({formatCurrency(nft.price || 0)})
                  </span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  {nft.collection}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContainer>
  );
}
