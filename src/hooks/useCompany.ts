"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { addMemberToCompany } from "~/server/actions/addUserToCompany";

import type { Companies, Company } from "~/server/types/InMeasure";

interface companyState {
  companies: Companies | null;
  setCompanies: (company: Companies) => void;
  company: Company | null;
  setCompany: (companyId: string) => void;
  addCompanyMember: (userId: string, name: string, email: string) => void;
}

export const useCompany = create<companyState>((set, get) => ({
  companies: null,
  setCompanies: (companies: Companies) =>
    set((state) => ({ ...state, companies })),
  company: null,
  setCompany: (companyId) =>
    set((state) => {
      if (!state.companies) return state;
      const company = state.companies.find((c) => c.client?.id === companyId);
      if (!company) return state;
      return { ...state, company };
    }),
  addCompanyMember: async (userId: string, name: string, email: string) => {
    // Failsafe
    const fallbackCompany = get().company!;
    const fallbackCompanies = get().companies!;
    const clientId = fallbackCompany.client?.id!;

    // Optimistic Update
    const optimisticCompany: Company = {
      ...fallbackCompany,
      client: {
        ...fallbackCompany?.client!,
        users: [
          ...fallbackCompany?.client?.users!,
          {
            userId,
            clientId,
            user: {
              name,
              email,
            },
          },
        ],
      },
    };
    const optimisticCompanies: Companies = fallbackCompanies.map((c) =>
      c.client?.id === clientId ? optimisticCompany : c,
    );

    set((state) => ({
      ...state,
      companies: optimisticCompanies,
      company: optimisticCompany,
    }));

    // Actual Update
    try {
      await addMemberToCompany(userId, clientId);
    } catch (error) {
      // Else Fallback Update
      console.error(error);
      set((state) => ({
        ...state,
        companies: fallbackCompanies,
        company: fallbackCompany,
      }));
    }
  },
}));

export function SetCompanies({ companies }: { companies: Companies | null }) {
  const setCompanies = useCompany.getState().setCompanies;
  const setCompany = useCompany.getState().setCompany;

  useEffect(() => {
    if (companies && companies.length > 0) {
      setCompanies(companies);
      setCompany(companies.at(0)!.client!.id);
    }
  }, [companies, setCompanies]);

  return null;
}
