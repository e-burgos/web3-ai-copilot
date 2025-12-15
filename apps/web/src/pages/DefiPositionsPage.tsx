import { PageLayout } from '../components/layout/PageLayout';
import { DefiPositionsTable } from '../components/defi/DefiPositionsTable';

function DefiPositionsPage() {
  return (
    <PageLayout title="DeFi Positions">
      <DefiPositionsTable />
    </PageLayout>
  );
}

export default DefiPositionsPage;
