'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Agent } from '@/types';
import { MOCK_AGENT_ID, mockAgent } from '@/lib/constants';

interface AuthContextType {
  agent: Agent | null;
  login: (agentId: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only access sessionStorage on client side
    if (typeof window !== 'undefined') {
      try {
        const storedAgentId = sessionStorage.getItem('properview_agent_id');
        if (storedAgentId === MOCK_AGENT_ID) {
          setAgent(mockAgent);
        }
      } catch (error) {
        console.warn(
          'Session storage not available or access denied during auth check.'
        );
      }
    }
    setIsLoading(false);
  }, []);

  const login = (agentId: string) => {
    if (agentId === MOCK_AGENT_ID) {
      setAgent(mockAgent);
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('properview_agent_id', agentId);
        } catch (error) {
          console.warn(
            'Session storage not available or access denied during login.'
          );
        }
      }
    } else {
      console.error('Invalid agent ID for mock login');
    }
  };

  const logout = () => {
    setAgent(null);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('properview_agent_id');
      } catch (error) {
        console.warn(
          'Session storage not available or access denied during logout.'
        );
      }
    }
  };

  return (
    <AuthContext.Provider value={{ agent, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
