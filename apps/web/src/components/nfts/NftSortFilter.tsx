import { useMemo } from 'react';
import { NFTSortType } from '@web3-ai-copilot/data-hooks';
import { InputSelect, InputSelectOption } from '@e-burgos/tucu-ui';

const SORT_OPTIONS = [
  { name: 'Lowest Price', value: 'floor_price' },
  { name: 'Highest Price', value: '-floor_price' },
  { name: 'Oldest', value: 'created_at' },
  { name: 'Newest', value: '-created_at' },
];

interface NftSortFilterProps {
  sort: NFTSortType;
  setSort: (sort: NFTSortType) => void;
}

export function NftSortFilter({ sort, setSort }: NftSortFilterProps) {
  const validSort = useMemo(() => {
    const isValid = SORT_OPTIONS.some((opt) => opt.value === sort);
    return isValid ? sort : 'floor_price';
  }, [sort]);

  return (
    <InputSelect
      options={SORT_OPTIONS}
      value={validSort}
      className="w-full md:w-40! min-w-40!"
      onChange={(value: InputSelectOption) => {
        if (!value.value) return;
        setSort(value.value as NFTSortType);
      }}
      placeholder="Sort by"
    />
  );
}
