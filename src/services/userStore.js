import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';  // Assuming mmkvStorage is already defined and properly configured

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      sessions: [],
      setUser: (data) => set({ user: data }),
      addSession: (sessionId) => {
        const { sessions } = get();
        const existingSession = sessions.findIndex((s) => s === sessionId);
        if (existingSession === -1)
          set({ sessions: [...sessions, sessionId] });
      },
      removeSession: (sessionId) => {
        const { sessions } = get();
        const newSessions = sessions.filter((s) => s !== sessionId);
        set({ sessions: newSessions });
      },
      clear: () => set({ user: null, sessions: [] })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => mmkvStorage), // Correctly return mmkvStorage
    }
  )
);
