import { Transaction } from 'zerion-sdk-ts';
import { TransactionItem } from '../types/transactions';

export const transactionsMapper = (
  transactions: Transaction[]
): TransactionItem[] => {
  if (!transactions || !Array.isArray(transactions)) {
    return [];
  }

  return transactions.map((transaction: Transaction) => ({
    id: transaction.id,
    hash: transaction.attributes.hash,
    operation_type: transaction.attributes.operation_type,
    mined_at: transaction.attributes.mined_at,
    sent_from: transaction.attributes.sent_from,
    sent_to: transaction.attributes.sent_to,
    fee:
      (transaction.attributes.fee as unknown as { value: number })?.value || 0,
    transfers: (transaction.attributes.transfers || []).map((transfer) => ({
      fungible_info: transfer.fungible_info,
      quantity: transfer.quantity.numeric,
      value: transfer.value,
      price: transfer.price,
    })),
  }));
};
