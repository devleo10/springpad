import React from "react";

const AiFeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-[#f9fafb] rounded-[18px] p-4 border border-[#E1E1E1] shadow">
          <div className="bg-white border border-[#E1E1E1] rounded-xl p-4 space-y-3 h-80 flex flex-col">
            <div className="bg-gray-100 inline-block px-3 py-1 rounded shadow">
              Hello, Nice
            </div>
            <div className="bg-white inline-block p-3 rounded shadow text-sm">
              Welcome to LiveChat I was made with Pick a topic from the list or
              type down a question!
            </div>
            <button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 py-1 rounded shadow text-sm">
              Welcome
            </button>
            <div className="mt-auto">
              <input
                type="text"
                placeholder="Write a message"
                className="w-full border rounded px-3 py-2 text-sm mt-4"
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold">Chat with your calls</h3>
            <p className="text-sm text-gray-500">
              It makes no sense but we have it here. Use it the way you want it.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[18px] p-4 border border-[#E1E1E1] shadow">
          <div className="bg-white border border-[#E1E1E1] rounded-xl p-4 space-y-3 h-80 flex flex-col">
            <div className="bg-gray-100 inline-block px-3 py-1 rounded shadow">
              Hello, Nice
            </div>
            <div className="bg-white inline-block p-3 rounded shadow text-sm">
              Welcome to LiveChat I was made with Pick a topic from the list or
              type down a question!
            </div>
            <button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 py-1 rounded shadow text-sm">
              Welcome
            </button>
            <div className="mt-auto">
              <input
                type="text"
                placeholder="Write a message"
                className="w-full border rounded px-3 py-2 text-sm mt-4"
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold">Chat with your calls</h3>
            <p className="text-sm text-gray-500">
              It makes no sense but we have it here. Use it the way you want it.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[18px] p-4 border border-[#E1E1E1] shadow">
          <div className="bg-white border border-[#E1E1E1] rounded-xl p-4 space-y-3 h-80 flex flex-col">
            <div className="bg-gray-100 inline-block px-3 py-1 rounded shadow">
              Hello, Nice
            </div>
            <div className="bg-white inline-block p-3 rounded shadow text-sm">
              Welcome to LiveChat I was made with Pick a topic from the list or
              type down a question!
            </div>
            <button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 py-1 rounded shadow text-sm">
              Welcome
            </button>
            <div className="mt-auto">
              <input
                type="text"
                placeholder="Write a message"
                className="w-full border rounded px-3 py-2 text-sm mt-4"
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold">Chat with your calls</h3>
            <p className="text-sm text-gray-500">
              It makes no sense but we have it here. Use it the way you want it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AiFeaturesPage };
