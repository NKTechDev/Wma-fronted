import { create } from 'zustand';
import { createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage'; // Assuming you have this custom storage set up

// Create the Zustand store with the correct syntax
export const useLiveMeetStore = create(
  (set, get) => ({
    sessionId: null,
    participants: [],
    chatMessages: [],
    micOn: false,
    videoOn: false,

    // Function to add a session ID
    addSessionId: (id) => {
      set({ sessionId: id });
    },

    // Function to remove the session ID
    removeSessionId: () => {
      set({ sessionId: null });
    },

    // Function to add a participant
    addParticipant: (participant) => {
      const { participants } = get();
      // Check if the participant already exists by userId
      if (!participants.find((p) => p.userId === participant.userId)) {
        set({ participants: [...participants, participant] });
      }
    },
 
    // Function to update a participant (like mic or video status)
    updateParticipant: (updatedParticipant) => {
      const { participants } = get();
      set({
        participants: participants.map((p) =>
          p.userId === updatedParticipant.userId
            ? {
                ...p,
                micOn: updatedParticipant.micOn,
                videoOn: updatedParticipant.videoOn,
              }
            : p,
        ),
      });
    },

    setStreamurl:(participantId,streamURL) => {

        const { participants } = get();
        const updatedParticipants = participants.map(p=>{
            if (p.userId === updatedParticipant.userId){
                return {...p,streamURL:streamURL}
            }

            return p
        })
        set({participants: updatedParticipants});
        

    },
   
  }),


  

  {
    name: 'live-meet-storage', // Name for persistence
    storage: createJSONStorage(() => mmkvStorage), // Using MMKV storage for persistence
  }
);
