var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
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
recordStandardMessage();
