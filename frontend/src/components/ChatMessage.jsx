import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { parseMessage } from '../utils/messageUtils';

export const ChatMessage = ({ message }) => {
  if (message.role === 'assistant' && message.content.includes('<think>')) {
    const { reasoning, answer } = parseMessage(message.content);
    return (
      <div className="flex justify-start">
        <div className="max-w-[70%] rounded-lg p-4 shadow-sm bg-gray-200 text-gray-800">
          {reasoning && (
            <details className="mb-2 border rounded p-2 bg-gray-100">
              <summary className="cursor-pointer font-bold">Show reasoning</summary>
              <div className="mt-2 text-sm text-gray-700">{reasoning}</div>
            </details>
          )}
          <ReactMarkdown 
            className="border-t pt-2 prose prose-sm text-gray-900"
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>{children}</code>
                );
              }
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-lg p-4 shadow-sm ${
        message.role === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-800'
      }`}>
        {message.content}
      </div>
    </div>
  );
};
