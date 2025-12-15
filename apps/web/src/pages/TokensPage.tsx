import { PageLayout } from '../components/layout/PageLayout';
import { TokenTable } from '../components/tokens/TokenTable';

function TokensPage() {
  return (
    <PageLayout title="Tokens">
      <TokenTable />
    </PageLayout>
  );
}

export default TokensPage;
