import React, { useState } from "react";

export default function BotSettings() {
  const [botName, setBotName] = useState("");
  const [botAvatar, setBotAvatar] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [token, setToken] = useState("");
  const [botStatus, setBotStatus] = useState("Offline");

  return (
    <div className="settings-bg min-h-screen p-4 md:p-8 flex flex-col gap-8">
      {/* Bot Settings */}
      <section className="bg-neutral-900 border border-gray-800 rounded-2xl p-4 md:p-6 mb-4 shadow-lg">
        <div className="text-lg font-bold text-cyan-300 mb-4">Bot Settings</div>
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 mb-1">Bot Name <span title="Your bot's username" className="ml-1 text-xs">ⓘ</span></label>
            <input
              type="text"
              className="w-full rounded-md px-4 py-2 bg-neutral-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={botName}
              onChange={e => setBotName(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 mb-1">Bot Avatar <span title="Your bot's profile picture" className="ml-1 text-xs">ⓘ</span></label>
            <input
              type="file"
              className="block w-full"
              onChange={e => setBotAvatar(e.target.files[0])}
            />
          </div>
        </div>
        <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 mb-1">Bot Status Message</label>
            <input
              type="text"
              className="w-full rounded-md px-4 py-2 bg-neutral-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={statusMsg}
              onChange={e => setStatusMsg(e.target.value)}
              placeholder="Change the status message"
            />
          </div>
          <button className="btn-danger h-10 mt-2 md:mt-6">Set Status Message</button>
        </div>
      </section>

      {/* Bot Options */}
      <section className="bg-neutral-900 border border-gray-800 rounded-2xl p-4 md:p-6 mb-4 shadow-lg">
        <div className="text-lg font-bold text-cyan-300 mb-4">Bot Options</div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Access Token <span title="Your bot's access token from Discord Developer Portal" className="ml-1 text-xs">ⓘ</span></label>
          <input
            type="password"
            className="w-full rounded-md px-4 py-2 bg-neutral-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Access Token"
          />
        </div>
        <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 mb-1">Bot Status</label>
            <span className="text-red-500 font-bold">{botStatus}</span>
          </div>
          <button className="btn-danger h-10 w-full md:w-auto">Start</button>
        </div>
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <button className="btn-danger flex-1">Restart Bot</button>
          <button className="btn-danger flex-1">Delete Bot</button>
        </div>
      </section>
    </div>
  );
}
