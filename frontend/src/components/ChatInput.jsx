import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export const ChatInput = ({ input, setInput, isLoading, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t">
      <div className="flex items-end max-w-[60%] mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 h-36 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 border-blue-200"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
