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
  await db.transaction(async (dbPen) => {
    // Get the organizationId where isOrganization and isConnectionId
    const organization = await getOrg(dbPen, domain, apiKey, connectionId);

    const organizationId = organization?.id;
    if (organizationId) {
      // Click
      const click = data.clickEvents.map((entry) =>
        dbPen.insert(clickEventEntries).values({
          ...entry,
          connectionId,
          organizationId,
          perfTimestamp: String(entry.perfTimestamp),
        }),
      );
      // Key
      const key = data.keyEvents.map((entry) =>
        dbPen.insert(keyEventEntries).values({
          ...entry,
          connectionId,
          organizationId,
          perfTimestamp: String(entry.perfTimestamp),
        }),
      );
      // Mouse
      const mouse = data.mouseMoveEvents.map((entry) =>
        dbPen.insert(mouseMoveEntries).values({
          ...entry,
          connectionId,
          organizationId,
          perfTimestamp: String(entry.perfTimestamp),
        }),
      );
      // Resize
      const resize = data.resizeEvents.map((entry) =>
        dbPen.insert(resizeEventEntries).values({
          ...entry,
          connectionId,
          organizationId,
          perfTimestamp: String(entry.perfTimestamp),
        }),
      );
      // Scroll
      const scroll = data.scrollEvents.map((entry) =>
        dbPen.insert(scrollEventEntries).values({
          ...entry,
          connectionId,
          organizationId,
          scrollX: String(entry.scrollX),
          scrollY: String(entry.scrollY),
          perfTimestamp: String(entry.perfTimestamp),
        }),
      );
      // TabVisibility
      const tabVisibility = data.tabVisibilityEvents.map((entry) =>
        dbPen.insert(tabVisibilityEntries).values({
          ...entry,
          connectionId,
          organizationId,
          perfTimestamp: String(entry.perfTimestamp),
        }),
      );
      // Insert All
      await Promise.all([
        ...click,
        ...key,
        ...mouse,
        ...resize,
        ...scroll,
        ...tabVisibility,
      ]);
    }
  });
}
