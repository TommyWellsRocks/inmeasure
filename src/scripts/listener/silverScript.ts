import type {
  SilverEventMessage,
  BrowserMessage,
} from "~/server/types/analytics";

function sendPost(data: BrowserMessage | SilverEventMessage) {
  fetch("https://www.inmeasure.com/api/v1/listener/{{APIKEY}}/{{CONNECTIONID}}", {
    method: "POST",
    body: JSON.stringify({ ...data, realTimestamp: Date.now() }),
  }).catch((err) => console.error("Failed to send data:", err));
}

function getEventEntryItems(entry: any) {
  return {
    name: entry.name,
    initiatorType: entry.initiatorType,
    type: entry.type,
    deliveryType: entry.deliveryType,
    notRestoredReasons: entry.notRestoredReasons,
    networkProtocol: entry.nextHopProtocol,
    redirectCount: entry.redirectCount,
    responseStatus: entry.responseStatus,
    transferSize: entry.transferSize,
    encodedBodySize: entry.encodedBodySize,
    decodedBodySize: entry.decodedBodySize,
    serverTiming: entry.serverTiming,
    duration: entry.duration,
    redirectStart: entry.redirectStart,
    redirectEnd: entry.redirectEnd,
    workerStart: entry.workerStart,
    activationStart: entry.activationStart,
    fetchStart: entry.fetchStart,
    domainLookupStart: entry.domainLookupStart,
    domainLookupEnd: entry.domainLookupEnd,
    connectStart: entry.connectStart,
    secureConnectionStart: entry.secureConnectionStart,
    connectEnd: entry.connectEnd,
    requestStart: entry.requestStart,
    criticalCHRestart: entry.criticalCHRestart,
    firstInterimResponseStart: entry.firstInterimResponseStart,
    responseStart: entry.responseStart,
    unloadStart: entry.unloadEventStart,
    unloadEnd: entry.unloadEventEnd,
    responseEnd: entry.responseEnd,
    domInteractive: entry.domInteractive,
    domComplete: entry.domComplete,
    loadStart: entry.loadEventStart,
    loadEnd: entry.loadEventEnd,
  };
}

function emptyNewData() {
  newData.navigation = null;
  newData.tabVisibilityEvents = [];
  newData.pageURL = "";
  newData.realTimestamp = 0;
}

// * Mini Getter Functions
async function getIPAddress() {
  return await fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => data.ip);
}

function recordPageChange() {
  // Function to handle URL changes
  function handleUrlChange(url: string) {
    newData.pageURL = url;
  }

  // Initial URL log
  handleUrlChange(window.location.href);

  // Listen for popstate events (back/forward navigation)
  window.onpopstate = function () {
    handleUrlChange(window.location.href);
  };

  // Monitor pushState and replaceState methods
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    handleUrlChange(window.location.href);
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    handleUrlChange(window.location.href);
  };
}

function recordTabHidden() {
  document.addEventListener("visibilitychange", () => {
    const newEvent = {
      visibility: document.visibilityState,
      realTimestamp: Date.now(),
    };

    newData.tabVisibilityEvents.push(newEvent);
  });
}

function startEventsObserver() {
  // Start Observations
  const observer = new PerformanceObserver((list) =>
    list.getEntries().forEach((entry: any) => {
      const newEntry = getEventEntryItems(entry);
      newData.navigation = newEntry;
    }),
  );
  observer.observe({ type: "navigation", buffered: true });
}

function startManualEventsObserver() {
  const observerCheckup = setInterval(() => {
    const entry = performance.getEntriesByType("navigation")[0];
    if (entry?.duration && entry.duration > 0) {
      const newEntry = getEventEntryItems(entry);
      newData.navigation = newEntry;
      clearInterval(observerCheckup);
    }
  }, 1000);
}

// * Main Getter Function
// Event Listener (duration of visit)
function getPerformanceData() {
  // Performance Observer if possible, else get events onUnload
  if ("PerformanceObserver" in window) {
    startEventsObserver();
  } else {
    startManualEventsObserver();
  }
}

// Engagement Listener (duration of visit)
function getEngagementData() {
  recordTabHidden();
  recordPageChange();
}

async function postData() {
  const initialMessage: BrowserMessage = {
    ipAddress: await getIPAddress(),
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    hasTouchScreen: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: "platform" in navigator ? navigator.platform : null,
    appVersion: "appVersion" in navigator ? navigator.appVersion : null,
    source: document.referrer,
    pageURL: window.location.href,
    performanceTimestamp: performance.now(),
    realTimestamp: 0,
  };
  sendPost(initialMessage);

  // Send Every 10 Seconds
  setInterval(() => {
    sendPost(newData);
    emptyNewData();
  }, 10000);
}

// * Main
const newData: SilverEventMessage = {
  tabVisibilityEvents: [],
  navigation: null,
  pageURL: "",
  realTimestamp: 0,
};

getPerformanceData();
getEngagementData();
postData();
