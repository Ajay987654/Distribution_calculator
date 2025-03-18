import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,

      // Login Function
      login: async (email, password) => {
        try {
          const response = await axios.post('https://your-api-url.com/login', {
            email,
            password,
          });

          const userData = response.data;
          set({
            user: userData,
            isAuthenticated: true,
            error: null,
          });
        } catch (err) {
          set({ error: 'Invalid credentials, please try again.' });
        }
      },

      // Logout Function
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-store', // Name in localStorage
      getStorage: () => localStorage, // Persist with localStorage
    }
  )
);

export default useAuthStore;
