import type { SessionRecordingMessage } from "~/server/types/scripts";

const recordingLog: SessionRecordingMessage = {
  clickEvents: [],
  keyEvents: [],
  mouseMoveEvents: [],
  tabVisibilityEvents: [],
  scrollEvents: [],
  resizeEvents: [],
};
let hasRecordingLog = false;

function resetRecordingLog() {
  recordingLog.clickEvents = [];
  recordingLog.keyEvents = [];
  recordingLog.mouseMoveEvents = [];
  recordingLog.tabVisibilityEvents = [];
  recordingLog.scrollEvents = [];
  recordingLog.resizeEvents = [];
  hasRecordingLog = false;
}

async function sendRecordingLog() {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1000;
  let tries = 1;

  while (tries <= 3) {
    try {
      await fetch(
        "https://www.inmeasure.com/api/v1/recording/{{APIKEY}}/{{CONNECTIONID}}",
        {
          mode: "no-cors",
          method: "POST",
          body: JSON.stringify(recordingLog),
        },
      );
      tries = MAX_RETRIES;
      resetRecordingLog();
    } catch (err) {
      console.error(err);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    } finally {
      tries++;
    }
  }
}

function throttle(func: (...args: any[]) => void, waitTime: number) {
  let lastRan = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastRan >= waitTime) {
      lastRan = now;
      func(...args);
    }
  };
}

// * Recording Functions

function recordMouseMovement() {
  const throttledMouseMove = throttle((e: MouseEvent) => {
    const newEvent = {
      x: e.pageX,
      y: e.pageY,
      perfTimestamp: performance.now(),
    };
    recordingLog.mouseMoveEvents.push(newEvent);
    hasRecordingLog = true;
  }, 200);

  document.addEventListener("mousemove", throttledMouseMove);
}

function recordScrollMovement() {
  const throttledScroll = throttle(() => {
    const newEvent = {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      perfTimestamp: performance.now(),
    };
    recordingLog.scrollEvents.push(newEvent);
    hasRecordingLog = true;
  }, 200);

  window.addEventListener("scroll", throttledScroll);
}

function recordClicks() {
  document.addEventListener("click", (e) => {
    const isHTMLElement = e.target instanceof HTMLElement;
    const newEvent = {
      clickX: e.clientX,
      clickY: e.clientY,
      elementTag: isHTMLElement ? e.target.tagName : null,
      elementId: isHTMLElement ? e.target.id : null,
      perfTimestamp: performance.now(),
    };

    recordingLog.clickEvents.push(newEvent);
    hasRecordingLog = true;
  });
}

function recordKeys() {
  document.addEventListener("keydown", (e) => {
    const newEvent = { key: e.key, perfTimestamp: performance.now() };

    recordingLog.keyEvents.push(newEvent);
    hasRecordingLog = true;
  });
}

function recordResize() {
  window.addEventListener("resize", () => {
    const newEvent = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      perfTimestamp: performance.now(),
    };

    recordingLog.resizeEvents.push(newEvent);
    hasRecordingLog = true;
  });
}

function recordTabHidden() {
  document.addEventListener("visibilitychange", () => {
    const newEvent = {
      visibility: document.visibilityState,
      perfTimestamp: performance.now(),
    };

    recordingLog.tabVisibilityEvents.push(newEvent);
    hasRecordingLog = true;
  });
}

function startSessionRecording() {
  recordMouseMovement();
  recordScrollMovement();
  recordClicks();
  recordKeys();
  recordResize();
  recordTabHidden();
}

// * Main
startSessionRecording();

setInterval(() => {
  if (hasRecordingLog) sendRecordingLog();
}, 10000); // Send Data Every 10 Seconds
