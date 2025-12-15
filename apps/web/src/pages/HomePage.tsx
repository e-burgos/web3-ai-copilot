import { Dashboard } from '../components/dashboard';
import { ExportButton } from '@web3-ai-copilot/export-services';
import { PageLayout } from '../components/layout/PageLayout';

function HomePage() {
  return (
    <PageLayout title="Dashboard" rightButton={<ExportButton />}>
      <Dashboard />
    </PageLayout>
  );
}

export default HomePage;
