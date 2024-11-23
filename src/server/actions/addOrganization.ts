"use server";

import { redirect } from "next/navigation";
import {
  addOrganizationAndAssignUser,
  isExistingDomain,
} from "../db/queries/addOrganization";

export async function addOrganization(
  userId: string,
  name: string,
  domain: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
) {
  await addOrganizationAndAssignUser(
    userId,
    name,
    domain,
    standardScriptLimit,
    playbackScriptLimit,
  );
  return redirect("/");
}

export async function isOrganizationDomain(domain: string) {
  return await isExistingDomain(domain);
}
