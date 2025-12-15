import { IRowActions } from '@e-burgos/tucutable';
import { NftItem } from '@web3-ai-copilot/data-hooks';
import { useNftStore } from '../../store/useNtfStore';
import { useMemo } from 'react';

export const useNftTableActions = () => {
  const { setNft, setOpenNftInfoModal } = useNftStore();

  const rowActions: IRowActions<NftItem>[] = useMemo(
    () => [
      {
        action: 'view',
        label: (_row) => 'Details',
        onClick: (row) => {
          setOpenNftInfoModal(true);
          setNft(row.original);
        },
      },
    ],
    []
  );

  return { rowActions };
};
