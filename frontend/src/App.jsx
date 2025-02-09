import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './custom-react-confirm-alert.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Add helper to parse assistant message content
const parseMessage = (content) => {
  const thinkRegex = /<think>(.*?)<\/think>/s;
  const match = content.match(thinkRegex);
  if (match) {
    const reasoning = match[1].trim();
    const answer = content.replace(thinkRegex, "").trim();
    return { reasoning, answer };
  }
  return { reasoning: '', answer: content };
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load persisted messages on mount
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) setMessages(JSON.parse(storedMessages));
  }, []);

  const addMessage = (message) => {
    if (!message.timestamp) {
      message.timestamp = Date.now();
    }
    const updatedMessages = [...messages, message].sort((a, b) => a.timestamp - b.timestamp);
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, timestamp: Date.now() };
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // Add a placeholder for the assistant's response
    let assistantMessage = { role: 'assistant', content: '', timestamp: Date.now() };
    setMessages(prev => {
      const updated = [...prev, assistantMessage].sort((a, b) => a.timestamp - b.timestamp);
      localStorage.setItem('chatMessages', JSON.stringify(updated));
      return updated;
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          const data = JSON.parse(line);
          assistantMessage.content += data.response;
          setMessages(prev => {
            // Update the last message (assumed be the assistant placeholder)
            const updated = prev.map((msg, i) => i === prev.length - 1 ? assistantMessage : msg);
            localStorage.setItem('chatMessages', JSON.stringify(updated));
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    confirmAlert({
      title: 'Start a New Chat?',
      message: "Are you sure you want to clear the chat? All messages will be lost.",
      overlayClassName: 'no-blur', // added to remove blur
      buttons: [
        {
          label: 'Yes, start new chat!',
          onClick: () => {
            setMessages([]);
            localStorage.removeItem('chatMessages');
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="flex h-full">
        {/* Left Panel */}
        <div className="w-64 bg-gray-800 text-white flex flex-col">
          {/* New Chat Button moved to top */}
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={handleNewChat}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-transform duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              New Chat
            </button>
          </div>
          {/* Chat History Section - To be implemented */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-gray-400 text-sm">Chat History (Coming Soon)</div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white shadow-xl">
          <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 shadow-md">
            <div className="flex flex-col items-center">
              <div className="relative">
                <h1 className="text-3xl font-bold">Arcane Enigma</h1>
                <p className="text-xs absolute -bottom-4 right-1">by <a href="https://github.com/shibli049" className="text-yellow-300 hover:underline">shibli049</a></p>
              </div>
            </div>
          </header>
          <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => {
              if (message.role === 'assistant' && message.content.includes('<think>')) {
                const { reasoning, answer } = parseMessage(message.content);
                return (
                  <div key={index} className="flex justify-start">
                    <div className="max-w-[70%] rounded-lg p-4 shadow-sm bg-gray-200 text-gray-800">
                      {reasoning && (
                        <details className="mb-2 border rounded p-2 bg-gray-100">
                          <summary className="cursor-pointer font-bold">Show reasoning</summary>
                          <div className="mt-2 text-sm text-gray-700">
                            {reasoning}
                          </div>
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
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
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
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg p-4 shadow-sm">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-6 bg-gray-100 border-t">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-transform duration-200 hover:scale-105 flex items-center justify-center"
              >
                <PaperAirplaneIcon className="h-6 w-6" />
              </button>
            </div>
          </form>
          <div className="p-4 bg-gray-100 border-t">
            <footer className="text-gray-600 text-center">
              Powered by
              <a href="https://ollama.com/library/deepseek-r1" className="text-blue-500 hover:underline"> Deepseek </a>
              and
              <a href="https://ollama.com/" className="text-blue-500 hover:underline"> Ollama</a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
