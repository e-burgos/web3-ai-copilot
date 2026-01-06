import { useState } from 'react';
import { Typography, LucideIcons } from '@e-burgos/tucu-ui';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { IChatMessage } from '../../types';

interface ChatMessageProps {
  message: IChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const markdownComponents: Partial<Components> = {
    // Custom image component to handle base64 images
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || 'Image'}
        className="max-w-full h-auto rounded-lg my-2"
        style={{ maxHeight: '400px' }}
      />
    ),
    // Custom code block component
    code: (props) => {
      const { className, children, ...rest } = props;
      const isInline = !className?.includes('language-');
      return isInline ? (
        <code
          className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded text-sm"
          {...rest}
        >
          {children}
        </code>
      ) : (
        <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto my-2 max-w-full break-words whitespace-pre-wrap">
          <code className={className} {...rest}>
            {children}
          </code>
        </pre>
      );
    },
    // Custom paragraph component
    p: ({ children, ...props }) => (
      <p className="mb-2 last:mb-0" {...props}>
        {children}
      </p>
    ),
    // Custom heading components
    h1: ({ children, ...props }) => (
      <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-xl font-bold mb-2 mt-4 first:mt-0" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-lg font-bold mb-2 mt-4 first:mt-0" {...props}>
        {children}
      </h3>
    ),
    // Custom list components
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside mb-2 space-y-1" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside mb-2 space-y-1" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="ml-4" {...props}>
        {children}
      </li>
    ),
    // Custom link component
    a: ({ children, ...props }) => (
      <a
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    // Custom blockquote component
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2"
        {...props}
      >
        {children}
      </blockquote>
    ),
    // Custom table components
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-2 max-w-full w-full">
        <table
          className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 w-full"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-700 font-bold"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="border border-gray-300 dark:border-gray-600 px-4 py-2"
        {...props}
      >
        {children}
      </td>
    ),
    // Custom horizontal rule
    hr: ({ ...props }) => (
      <hr className="my-4 border-gray-300 dark:border-gray-600" {...props} />
    ),
  };

  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
          <LucideIcons.Brain className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[75%] min-w-0 rounded-2xl px-4 py-3 shadow-sm relative group ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
        }`}
      >
        <div className="flex flex-col gap-1 min-w-0 w-full">
          {isUser ? (
            <Typography
              tag="p"
              className="whitespace-pre-wrap break-words overflow-wrap-anywhere min-w-0"
            >
              {message.content}
            </Typography>
          ) : (
            <div className="markdown-content break-words overflow-wrap-anywhere min-w-0 w-full">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          {!isUser && (
            <div className="flex items-center gap-1 mt-1 opacity-60">
              <LucideIcons.Brain className="w-3 h-3" />
              <span className="text-xs">AI Assistant</span>
            </div>
          )}
        </div>
        {/* Copy button - appears on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className={`h-7 w-7 p-0 rounded-md flex items-center justify-center transition-colors ${
              isUser
                ? 'text-white hover:bg-white/20'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={isCopied ? 'Copied!' : 'Copy message'}
            type="button"
          >
            {isCopied ? (
              <LucideIcons.Check className="w-4 h-4 text-green-500" />
            ) : (
              <LucideIcons.Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-md">
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
        .markdown-content {
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .markdown-content pre {
          font-size: 0.875rem;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }
        .markdown-content code {
          font-family: 'Courier New', Courier, monospace;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .markdown-content p {
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .markdown-content a {
          word-break: break-all;
        }
        .markdown-content table {
          width: 100%;
          table-layout: auto;
        }
        .markdown-content table td,
        .markdown-content table th {
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
