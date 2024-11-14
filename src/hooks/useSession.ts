"use client";

import { useEffect } from "react";
import { create } from "zustand";

import type { Session } from "next-auth";

interface sessionState {
  session: Session | null;
  setSession: (session: Session) => void;
}

export const useSession = create<sessionState>((set) => ({
  session: null,
  setSession: (session: Session) => set((state) => ({ ...state, session })),
}));

export function SetSession({ session }: { session: Session | null }) {
  const setSession = useSession.getState().setSession;

  useEffect(() => {
    if (session) {
      setSession(session);
    }
  }, [session, setSession]);

  return null;
}
