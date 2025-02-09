import React, { useState, useRef, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './custom-react-confirm-alert.css';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { useMessages } from './hooks/useMessages';

function App() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, setMessages, isLoading, setIsLoading, addMessage, clearMessages } = useMessages();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, timestamp: Date.now() };
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    let assistantMessage = { role: 'assistant', content: '', timestamp: Date.now() };
    setMessages(prev => [...prev, assistantMessage].sort((a, b) => a.timestamp - b.timestamp));

    try {
      // Prepare chat history for the API
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          messages: [...chatHistory, { role: 'user', content: input }]
        }),
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
      overlayClassName: 'no-blur',
      buttons: [
        {
          label: 'Yes, start new chat!',
          onClick: clearMessages
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
        <Sidebar onNewChat={handleNewChat} />
        <div className="flex-1 flex flex-col bg-white shadow-xl">
          <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 shadow-md">
            <div className="flex flex-col items-center">
              <div className="relative">
                <h1 className="text-3xl font-bold">Arcane Chat Enigma</h1>
                <p className="text-xs absolute -bottom-4 right-1">by <a href="https://github.com/shibli049" className="text-yellow-300 hover:underline">shibli049</a></p>
              </div>
            </div>
          </header>
          <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="w-full max-w-[60%]">
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 rounded-lg p-4 shadow-sm">
                      Thinking...
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput 
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
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
