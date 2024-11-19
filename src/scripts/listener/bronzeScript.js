var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function sendPost(data) {
    fetch("https://www.inmeasure.com/api/v1/listener/{{APIKEY}}/{{CONNECTIONID}}", {
        method: "POST",
        body: JSON.stringify(Object.assign(Object.assign({}, data), { realTimestamp: Date.now() })),
    }).catch((err) => console.error("Failed to send data:", err));
}
function emptyNewData() {
    newData.pageURL = "";
    newData.realTimestamp = 0;
}
// * Mini Getter Functions
function getIPAddress() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => data.ip);
    });
}
function recordPageChange() {
    // Function to handle URL changes
    function handleUrlChange(url) {
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
function postData() {
    return __awaiter(this, void 0, void 0, function* () {
        const initialMessage = {
            ipAddress: yield getIPAddress(),
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
    });
}
// * Main
const newData = {
    pageURL: "",
    realTimestamp: 0,
};
getEngagementData();
postData();
