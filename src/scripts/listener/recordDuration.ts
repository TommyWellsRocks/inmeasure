import type { DurationMessage } from "~/server/types/scripts";

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
sendDurationLog();
setInterval(sendDurationLog, 10000); // Send Data Every 10 Seconds
