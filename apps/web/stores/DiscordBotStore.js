import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDiscordBot = create(
  persist(
    (set, get) => ({
      // Current bot state
      currentBot: null,
      bots: [],
      isConnected: false,
      
      // Bot management
      addBot: (bot) => set((state) => {
        const newBots = [...state.bots, { ...bot, id: Date.now().toString() }];
        return {
          bots: newBots,
          currentBot: bot,
          isConnected: true
        };
      }),
      
      removeBot: (botId) => set((state) => {
        const newBots = state.bots.filter(bot => bot.id !== botId);
        const newCurrentBot = state.currentBot?.id === botId ? null : state.currentBot;
        return {
          bots: newBots,
          currentBot: newCurrentBot,
          isConnected: !!newCurrentBot
        };
      }),
      
      setCurrentBot: (bot) => set({ 
        currentBot: bot,
        isConnected: !!bot 
      }),
      
      updateBot: (botId, updates) => set((state) => {
        const newBots = state.bots.map(bot => 
          bot.id === botId ? { ...bot, ...updates } : bot
        );
        const newCurrentBot = state.currentBot?.id === botId 
          ? { ...state.currentBot, ...updates }
          : state.currentBot;
          
        return {
          bots: newBots,
          currentBot: newCurrentBot
        };
      }),
      
      // Connection management
      connect: (bot) => set({
        currentBot: bot,
        isConnected: true
      }),
      
      disconnect: () => set({
        currentBot: null,
        isConnected: false
      }),
      
      // Bot data
      updateBotData: (data) => set((state) => ({
        currentBot: state.currentBot ? {
          ...state.currentBot,
          ...data
        } : null
      })),
      
      // Clear all data
      clearAll: () => set({
        currentBot: null,
        bots: [],
        isConnected: false
      })
    }),
    {
      name: 'discord-bot-storage',
      partialize: (state) => ({
        bots: state.bots,
        currentBot: state.currentBot,
        isConnected: state.isConnected
      })
    }
  )
);

export default useDiscordBot;
