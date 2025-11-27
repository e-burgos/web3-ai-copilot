import { useState, useRef, useEffect } from 'react';
import { useUIStore } from '@web3-ai-copilot/app-state';
import { useCombinedPortfolioData } from '@web3-ai-copilot/data-hooks';
import { ChatMessage } from './ChatMessage';
import { IChatMessage } from '../../types';
import { useSendAiMessageMutation } from '../../queries/useAiGateway';
import {
  Drawer,
  Typography,
  Button,
  Input,
  LucideIcons,
  Loader,
} from '@e-burgos/tucu-ui';

export function AICopilotSidebar() {
  const { mutateAsync: sendAiMessage, isPending: isLoading } =
    useSendAiMessageMutation();
  const { chatOpen, setChatOpen } = useUIStore();
  const { data: portfolioData } = useCombinedPortfolioData();
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage: IChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    try {
      const assistantMessage = await sendAiMessage({
        messages: [...messages, userMessage],
        portfolioData,
      });
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: IChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <Drawer
      title="AI Copilot"
      isOpen={chatOpen}
      setIsOpen={setChatOpen}
      type={'sidebar'}
      position="right"
      className="relative w-full md:!w-[450px]"
    >
      <div className="flex-1  space-y-4 mb-12">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Typography tag="h3">
              Ask me anything about your portfolio!
            </Typography>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div className="text-muted-foreground flex items-center justify-center my-12">
            <Loader />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-light-dark">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="w-full"
          />
          <Button
            shape="circle"
            variant="transparent"
            size="medium"
            onClick={handleSend}
            disabled={isLoading}
            className="w-12 h-12"
          >
            <LucideIcons.SendHorizonal />
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
