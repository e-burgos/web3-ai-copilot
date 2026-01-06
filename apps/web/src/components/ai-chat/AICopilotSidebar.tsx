import { useState, useRef, useEffect } from 'react';
import { useContextPortfolioData } from '@web3-ai-copilot/data-hooks';
import { useWallet } from '@web3-ai-copilot/wallet';
import { ChatMessage } from './ChatMessage';
import { ModelSelectorModal } from './ModelSelectorModal';
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
  useTheme,
  Badge,
} from '@e-burgos/tucu-ui';

export function AICopilotSidebar() {
  const { mode } = useTheme();
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
    model,
    provider,
    setModelModalOpen,
    modelModalOpen,
  } = userChatStore();
  const { address } = useWallet();
  const { data: portfolioData } = useContextPortfolioData();
  const [input, setInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        model: model,
        provider: provider,
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

  const handleInputContainerTouch = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Close drawer when model modal opens to avoid visual conflicts
  useEffect(() => {
    if (modelModalOpen) {
      setChatOpen(false);
    }
  }, [modelModalOpen, setChatOpen]);

  return (
    <>
      <Drawer
        title="AI Copilot"
        isOpen={chatOpen}
        setIsOpen={setChatOpen}
        type={'sidebar'}
        position="right"
        className={`relative transition-all duration-300 ${
          isFullscreen
            ? 'w-screen! h-screen! max-w-screen! fixed! inset-0! z-[9999]!'
            : 'w-full lg:w-[450px]!'
        }`}
      >
        {messages.length > 0 && (
          <div className="fixed flex items-center justify-center top-[32px] right-[70px] z-10">
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
            <Button
              tooltip={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              variant="ghost"
              shape="circle"
              size="mini"
              className="ml-1 text-xs"
              onClick={handleToggleFullscreen}
            >
              {isFullscreen ? (
                <LucideIcons.Minimize className="w-4 h-4" />
              ) : (
                <LucideIcons.Maximize className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
        <div className="flex-1 space-y-4 mb-20">
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

        <div
          className="absolute flex flex-col gap-2 z-10 bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-light-dark"
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="flex items-center justify-center gap-2"
            onTouchStart={handleInputContainerTouch}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              inputClassName={`${mode === 'dark' ? 'text-gray-200!' : 'text-gray-800!'}`}
              className={`w-full ${mode === 'dark' ? 'text-gray-200!' : 'text-gray-800!'}`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
            />
            <Button
              shape="circle"
              variant="transparent"
              size="medium"
              onClick={handleSend}
              onTouchStart={handleSend}
              disabled={isLoading}
              className="w-12 h-12 border border-gray-200 dark:border-gray-700 rounded-lg mt-1"
            >
              <LucideIcons.SendHorizonal />
            </Button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {provider && (
              <Badge
                className="cursor-pointer w-full rounded-md text-xs flex items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                size="sm"
                onClick={() => setModelModalOpen(true)}
                onTouchStart={() => setModelModalOpen(true)}
              >
                {`Provider: ${provider.toUpperCase()} ${model ? '/ Model:' : ''} ${model}`}
              </Badge>
            )}
          </div>
        </div>
      </Drawer>
      <ModelSelectorModal />
    </>
  );
}
