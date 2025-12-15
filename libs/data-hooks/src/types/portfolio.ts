export interface Portfolio {
  type: string;
  id: string;
  attributes: {
    positions_distribution_by_type: {
      wallet: number;
      deposited: number;
      borrowed: number;
      locked: number;
      staked: number;
    };
    positions_distribution_by_chain: {
      [key: string]: number;
    };
    total: {
      positions: number;
    };
    changes: {
      absolute_1d: number;
      percent_1d: number;
    };
  };
}

export type PortfolioDataResponse = {
  data: Portfolio['attributes'];
};
