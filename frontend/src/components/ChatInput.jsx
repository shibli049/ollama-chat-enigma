import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export const ChatInput = ({ input, setInput, isLoading, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="p-6 bg-gray-100 border-t">
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
  );
};
