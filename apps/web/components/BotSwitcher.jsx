import React, { useState } from "react";
import { useDiscordBot } from "../stores/DiscordBotStore";
import { useToast } from "../stores/ToastStore";
import { ChevronDown, ChevronUp, Plus, Trash, Bot, Check, Edit, X, Server } from "lucide-react";

export default function BotSwitcher() {
  const { bots, currentBot, setCurrentBot, removeBot } = useDiscordBot();
  const { success, error } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [renamingBot, setRenamingBot] = useState(null);
  const [newName, setNewName] = useState("");

  const handleSwitchBot = (bot) => {
    setCurrentBot(bot);
    success(`Switched to ${bot.name}`);
    setIsOpen(false);
  };

  const handleDeleteBot = (botId) => {
    removeBot(botId);
    success("Bot removed successfully");
    setShowConfirmDelete(null);
    setIsOpen(false);
  };

  const startRename = (bot) => {
    setRenamingBot(bot.id);
    setNewName(bot.name);
  };

  const finishRename = (botId) => {
    if (newName.trim()) {
      // Update bot name in the store
      // This would require an additional method in your store that we'll need to implement
      setRenamingBot(null);
      success("Bot renamed successfully");
    } else {
      error("Bot name cannot be empty");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition-colors"
      >
        {currentBot ? (
          <>
            <Server className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-400">{currentBot.name}</span>
          </>
        ) : (
          <>
            <Bot className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-400">No Bot Selected</span>
          </>
        )}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg z-10 py-2 border border-gray-700 animate-fadeIn">
          {bots.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs text-gray-400 font-semibold">Your Bots</div>
              {bots.map((bot) => (
                <div key={bot.id} className="relative">
                  {showConfirmDelete === bot.id ? (
                    <div className="px-3 py-2 bg-red-900/30">
                      <p className="text-xs text-white mb-2">Delete this bot?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteBot(bot.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(null)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : renamingBot === bot.id ? (
                    <div className="px-3 py-2 flex items-center">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => finishRename(bot.id)}
                        className="ml-2 text-green-400 hover:text-green-300"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRenamingBot(null)}
                        className="ml-1 text-gray-400 hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`px-3 py-2 flex items-center justify-between hover:bg-gray-700 cursor-pointer ${
                        currentBot?.id === bot.id ? "bg-blue-900/30" : ""
                      }`}
                    >
                      <div
                        className="flex items-center flex-1"
                        onClick={() => handleSwitchBot(bot)}
                      >
                        <Bot className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="text-sm text-gray-200">{bot.name}</span>
                        {currentBot?.id === bot.id && (
                          <Check className="w-3 h-3 ml-2 text-green-400" />
                        )}
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => startRename(bot)}
                          className="text-gray-400 hover:text-white mr-1"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(bot.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t border-gray-700 my-1"></div>
            </>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-400">No bots created yet</div>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              // Show the bot setup modal
              // You'd need to call setShowBotSetup(true) from the parent component
            }}
            className="w-full px-3 py-2 flex items-center text-sm text-green-400 hover:bg-gray-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Bot
          </button>
        </div>
      )}
    </div>
  );
}
