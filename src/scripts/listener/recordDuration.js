var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
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
setInterval(sendDurationLog, 10000); // Send Data Every 10 Seconds
