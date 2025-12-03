import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  registrationNumber: string;
  userType: string;
  labLink?: string;
  fineCount: number;
  active: boolean;
  blockedUntil?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  loginFake: () => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// Usuário fictício padrão
const fakeUser: User = {
  id: 1,
  name: 'Usuário Demo',
  email: 'demo@lablibrary.com',
  registrationNumber: 'DEMO001',
  userType: 'technician',
  labLink: 'https://lab.example.com/demo',
  fineCount: 0,
  active: true,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Inicializa com usuário fictício se não houver
      const initializeFakeUser = () => {
        const fakeToken = 'fake-token-' + Date.now();
        const fakeRefreshToken = 'fake-refresh-token-' + Date.now();
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('refreshToken', fakeRefreshToken);
        return { user: fakeUser, token: fakeToken, refreshToken: fakeRefreshToken };
      };

      return {
        user: fakeUser,
        token: 'fake-token',
        refreshToken: 'fake-refresh-token',
        setAuth: (user, token, refreshToken) => {
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, token, refreshToken });
        },
        loginFake: () => {
          const state = initializeFakeUser();
          set(state);
        },
        logout: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          // Após logout, reinicializa com usuário fictício
          const state = initializeFakeUser();
          set(state);
        },
        isAuthenticated: () => {
          // Sempre retorna true para permitir acesso fictício
          const state = get();
          if (!state.user) {
            // Se não há usuário, cria um fictício automaticamente
            const newState = initializeFakeUser();
            set(newState);
            return true;
          }
          return true;
        },
      };
    },
    {
      name: 'auth-storage',
    }
  )
);

