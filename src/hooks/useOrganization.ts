"use client";

import { useEffect } from "react";
import { create } from "zustand";
import {
  addUserToOrganization,
  removeUserFromOrganization,
} from "~/server/actions/addUserToOrganization";

import type { Organizations, Organization } from "~/server/types/InMeasure";

interface organizationState {
  organizations: Organizations | null;
  setOrganizations: (organization: Organizations) => void;
  organization: Organization | null;
  setOrganization: (organizationId: string) => void;
  addOrganizationUser: (userId: string, name: string, email: string) => void;
  removeOrganizationUser: (userId: string) => void;
  logoutOrganizations: () => void;
}

export const useOrganization = create<organizationState>((set, get) => ({
  organizations: null,
  setOrganizations: (organizations: Organizations) =>
    set((state) => ({ ...state, organizations })),
  organization: null,
  setOrganization: (organizationId) =>
    set((state) => {
      if (!state.organizations) return state;
      const organization = state.organizations.find(
        (c) => c.organization?.id === organizationId,
      );
      if (!organization) return state;
      return { ...state, organization };
    }),
  addOrganizationUser: async (userId: string, name: string, email: string) => {
    // Failsafe
    const fallbackOrganization = get().organization!;
    const fallbackOrganizations = get().organizations!;
    const organizationId = fallbackOrganization.organization?.id!;

    // Optimistic Update
    const optimisticOrganization: Organization = {
      ...fallbackOrganization,
      organization: {
        ...fallbackOrganization?.organization!,
        users: [
          ...fallbackOrganization?.organization?.users!,
          {
            userId,
            organizationId,
            user: {
              name,
              email,
            },
          },
        ],
      },
    };
    const optimisticOrganizations: Organizations = fallbackOrganizations.map(
      (c) =>
        c.organization?.id === organizationId ? optimisticOrganization : c,
    );

    set((state) => ({
      ...state,
      organizations: optimisticOrganizations,
      organization: optimisticOrganization,
    }));

    // Actual Update
    try {
      await addUserToOrganization(userId, organizationId);
    } catch (error) {
      // Else Fallback Update
      console.error(error);
      set((state) => ({
        ...state,
        organizations: fallbackOrganizations,
        organization: fallbackOrganization,
      }));
    }
  },
  removeOrganizationUser: async (userId: string) => {
    // Failsafe
    const fallbackOrganization = get().organization!;
    const fallbackOrganizations = get().organizations!;
    const organizationId = fallbackOrganization.organization?.id!;

    // Optimistic Update
    const optimisticOrganization: Organization = {
      ...fallbackOrganization,
      organization: {
        ...fallbackOrganization?.organization!,
        users: fallbackOrganization.organization!.users.filter(
          (user) => user.userId !== userId,
        ),
      },
    };
    const optimisticOrganizations: Organizations = fallbackOrganizations.map(
      (c) =>
        c.organization?.id === organizationId ? optimisticOrganization : c,
    );

    set((state) => ({
      ...state,
      organizations: optimisticOrganizations,
      organization: optimisticOrganization,
    }));

    // Actual Update
    try {
      await removeUserFromOrganization(userId, organizationId);
    } catch (error) {
      // Else Fallback Update
      console.error(error);
      set((state) => ({
        ...state,
        organizations: fallbackOrganizations,
        organization: fallbackOrganization,
      }));
    }
  },
  logoutOrganizations: () =>
    set((state) => ({ ...state, organizations: null, organization: null })),
}));

export function SetOrganizations({
  organizations,
}: {
  organizations: Organizations | null;
}) {
  const setOrganizations = useOrganization.getState().setOrganizations;
  const setOrganization = useOrganization.getState().setOrganization;

  useEffect(() => {
    if (organizations && organizations.length > 0) {
      setOrganizations(organizations);
      setOrganization(organizations.at(0)!.organization!.id);
    }
  }, [organizations, setOrganizations]);

  return null;
}
