'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type UnitSystem = 'metric' | 'imperial';

interface UnitContextType {
  units: UnitSystem;
  setUnits: (units: UnitSystem) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<UnitSystem>('imperial');

  return (
    <UnitContext.Provider value={{ units, setUnits }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitProvider');
  }
  return context;
}
