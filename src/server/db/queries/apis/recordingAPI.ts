import "server-only";

import { db } from "~/server/db";
import { getOrg } from "../helpers/getOrg";
import {
  clickEventEntries,
  keyEventEntries,
  mouseMoveEntries,
  resizeEventEntries,
  scrollEventEntries,
  tabVisibilityEntries,
} from "../../schema";

import type { SessionRecordingMessage } from "~/server/types/scripts";

export async function authorizeAndWriteMessage(
  data: SessionRecordingMessage,
  domain: string,
  apiKey: string,
  connectionId: string,
) {
  const response = { responseStatus: 201, responseMessage: "" };

  try {
    await db.transaction(async (dbPen) => {
      const { value: organization, err } = await getOrg(
        dbPen,
        domain,
        apiKey,
        connectionId,
      );
      if (err || !organization?.id)
        throw new Error(err ? err : "No organizationId error.");
      const organizationId = organization.id;

      const clickMessages = data.clickEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const click = dbPen.insert(clickEventEntries).values(clickMessages);

      // Key
      const keyMessages = data.keyEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const key = dbPen.insert(keyEventEntries).values(keyMessages);

      // Mouse
      const mouseMessages = data.mouseMoveEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const mouse = dbPen.insert(mouseMoveEntries).values(mouseMessages);

      // Resize
      const resizeMessages = data.resizeEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const resize = dbPen.insert(resizeEventEntries).values(resizeMessages);

      // Scroll
      const scrollMessages = data.scrollEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        scrollX: String(entry.scrollX),
        scrollY: String(entry.scrollY),
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const scroll = dbPen.insert(scrollEventEntries).values(scrollMessages);

      // TabVisibility
      const tabVisibilityMessages = data.tabVisibilityEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const tabVisibility = dbPen
        .insert(tabVisibilityEntries)
        .values(tabVisibilityMessages);

      await Promise.all([click, key, mouse, resize, scroll, tabVisibility]);
    });
  } catch (err: any) {
    console.error(err.message);
    response.responseStatus = 500;
    return response;
  }

  return response;
}
