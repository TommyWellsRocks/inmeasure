export const copyScript = `(function () {
  if (!document.getElementById("im-script")) {
    const element = document.createElement("script");
    element.type = "text/javascript";
    element.async = true;
    element.src = "https://www.inmeasure.com/api/v1/script/{{APIKEY}}";
    element.id = "im-script";
    document.head.appendChild(element);
  }
})();`;
export const durationScript = `var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const durationLog = {
    pageURL: [],
    timestamp: Date.now(),
};
function sendDurationLog() {
    return __awaiter(this, void 0, void 0, function* () {
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000;
        let tries = 1;
        while (tries <= 3) {
            try {
                yield fetch("https://www.inmeasure.com/api/v1/duration/{{APIKEY}}/{{CONNECTIONID}}", {
                    mode: "no-cors",
                    method: "POST",
                    body: JSON.stringify(durationLog),
                });
                tries = MAX_RETRIES;
                resetDurationLog();
            }
            catch (err) {
                console.error(err);
                yield new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            }
            finally {
                tries++;
            }
        }
    });
}
function recordPageURL() {
    // Function to handle URL changes
    function handleUrlChange(url) {
        durationLog.pageURL.push({ url, perfTimestamp: performance.now() });
    }
    // Initial URL log
    handleUrlChange(window.location.href);
    // Listen for popstate events (back/forward navigation
    window.addEventListener("popstate", () => handleUrlChange(window.location.href));
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
setInterval(sendDurationLog, 10000); // Send Data Every 10 Seconds`;
export const standardScript = `var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function sendStandardLog(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000;
        let tries = 1;
        while (tries <= 3) {
            try {
                yield fetch("https://www.inmeasure.com/api/v1/standard/{{APIKEY}}/{{CONNECTIONID}}", {
                    mode: "no-cors",
                    method: "POST",
                    body: JSON.stringify(message),
                });
                tries = MAX_RETRIES;
            }
            catch (err) {
                console.error(err);
                yield new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            }
            finally {
                tries++;
            }
        }
    });
}
// * Recording Functions
function getIPAddress() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => data.ip);
    });
}
function getPageLoadTime() {
    return new Promise((resolve) => {
        const redoCheck = setInterval(() => {
            var _a, _b;
            // Use Performance
            if (performance) {
                // getEntry Method If Possible
                if (performance.getEntriesByType) {
                    const navEntries = performance.getEntriesByType("navigation");
                    if (navEntries.length >= 1 && navEntries[0].duration > 0) {
                        clearInterval(redoCheck);
                        resolve(navEntries[0].duration);
                    }
                    // Try Performance Timing (Depreciated)
                }
                else if (((_a = performance.timing) === null || _a === void 0 ? void 0 : _a.loadEventEnd) &&
                    ((_b = performance.timing) === null || _b === void 0 ? void 0 : _b.navigationStart)) {
                    const loadTime = performance.timing.loadEventEnd -
                        performance.timing.navigationStart;
                    if (loadTime > 0) {
                        clearInterval(redoCheck);
                        resolve(loadTime);
                    }
                }
                // Otherwise Return Null
            }
            else {
                clearInterval(redoCheck);
                resolve(null);
            }
        }, 50);
    });
}
function getTimeToFirstInteraction() {
    const events = ["mousemove", "scroll", "click", "keydown"];
    let firstEventTimestamp = null;
    return new Promise((resolve) => {
        function onEvent(e) {
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
function recordStandardMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const [ipAddress, timeToPageLoad] = yield Promise.all([
            getIPAddress(),
            getPageLoadTime(),
        ]);
        const standardMessage = {
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
            timeToFirstInteraction: yield getTimeToFirstInteraction(),
            perfTimestamp: performance.now(),
        };
        sendStandardLog(standardMessage);
    });
}
recordStandardMessage();`;
export const sessionRecordingScript = `var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const recordingLog = {
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
function sendRecordingLog() {
    return __awaiter(this, void 0, void 0, function* () {
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000;
        let tries = 1;
        while (tries <= 3) {
            try {
                yield fetch("https://www.inmeasure.com/api/v1/recording/{{APIKEY}}/{{CONNECTIONID}}", {
                    mode: "no-cors",
                    method: "POST",
                    body: JSON.stringify(recordingLog),
                });
                tries = MAX_RETRIES;
                resetRecordingLog();
            }
            catch (err) {
                console.error(err);
                yield new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            }
            finally {
                tries++;
            }
        }
    });
}
function throttle(func, waitTime) {
    let lastRan = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastRan >= waitTime) {
            lastRan = now;
            func(...args);
        }
    };
}
// * Recording Functions
function recordMouseMovement() {
    const throttledMouseMove = throttle((e) => {
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
    if (hasRecordingLog)
        sendRecordingLog();
}, 10000); // Send Data Every 10 Seconds`;

// -------------------------------------

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
