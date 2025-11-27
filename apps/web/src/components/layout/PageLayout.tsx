import { Typography } from '@e-burgos/tucu-ui';
import { AICopilotSidebar } from '../ai-chat/AICopilotSidebar';
import { AICopilotChatButton } from '../ai-chat/AICopilotChatButton';

interface PageLayoutProps {
  title: string;
  rightButton?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ title, rightButton, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen px-8 pt-8 pb-12">
      <section className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
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
