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
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch("http://localhost:3000/api/v1/listener/{{APIKEY}}/{{CONNECTIONID}}", {
            method: "POST",
            body: JSON.stringify(Object.assign(Object.assign({}, data), { realTimestamp: Date.now() })),
        });
    });
}
function getEventEntryItems(entry) {
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
    hasNewData = false;
}
// * Mini Getter Functions
function getIPAddress() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => data.ip);
    });
}
function getHasTouchScreen() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
function recordPageChange() {
    // Function to handle URL changes
    function handleUrlChange(url) {
        newData.pageURL = url;
        hasNewData = true;
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
        hasNewData = true;
    });
}
function startEventsObserver() {
    // Start Observations
    const observer = new PerformanceObserver((list) => list.getEntries().forEach((entry) => {
        const newEntry = getEventEntryItems(entry);
        newData.navigation = newEntry;
        hasNewData = true;
    }));
    observer.observe({ type: "navigation", buffered: true });
}
function startManualEventsObserver() {
    const observerCheckup = setInterval(() => {
        const entry = performance.getEntriesByType("navigation")[0];
        if ((entry === null || entry === void 0 ? void 0 : entry.duration) && entry.duration > 0) {
            const newEntry = getEventEntryItems(entry);
            newData.navigation = newEntry;
            hasNewData = true;
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
    }
    else {
        startManualEventsObserver();
    }
}
// Engagement Listener (duration of visit)
function getEngagementData() {
    recordTabHidden();
    recordPageChange();
}
function postData() {
    return __awaiter(this, void 0, void 0, function* () {
        const initialMessage = {
            ipAddress: yield getIPAddress(),
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            hasTouchScreen: getHasTouchScreen(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: "platform" in navigator ? navigator.platform : null,
            appVersion: "appVersion" in navigator ? navigator.appVersion : null,
            source: document.referrer,
            pageURL: window.location.href,
            performanceTimestamp: performance.now(),
            realTimestamp: 0,
        };
        yield sendPost(initialMessage);
        // Send Every 10 Seconds
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield sendPost(newData);
            emptyNewData();
        }), 10000);
    });
}
// * Main
const newData = {
    tabVisibilityEvents: [],
    navigation: null,
    pageURL: "",
    realTimestamp: 0,
};
let hasNewData = false;
getPerformanceData();
getEngagementData();
postData();
