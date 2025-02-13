import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { parseMessage } from '../utils/messageUtils';

export const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  if (message.role === 'assistant' && message.content.includes('<think>')) {
    const { reasoning, answer } = parseMessage(message.content);
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-[60%]">
          <div className="flex justify-start w-full">
            <div className="w-full rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
              {reasoning && (
                <details className="mb-2 border rounded p-2 bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                  <summary className="cursor-pointer font-bold">Show reasoning</summary>
                  <ReactMarkdown 
                    className="mt-2 text-sm text-gray-700 dark:text-gray-300"
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
                    {reasoning}
                  </ReactMarkdown>
                </details>
              )}
              <ReactMarkdown 
                className="border-t dark:border-gray-700 pt-2 prose prose-sm dark:prose-invert"
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[60%]">
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
          <div className={`${!isUser && 'w-full'} rounded-lg p-4 shadow-sm ${
            isUser 
              ? 'max-w-[75%] bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 text-gray-800 dark:text-gray-200 prose prose-sm dark:prose-invert' 
              : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
          }`}>
            <ReactMarkdown
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
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
