import type {
  BronzeEventMessage,
  BrowserMessage,
} from "~/server/types/analytics";

function sendPost(data: BrowserMessage | BronzeEventMessage) {
  fetch("https://www.inmeasure.com/api/v1/listener/{{APIKEY}}/{{CONNECTIONID}}", {
    mode: "no-cors",
    method: "POST",
    body: JSON.stringify({ ...data, realTimestamp: Date.now() }),
  }).catch((err) => console.error("Failed to send data:", err));
}

function emptyNewData() {
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

// * Main Getter Function
// Engagement Listener (duration of visit)
function getEngagementData() {
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
const newData: BronzeEventMessage = {
  pageURL: "",
  realTimestamp: 0,
};

getEngagementData();
postData();
