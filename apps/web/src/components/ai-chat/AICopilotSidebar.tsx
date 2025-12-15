import { useState, useRef, useEffect } from 'react';
import { useContextPortfolioData } from '@web3-ai-copilot/data-hooks';
import { useWallet } from '@web3-ai-copilot/wallet';
import { ChatMessage } from './ChatMessage';
import { IChatMessage } from '../../types';
import { useSendAiMessageMutation } from '../../queries/useAiGateway';
import { userChatStore } from '../../store/userChatStore';
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
  const {
    chatOpen,
    setChatOpen,
    getMessages,
    addMessage,
    clearHistory,
    setCurrentWalletAddress,
    currentWalletAddress,
  } = userChatStore();
  const { address } = useWallet();
  const { data: portfolioData } = useContextPortfolioData();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get messages from store for current wallet
  const messages = getMessages(address);

  // Update current wallet address when it changes
  useEffect(() => {
    if (address !== currentWalletAddress) {
      setCurrentWalletAddress(address ?? null);
    }
  }, [address, currentWalletAddress, setCurrentWalletAddress]);

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
    addMessage(userMessage, address);
    setInput('');
    try {
      const assistantMessage = await sendAiMessage({
        messages: [...messages, userMessage],
        portfolioData: portfolioData || null,
      });
      addMessage(assistantMessage, address);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: IChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      addMessage(errorMessage, address);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      clearHistory(address);
    }
  };

  return (
    <Drawer
      title="AI Copilot"
      isOpen={chatOpen}
      setIsOpen={setChatOpen}
      type={'sidebar'}
      position="right"
      className="relative w-full md:w-[450px]!"
    >
      {messages.length > 0 && (
        <div className="fixed top-[32px] right-[60px] z-10">
          <Button
            tooltip="Clear chat history"
            variant="ghost"
            shape="pill"
            size="mini"
            onClick={handleClearHistory}
            className="text-xs"
          >
            <div className="flex items-center gap-2">
              <LucideIcons.Trash2 className="w-4 h-4" />
              <span className="text-xs">Clear history</span>
            </div>
          </Button>
        </div>
      )}
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
