'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface KBItem {
  id: string;
  applicationName: string;
  categoryDomain: string;
  moduleSubDomain: string;
  functionalComponent: string;
  timestamp: Date;
  sections: {
    overview: string;
    functionalRequirements: string;
    technicalDetails: string;
    businessRules: string;
  };
}

interface KBContextType {
  kbItems: KBItem[];
  addKBItem: (item: Omit<KBItem, 'id' | 'timestamp'>) => string;
  getKBItem: (id: string) => KBItem | undefined;
  getRecentKBItems: (limit?: number) => KBItem[];
}

const KBContext = createContext<KBContextType | undefined>(undefined);

const STORAGE_KEY = 'research-hub-kb-items';

export function KBProvider({ children }: { children: ReactNode }) {
  const [kbItems, setKBItems] = useState<KBItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const items = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setKBItems(items);
      } catch (error) {
        console.error('Failed to load KB items:', error);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (kbItems.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(kbItems));
    }
  }, [kbItems]);

  const addKBItem = (item: Omit<KBItem, 'id' | 'timestamp'>) => {
    const newItem: KBItem = {
      ...item,
      id: `kb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setKBItems((prev) => [newItem, ...prev]);
    return newItem.id;
  };

  const getKBItem = (id: string) => {
    return kbItems.find((item) => item.id === id);
  };

  const getRecentKBItems = (limit: number = 5) => {
    return kbItems.slice(0, limit);
  };

  return (
    <KBContext.Provider value={{ kbItems, addKBItem, getKBItem, getRecentKBItems }}>
      {children}
    </KBContext.Provider>
  );
}

export function useKB() {
  const context = useContext(KBContext);
  if (context === undefined) {
    throw new Error('useKB must be used within a KBProvider');
  }
  return context;
}
