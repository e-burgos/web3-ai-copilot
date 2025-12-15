import { PageLayout } from '../components/layout/PageLayout';
import { TransactionsTable } from '../components/transactions/TransactionsTable';

function TransactionsPage() {
  return (
    <PageLayout title="Transactions">
      <TransactionsTable />
    </PageLayout>
  );
}

export default TransactionsPage;
