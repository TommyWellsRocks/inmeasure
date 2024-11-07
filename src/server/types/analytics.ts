export interface BrowserMessage {
  ipAddress: string;
  windowWidth: number;
  windowHeight: number;
  hasTouchScreen: boolean;
  userAgent: string;
  language: string;
  platform: string | null;
  appVersion: string | null;
  source: string;
  pageURL: string;
  performanceTimestamp: number;
  realTimestamp: number;
}

export interface GoldEventMessage {
  resource: resourceEvent[];
  navigation: navigationEvent | null;
  paint: paintEvent[];
  "largest-contentful-paint": largestContentfulPaintEvent[];
  "layout-shift": layoutShiftEvent[];
  mouseMoveEvents: mouseMoveEvent[];
  scrollEvents: scrollEvent[];
  clickEvents: clickEvent[];
  keyEvents: keyEvent[];
  resizeEvents: resizeEvent[];
  tabVisibilityEvents: tabVisibilityEvent[];
  pageURL: string;
  realTimestamp: number;
}

export interface SilverEventMessage {
  navigation: navigationEvent | null;
  tabVisibilityEvents: tabVisibilityEvent[];
  pageURL: string;
  realTimestamp: number;
}

export interface BronzeEventMessage {
  pageURL: string;
  realTimestamp: number;
}

// Performance Events
interface resourceEvent {
  name: string;
  initiatorType: string;
  deliveryType: string;
  blockingStatus: string;
  networkProtocol: string;
  responseStatus: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  duration: number;
  redirectStart: number;
  redirectEnd: number;
  workerStart: number;
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  secureConnectionStart: number;
  connectEnd: number;
  requestStart: number;
  firstInterimResponseStart: number;
  responseStart: number;
  responseEnd: number;
}

interface navigationEvent {
  name: string;
  initiatorType: string;
  type: string;
  deliveryType: string;
  notRestoredReasons: string;
  networkProtocol: string;
  redirectCount: number;
  responseStatus: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  duration: number;
  redirectStart: number;
  redirectEnd: number;
  workerStart: number;
  activationStart: number;
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  secureConnectionStart: number;
  connectEnd: number;
  requestStart: number;
  criticalCHRestart: number;
  firstInterimResponseStart: number;
  responseStart: number;
  unloadStart: number;
  unloadEnd: number;
  responseEnd: number;
  domInteractive: number;
  domComplete: number;
  loadStart: number;
  loadEnd: number;
}

interface paintEvent {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

interface largestContentfulPaintEvent {
  url: string;
  size: number;
  duration: number;
  loadTime: number;
  startTime: number;
  renderTime: number;
}

interface layoutShiftEvent {
  startTime: number;
  value: number;
  duration: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  previousRect: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  currentRect: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Engagement Events
interface mouseMoveEvent {
  x: number;
  y: number;
  realTimestamp: number;
}

interface scrollEvent {
  scrollX: number;
  scrollY: number;
  realTimestamp: number;
}

interface clickEvent {
  clickX: number;
  clickY: number;
  tagName: string | null;
  id: string | null;
  realTimestamp: number;
}

interface keyEvent {
  key: string;
  realTimestamp: number;
}

interface resizeEvent {
  windowWidth: number;
  windowHeight: number;
  realTimestamp: number;
}

interface tabVisibilityEvent {
  visibility: string;
  realTimestamp: number;
}
