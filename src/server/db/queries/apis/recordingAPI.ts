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
  await db.transaction(async (dbPen) => {
    // Get the organizationId where isOrganization and isConnectionId
    const organization = await getOrg(
      dbPen,
      domain,
      apiKey,
      connectionId,
    ).catch((err) => {
      console.error(
        `RecordingAPI - getOrg Authorization Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
      );
      response.responseStatus = 500;
    });

    const organizationId = organization?.id;
    if (organizationId) {
      // Click
      const clickMessages = data.clickEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const click = dbPen
        .insert(clickEventEntries)
        .values(clickMessages)
        .catch((err) => {
          console.error(
            `RecordingAPI - Insert ClickEvent Messages Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
          );
          response.responseStatus = 500;
        });

      // Key
      const keyMessages = data.keyEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const key = dbPen
        .insert(keyEventEntries)
        .values(keyMessages)
        .catch((err) => {
          console.error(
            `RecordingAPI - Insert KeyEvent Messages Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
          );
          response.responseStatus = 500;
        });

      // Mouse
      const mouseMessages = data.mouseMoveEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const mouse = dbPen
        .insert(mouseMoveEntries)
        .values(mouseMessages)
        .catch((err) => {
          console.error(
            `RecordingAPI - Insert MouseEvent Messages Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
          );
          response.responseStatus = 500;
        });

      // Resize
      const resizeMessages = data.resizeEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const resize = dbPen
        .insert(resizeEventEntries)
        .values(resizeMessages)
        .catch((err) => {
          console.error(
            `RecordingAPI - Insert ResizeEvent Messages Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
          );
          response.responseStatus = 500;
        });

      // Scroll
      const scrollMessages = data.scrollEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        scrollX: String(entry.scrollX),
        scrollY: String(entry.scrollY),
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const scroll = dbPen
        .insert(scrollEventEntries)
        .values(scrollMessages)
        .catch((err) => {
          console.error(
            `RecordingAPI - Insert ScrollEvent Messages Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
          );
          response.responseStatus = 500;
        });

      // TabVisibility
      const tabVisibilityMessages = data.tabVisibilityEvents.map((entry) => ({
        ...entry,
        connectionId,
        organizationId,
        perfTimestamp: String(entry.perfTimestamp),
      }));
      const tabVisibility = dbPen
        .insert(tabVisibilityEntries)
        .values(tabVisibilityMessages)
        .catch((err) => {
          console.error(
            `RecordingAPI - Insert TabVisibilityEvent Messages Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
          );
          response.responseStatus = 500;
        });

      // Insert All
      await Promise.all([click, key, mouse, resize, scroll, tabVisibility]);
    } else {
      console.warn(
        `RecordingAPI - Illegal Organization Attempt. Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
      );
      response.responseStatus = 403;
    }
  });
  return response;
}
