import { Card, Skeleton } from '@web3-ai-copilot/ui-components';
import { useTransactionData } from '@web3-ai-copilot/data-hooks';
import { CardContainer } from '@e-burgos/tucu-ui';

export function Transactions() {
  const { data: transactions, isLoading } = useTransactionData();

  if (isLoading) {
    return (
      <Card>
        <Skeleton variant="rectangular" className="h-32" />
      </Card>
    );
  }

  if (!transactions) {
    return null;
  }

  return (
    <CardContainer className="p-4 rounded-xl shadow-lg overflow-x-auto">
      <table className="w-full min-w-full border-collapse border-spacing-0 border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
        <thead className="border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th className="min-w-48 text-left px-4 py-2">Operation Type</th>
            <th className="min-w-48 text-left px-4 py-2">Mined At</th>
            <th className="min-w-48 text-left px-4 py-2">Sent From</th>
            <th className="min-w-48 text-left px-4 py-2">Sent To</th>
            <th className="min-w-48 text-left px-4 py-2">Fee</th>
            <th className="min-w-48 text-left px-4 py-2">Transfers</th>
            <th className="min-w-48 text-left px-4 py-2">Quantities</th>
            <th className="min-w-48 text-left px-4 py-2">Values</th>
            <th className="min-w-48 text-left px-4 py-2">Prices</th>
            <th className="min-w-48 text-left px-4 py-2">Hash</th>
          </tr>
        </thead>
        <tbody className="border-t border-gray-200 dark:border-gray-800">
          {transactions.data.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors px-4 py-2"
            >
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.attributes.operation_type}
              </td>
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.attributes.mined_at}
              </td>
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.attributes.sent_from}
              </td>
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.attributes.sent_to}
              </td>
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.attributes.fee?.value}
              </td>
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.attributes.transfers
                  .map((transfer) => transfer.fungible_info?.name)
                  .join(', ')}
              </td>
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.attributes.transfers
                  .map((transfer) => transfer.quantity.numeric)
                  .join(', ')}
              </td>
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.attributes.transfers
                  .map((transfer) => transfer.value)
                  .join(', ')}
              </td>
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.attributes.transfers
                  .map((transfer) => transfer.price)
                  .join(', ')}
              </td>
              <td className="px-4 py-2 text-sm text-muted-foreground">
                {transaction.id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContainer>
  );
}
