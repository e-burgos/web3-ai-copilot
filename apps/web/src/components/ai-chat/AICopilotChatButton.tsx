import { LucideIcons } from '@e-burgos/tucu-ui';
import { userChatStore } from '../../store/userChatStore';

export function AICopilotChatButton() {
  const { setChatOpen } = userChatStore();

  return (
    <button
      onClick={() => setChatOpen(true)}
      className="fixed flex items-center justify-center bottom-6 right-6 rounded-full shadow-lg bg-brand p-2 w-12 h-12 hover:w-14 hover:h-14 transition-all duration-300 ease-in-out"
    >
      <LucideIcons.Brain className="w-6 h-6 text-white" />
    </button>
  );
}
