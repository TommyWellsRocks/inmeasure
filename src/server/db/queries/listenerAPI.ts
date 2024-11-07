import "server-only";

import { db } from "~/server/db";
import {
  clickEventEntries,
  browserEntries,
  keyEventEntries,
  largestContentfulPaintEntries,
  layoutShiftEntries,
  mouseMoveEntries,
  navigationEntries,
  heartbeatEntries,
  paintEntries,
  resizeEventEntries,
  resourceEntries,
  scrollEventEntries,
  tabVisibilityEntries,
  connectionEntries,
} from "../schema";

import type {
  BrowserMessage,
  GoldEventMessage,
  BronzeEventMessage,
  SilverEventMessage,
} from "~/server/types/analytics";
import { PgTransaction } from "drizzle-orm/pg-core";
import { VercelPgQueryResultHKT } from "drizzle-orm/vercel-postgres";
import { ExtractTablesWithRelations } from "drizzle-orm";

type DBPen = PgTransaction<
  VercelPgQueryResultHKT,
  typeof import("/Users/tommywells/Developer/inmeasure/website/inmeasure/src/server/db/schema"),
  ExtractTablesWithRelations<
    typeof import("/Users/tommywells/Developer/inmeasure/website/inmeasure/src/server/db/schema")
  >
>;

export async function authorizeAndWriteMessage(
  data:
    | BrowserMessage
    | BronzeEventMessage
    | SilverEventMessage
    | GoldEventMessage,
  domain: string,
  apiKey: string,
  connectionId: string,
) {
  await db.transaction(async (dbPen) => {
    // Get the clientId where isClient and isConnectionId
    const client = await dbPen.query.clients.findFirst({
      columns: { id: true },
      where: (model, { and, eq, exists }) =>
        and(
          eq(model.domain, domain),
          eq(model.apiKey, apiKey),
          exists(
            dbPen
              .select({ connectionId: connectionEntries.connectionId })
              .from(connectionEntries)
              .where(
                and(
                  eq(connectionEntries.clientId, model.id),
                  eq(connectionEntries.connectionId, connectionId),
                ),
              ),
          ),
        ),
    });

    const clientId = client?.id;
    if (clientId) {
      if ("ipAddress" in data) {
        // Initial Message
        await postBrowserMessage(dbPen, data, clientId, connectionId);
      } else if ("resource" in data) {
        // Gold Event Message
        await postGoldEventMessage(dbPen, data, clientId, connectionId);
      } else if ("navigation" in data) {
        // Silver Event Message
        await postSilverEventMessage(dbPen, data, clientId, connectionId);
      } else if ("pageURL" in data) {
        // Bronze Event Message
        await postBronzeEventMessage(dbPen, data, clientId, connectionId);
      }
    }
  });
}

async function postBrowserMessage(
  pen: DBPen,
  data: BrowserMessage,
  clientId: string,
  connectionId: string,
) {
  await pen.insert(browserEntries).values({
    clientId,
    connectionId,
    ...data,
    performanceTimestamp: String(data.performanceTimestamp),
  });
}

async function postGoldEventMessage(
  pen: DBPen,
  data: GoldEventMessage,
  clientId: string,
  connectionId: string,
) {
  const cc = { clientId, connectionId };
  await pen.insert(heartbeatEntries).values({
    ...cc,
    pageURL: data.pageURL,
    realTimestamp: data.realTimestamp,
  });
  if (data.clickEvents.length > 0) {
    await pen.insert(clickEventEntries).values(
      data.clickEvents.map((e) => ({
        ...cc,
        clickX: e.clickX,
        clickY: e.clickY,
        elementId: e.id || "",
        elementTag: e.tagName || "",
        realTimestamp: e.realTimestamp,
      })),
    );
  }
  if (data.keyEvents.length > 0) {
    await pen.insert(keyEventEntries).values(
      data.keyEvents.map((e) => ({
        ...cc,
        key: e.key,
        realTimestamp: e.realTimestamp,
      })),
    );
  }
  if (data.mouseMoveEvents.length > 0) {
    await pen.insert(mouseMoveEntries).values(
      data.mouseMoveEvents.map((e) => ({
        ...cc,
        x: e.x,
        y: e.y,
        realTimestamp: e.realTimestamp,
      })),
    );
  }
  if (data.resizeEvents.length > 0) {
    await pen.insert(resizeEventEntries).values(
      data.resizeEvents.map((e) => ({
        ...cc,
        windowHeight: e.windowHeight,
        windowWidth: e.windowWidth,
        realTimestamp: e.realTimestamp,
      })),
    );
  }
  if (data.scrollEvents.length > 0) {
    await pen.insert(scrollEventEntries).values(
      data.scrollEvents.map((e) => ({
        ...cc,
        scrollX: String(e.scrollX),
        scrollY: String(e.scrollY),
        realTimestamp: e.realTimestamp,
      })),
    );
  }
  if (data.tabVisibilityEvents.length > 0) {
    await pen.insert(tabVisibilityEntries).values(
      data.tabVisibilityEvents.map((e) => ({
        ...cc,
        visibility: e.visibility,
        realTimestamp: e.realTimestamp,
      })),
    );
  }
  if (data["largest-contentful-paint"].length > 0) {
    await pen.insert(largestContentfulPaintEntries).values(
      data["largest-contentful-paint"].map((e) => ({
        ...cc,
        duration: String(e.duration),
        loadTime: String(e.loadTime),
        renderTime: String(e.renderTime),
        startTime: String(e.startTime),
        size: e.size,
        url: e.url,
      })),
    );
  }
  if (data["layout-shift"].length > 0) {
    await pen.insert(layoutShiftEntries).values(
      data["layout-shift"].map((e) => ({
        ...cc,
        currentRectBottom: e.currentRect.bottom,
        currentRectHeight: e.currentRect.height,
        currentRectLeft: e.currentRect.left,
        currentRectRight: e.currentRect.right,
        currentRectTop: e.currentRect.top,
        currentRectWidth: e.currentRect.width,
        duration: String(e.duration),
        hadRecentInput: e.hadRecentInput,
        lastInputTime: String(e.lastInputTime),
        previousRectX: e.previousRect.x,
        previousRectY: e.previousRect.y,
        currentRectX: e.currentRect.x,
        currentRectY: e.currentRect.y,
        previousRectBottom: e.previousRect.bottom,
        previousRectHeight: e.previousRect.height,
        previousRectLeft: e.previousRect.left,
        previousRectRight: e.previousRect.right,
        previousRectTop: e.previousRect.top,
        previousRectWidth: e.previousRect.width,
      })),
    );
  }
  const ne = data.navigation;
  if (ne) {
    await pen.insert(navigationEntries).values({
      ...cc,
      ...ne,
      duration: String(ne.duration),
      redirectStart: String(ne.redirectStart),
      redirectEnd: String(ne.redirectEnd),
      workerStart: String(ne.workerStart),
      activationStart: String(ne.activationStart),
      fetchStart: String(ne.fetchStart),
      domainLookupStart: String(ne.domainLookupStart),
      domainLookupEnd: String(ne.domainLookupEnd),
      connectStart: String(ne.connectStart),
      secureConnectionStart: String(ne.secureConnectionStart),
      connectEnd: String(ne.connectEnd),
      requestStart: String(ne.requestStart),
      criticalCHRestart: String(ne.criticalCHRestart),
      firstInterimResponseStart: String(ne.firstInterimResponseStart),
      responseStart: String(ne.responseStart),
      responseEnd: String(ne.responseEnd),
      unloadStart: String(ne.unloadStart),
      unloadEnd: String(ne.unloadEnd),
      domInteractive: String(ne.domInteractive),
      domComplete: String(ne.domComplete),
      loadStart: String(ne.loadStart),
      loadEnd: String(ne.loadEnd),
    });
  }
  if (data.paint.length > 0) {
    await pen.insert(paintEntries).values(
      data.paint.map((e) => ({
        ...cc,
        ...e,
        duration: String(e.duration),
        startTime: String(e.startTime),
      })),
    );
  }
  if (data.resource.length > 0) {
    await pen.insert(resourceEntries).values(
      data.resource.map((e) => ({
        ...cc,
        ...e,
        duration: String(e.duration),
        redirectStart: String(e.redirectStart),
        redirectEnd: String(e.redirectEnd),
        workerStart: String(e.workerStart),
        fetchStart: String(e.fetchStart),
        domainLookupStart: String(e.domainLookupStart),
        domainLookupEnd: String(e.domainLookupEnd),
        connectStart: String(e.connectStart),
        secureConnectionStart: String(e.secureConnectionStart),
        connectEnd: String(e.connectEnd),
        requestStart: String(e.requestStart),
        firstInterimResponseStart: String(e.firstInterimResponseStart),
        responseStart: String(e.responseStart),
        responseEnd: String(e.responseEnd),
      })),
    );
  }
}

async function postSilverEventMessage(
  pen: DBPen,
  data: SilverEventMessage,
  clientId: string,
  connectionId: string,
) {
  const cc = { clientId, connectionId };
  await pen.insert(heartbeatEntries).values({
    ...cc,
    pageURL: data.pageURL,
    realTimestamp: data.realTimestamp,
  });
  if (data.tabVisibilityEvents.length > 0) {
    await pen.insert(tabVisibilityEntries).values(
      data.tabVisibilityEvents.map((e) => ({
        ...cc,
        visibility: e.visibility,
        realTimestamp: e.realTimestamp,
      })),
    );
  }
  const ne = data.navigation;
  if (ne) {
    await pen.insert(navigationEntries).values({
      ...cc,
      ...ne,
      duration: String(ne.duration),
      redirectStart: String(ne.redirectStart),
      redirectEnd: String(ne.redirectEnd),
      workerStart: String(ne.workerStart),
      activationStart: String(ne.activationStart),
      fetchStart: String(ne.fetchStart),
      domainLookupStart: String(ne.domainLookupStart),
      domainLookupEnd: String(ne.domainLookupEnd),
      connectStart: String(ne.connectStart),
      secureConnectionStart: String(ne.secureConnectionStart),
      connectEnd: String(ne.connectEnd),
      requestStart: String(ne.requestStart),
      criticalCHRestart: String(ne.criticalCHRestart),
      firstInterimResponseStart: String(ne.firstInterimResponseStart),
      responseStart: String(ne.responseStart),
      responseEnd: String(ne.responseEnd),
      unloadStart: String(ne.unloadStart),
      unloadEnd: String(ne.unloadEnd),
      domInteractive: String(ne.domInteractive),
      domComplete: String(ne.domComplete),
      loadStart: String(ne.loadStart),
      loadEnd: String(ne.loadEnd),
    });
  }
}

async function postBronzeEventMessage(
  pen: DBPen,
  data: BronzeEventMessage,
  clientId: string,
  connectionId: string,
) {
  const cc = { clientId, connectionId };
  await pen.insert(heartbeatEntries).values({
    ...cc,
    pageURL: data.pageURL,
    realTimestamp: data.realTimestamp,
  });
}
