import { Typography } from '@e-burgos/tucu-ui';
import { AICopilotSidebar } from '../ai-chat/AICopilotSidebar';
import { AICopilotChatButton } from '../ai-chat/AICopilotChatButton';
import { useWallet } from '@web3-ai-copilot/wallet';
import { AppLogo } from '../header/AppLogo';

interface PageLayoutProps {
  title: string;
  rightButton?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ title, rightButton, children }: PageLayoutProps) {
  const { isConnected } = useWallet();

  if (!isConnected)
    return (
      <div className="flex items-center flex-col justify-center min-h-[calc(100vh-80px)] px-8 pt-8 pb-12">
        <AppLogo className="w-64 h-64 mb-4" />
        <Typography tag="h3" className=" font-bold text-center">
          Please connect your wallet to access this page
        </Typography>
      </div>
    );

  return (
    <div className="min-h-dvh md:min-h-[calc(100vh-80px)] px-8 pt-8 pb-[25dvh] md:pb-12">
      <section className="container mx-auto space-y-6">
        <div className="flex items-center flex-col md:flex-row justify-between gap-4">
          <Typography tag="h2" className="text-3xl font-bold">
            {title}
          </Typography>
          {rightButton}
        </div>
        {children}
      </section>
      <AICopilotSidebar />
      <AICopilotChatButton />
    </div>
  );
}

export default PageLayout;
