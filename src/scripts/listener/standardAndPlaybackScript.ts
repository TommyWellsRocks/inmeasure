import type {
  DurationMessage,
  StandardMessage,
  SessionRecordingMessage,
} from "~/server/types/scripts";

async function inMeasure() {
  async function recordDuration() {
    const durationLog: DurationMessage = {
      pageURL: [],
      timestamp: Date.now(),
    };

    async function sendDurationLog() {
      const MAX_RETRIES = 3;
      const RETRY_DELAY_MS = 1000;
      let tries = 1;

      while (tries <= 3) {
        try {
          await fetch(
            "https://www.inmeasure.com/api/v1/duration/{{APIKEY}}/{{CONNECTIONID}}",
            {
              mode: "no-cors",
              method: "POST",
              body: JSON.stringify(durationLog),
            },
          );
          tries = MAX_RETRIES;
          resetDurationLog();
        } catch (err) {
          console.error(err);
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        } finally {
          tries++;
        }
      }
    }

    function recordPageURL() {
      // Function to handle URL changes
      function handleUrlChange(url: string) {
        durationLog.pageURL.push({ url, perfTimestamp: performance.now() });
      }

      // Initial URL log
      handleUrlChange(window.location.href);

      // Listen for popstate events (back/forward navigation
      window.addEventListener("popstate", () =>
        handleUrlChange(window.location.href),
      );

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

    function resetDurationLog() {
      durationLog.pageURL = [];
      durationLog.timestamp = Date.now();
    }

    // * Main
    recordPageURL();
    await sendDurationLog();
    setInterval(async () => await sendDurationLog(), 10000); // Send Data Every 10 Seconds
  }
  await recordDuration();

  async function recordStandard() {
    async function sendStandardLog(message: StandardMessage) {
      const MAX_RETRIES = 3;
      const RETRY_DELAY_MS = 1000;
      let tries = 1;

      while (tries <= 3) {
        try {
          await fetch(
            "https://www.inmeasure.com/api/v1/standard/{{APIKEY}}/{{CONNECTIONID}}",
            {
              mode: "no-cors",
              method: "POST",
              body: JSON.stringify(message),
            },
          );
          tries = MAX_RETRIES;
        } catch (err) {
          console.error(err);
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        } finally {
          tries++;
        }
      }
    }

    // * Recording Functions

    async function getIPAddress(): Promise<string> {
      return await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => data.ip);
    }

    function getPageLoadTime(): Promise<number | null> {
      return new Promise((resolve) => {
        // Use Performance
        if (performance) {
          // getEntry Method If Possible
          if (performance.getEntriesByType) {
            const navEntries = performance.getEntriesByType("navigation");
            if (navEntries.length >= 1 && navEntries[0]!.duration > 0) {
              resolve(navEntries[0]!.duration);
            }
            // Try Performance Timing (Depreciated)
          } else if (
            performance.timing?.loadEventEnd &&
            performance.timing?.navigationStart
          ) {
            const loadTime =
              performance.timing.loadEventEnd -
              performance.timing.navigationStart;
            if (loadTime > 0) {
              resolve(loadTime);
            }
          }
          // Otherwise Return Null
        } else {
          resolve(null);
        }
      });
    }

    function getTimeToFirstInteraction(): Promise<number> {
      const events = ["mousemove", "scroll", "click", "keydown"];
      let firstEventTimestamp = 0;

      return new Promise((resolve) => {
        function onEvent(e: Event) {
          if (!firstEventTimestamp) {
            firstEventTimestamp = e.timeStamp;
            cleanup();
          }
        }
        function cleanup() {
          events.forEach((e) => window.removeEventListener(e, onEvent));
          resolve(firstEventTimestamp);
        }

        // Add Listeners
        events.forEach((e) => window.addEventListener(e, onEvent));

        // Return Null If No Interactions After 5 seconds
        setTimeout(cleanup, 5000);
      });
    }

    // * Main

    const [ipAddress, timeToPageLoad] = await Promise.all([
      getIPAddress(),
      getPageLoadTime(),
    ]);

    const standardMessage: StandardMessage = {
      ipAddress,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      hasTouchScreen: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: "platform" in navigator ? navigator.platform : null,
      appVersion: "appVersion" in navigator ? navigator.appVersion : null,
      source: document.referrer,
      timeToPageLoad,
      timeToFirstInteraction: await getTimeToFirstInteraction(),
      perfTimestamp: performance.now(),
    };

    sendStandardLog(standardMessage);
  }
  await recordStandard();

  async function recordSession() {
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

    // * Main
    recordMouseMovement();
    recordScrollMovement();
    recordClicks();
    recordKeys();
    recordResize();
    recordTabHidden();

    setInterval(async () => {
      if (hasRecordingLog) await sendRecordingLog();
    }, 10000); // Send Data Every 10 Seconds
  }
  await recordSession();
}

inMeasure();
