import { Typography, LucideIcons } from '@e-burgos/tucu-ui';
import { IChatMessage } from '../../types';

interface ChatMessageProps {
  message: IChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
          <LucideIcons.Brain className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
        }`}
      >
        <div className="flex flex-col gap-1">
          <Typography tag="p" className=" whitespace-pre-wrap">
            {message.content}
          </Typography>
          {!isUser && (
            <div className="flex items-center gap-1 mt-1 opacity-60">
              <LucideIcons.Brain className="w-3 h-3" />
              <span className="text-xs">AI Assistant</span>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-md">
          <LucideIcons.User className="w-5 h-5 text-white" />
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
