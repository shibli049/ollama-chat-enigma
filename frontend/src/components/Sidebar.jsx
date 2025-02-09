import { PencilSquareIcon } from '@heroicons/react/24/solid';

export const Sidebar = ({ onNewChat }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform duration-200 hover:scale-105 flex items-center justify-center"
          title="New Chat"
        >
          <PencilSquareIcon className="h-5 w-5"/>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-gray-400 text-sm">Chat History (Coming Soon)</div>
      </div>
    </div>
  );
};
