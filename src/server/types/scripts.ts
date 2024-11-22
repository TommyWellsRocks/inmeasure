import { readFile } from "fs/promises";

export const [
  copyScript,
  durationScript,
  standardScript,
  sessionRecordingScript,
] = await Promise.all([
  readFile("src/scripts/get/copyScript.js", "utf-8"),
  readFile("src/scripts/listener/recordDuration.js", "utf-8"),
  readFile("src/scripts/listener/recordStandard.js", "utf-8"),
  readFile("src/scripts/listener/recordSession.js", "utf-8"),
]);

export interface StandardMessage {
  ipAddress: string;
  windowWidth: number;
  windowHeight: number;
  hasTouchScreen: boolean;
  userAgent: string;
  language: string;
  platform: string | null;
  appVersion: string | null;
  source: string;
  timeToPageLoad: number | null; // Must Wait
  timeToFirstInteraction: number | null; // Null if > _ seconds
  perfTimestamp: number;
}

export interface DurationMessage {
  pageURL: { url: string; perfTimestamp: number }[];
  timestamp: number;
}

export interface SessionRecordingMessage {
  mouseMoveEvents: mouseMoveEvent[];
  scrollEvents: scrollEvent[];
  clickEvents: clickEvent[];
  keyEvents: keyEvent[];
  resizeEvents: resizeEvent[];
  tabVisibilityEvents: tabVisibilityEvent[];
}

// -------------------------------------

// Engagement Events
interface mouseMoveEvent {
  x: number;
  y: number;
  perfTimestamp: number;
}

interface scrollEvent {
  scrollX: number;
  scrollY: number;
  perfTimestamp: number;
}

interface clickEvent {
  clickX: number;
  clickY: number;
  elementTag: string | null;
  elementId: string | null;
  perfTimestamp: number;
}

interface keyEvent {
  key: string;
  perfTimestamp: number;
}

interface resizeEvent {
  windowWidth: number;
  windowHeight: number;
  perfTimestamp: number;
}

interface tabVisibilityEvent {
  visibility: string;
  perfTimestamp: number;
}
