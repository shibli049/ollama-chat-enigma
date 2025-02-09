import { useState, useEffect } from 'react';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    addMessage,
    clearMessages
  };
};
