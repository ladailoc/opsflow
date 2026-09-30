'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { AppState, INITIAL_STATE } from './state';
import { AppAction } from './actions';
import { appReducer } from './reducer';
import { selectors } from './selectors';
import { User } from '@/mocks/users';

const STORAGE_KEY = 'opsflow_prototype_state_v1';

interface PrototypeContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  activeUser: User;
  setActiveUser: (userId: string) => void;
  resetState: () => void;
  selectors: typeof selectors;
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE, (initial) => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to restore prototype state from localStorage:', e);
      }
    }
    return initial;
  });

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync state to localStorage for seamless multi-page prototype navigation
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save prototype state to localStorage:', e);
      }
    }
  }, [state, isClient]);

  const activeUser = selectors.getActiveUser(state);

  const setActiveUser = (userId: string) => {
    dispatch({ type: 'SET_ACTIVE_USER', payload: { userId } });
  };

  const resetState = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    dispatch({ type: 'RESET_STATE' });
  };

  return (
    <PrototypeContext.Provider
      value={{
        state,
        dispatch,
        activeUser,
        setActiveUser,
        resetState,
        selectors,
      }}
    >
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototype() {
  const context = useContext(PrototypeContext);
  if (!context) {
    throw new Error('usePrototype must be used within a PrototypeProvider');
  }
  return context;
}
