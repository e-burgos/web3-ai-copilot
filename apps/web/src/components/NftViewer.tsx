import { useNftData } from '@web3-ai-copilot/data-hooks';
import { Skeleton } from '@web3-ai-copilot/ui-components';
import { CardContainer, LucideIcons, Typography } from '@e-burgos/tucu-ui';

export function NftViewer() {
  const { data: nfts, isLoading } = useNftData();

  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (!nfts || nfts?.length === 0) {
    return (
      <CardContainer>
        <div className="flex w-full flex-col items-center justify-center text-center gap-2 py-4">
          <LucideIcons.PictureInPicture2Icon className="w-16 h-16 text-muted-foreground mb-2" />
          <Typography tag="h4" className="text-muted-foreground">
            No NFTs found
          </Typography>
        </div>
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <Typography tag="h3" className="text-xl font-semibold mb-4">
        NFTs
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="border border-border rounded-lg overflow-hidden"
          >
            {nft.image && (
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENFT%3C/text%3E%3C/svg%3E';
                }}
              />
            )}
            <div className="p-4">
              <h4 className="font-medium truncate">{nft.name}</h4>
              <p className="text-sm text-muted-foreground">{nft.collection}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContainer>
  );
}
