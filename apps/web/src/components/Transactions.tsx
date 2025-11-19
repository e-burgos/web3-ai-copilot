import { Card, Skeleton } from '@web3-ai-copilot/ui-components';
import { useTransactionData } from '@web3-ai-copilot/data-hooks';

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
    <div className="space-y-6">
      <Card className="p-4 rounded-xl shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Transactions</h3>
        <table className="w-full min-w-full border-collapse border-spacing-0 border border-border/50 p-4 rounded-xl">
          <thead className="border-b border-border">
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
          <tbody className="border-t border-border/50">
            {transactions.data.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b hover:bg-muted/50 transition-colors px-4 py-2"
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
                  {transaction.attributes.transfers.map((transfer) => transfer.value).join(', ')}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {transaction.attributes.transfers.map((transfer) => transfer.price).join(', ')}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">{transaction.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
