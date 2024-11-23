import type { DurationMessage, StandardMessage } from "~/server/types/scripts";

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
}

inMeasure();
