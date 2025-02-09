import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export const ChatInput = ({ input, setInput, isLoading, onSubmit }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-4 border-t dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-end max-w-[60%] mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="flex-1 h-36 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 dark:bg-gray-800 border-blue-300 dark:border-gray-600 shadow-sm dark:text-gray-200 dark:placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="ml-2 p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
