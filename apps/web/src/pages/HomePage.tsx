import { PortfolioDashboard } from '../components/PortfolioDashboard';
import { NftViewer } from '../components/NftViewer';
import { DefiPositions } from '../components/DefiPositions';
import { ExportButton } from '../components/ExportButton';
import { PageLayout } from '../components/layout/PageLayout';

function HomePage() {
  return (
    <PageLayout title="Dashboard" rightButton={<ExportButton />}>
      <PortfolioDashboard />
      <NftViewer />
      <DefiPositions />
    </PageLayout>
  );
}

export default HomePage;
