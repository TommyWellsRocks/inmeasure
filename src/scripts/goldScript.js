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
function getEventEntryItems(eventType, entry) {
    if (eventType === "resource") {
        return {
            name: entry.name,
            initiatorType: entry.initiatorType,
            deliveryType: entry.deliveryType,
            blockingStatus: entry.renderBlockingStatus,
            networkProtocol: entry.nextHopProtocol,
            responseStatus: entry.responseStatus,
            transferSize: entry.transferSize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize,
            serverTiming: entry.serverTiming,
            duration: entry.duration,
            redirectStart: entry.redirectStart,
            redirectEnd: entry.redirectEnd,
            workerStart: entry.workerStart,
            fetchStart: entry.fetchStart,
            domainLookupStart: entry.domainLookupStart,
            domainLookupEnd: entry.domainLookupEnd,
            connectStart: entry.connectStart,
            secureConnectionStart: entry.secureConnectionStart,
            connectEnd: entry.connectEnd,
            requestStart: entry.requestStart,
            firstInterimResponseStart: entry.firstInterimResponseStart,
            responseStart: entry.responseStart,
            responseEnd: entry.responseEnd,
        };
    }
    else if (eventType === "navigation") {
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
    else if (eventType === "paint") {
        return {
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
        };
    }
    else if (eventType === "largest-contentful-paint") {
        return {
            url: entry.url,
            size: entry.size,
            duration: entry.duration,
            loadTime: entry.loadTime,
            startTime: entry.startTime,
            renderTime: entry.renderTime,
            firstAnimatedFrameTime: entry.firstAnimatedFrameTime,
        };
    }
    else if (eventType === "layout-shift") {
        return {
            startTime: entry.startTime,
            value: entry.value,
            duration: entry.duration,
            hadRecentInput: entry.hadRecentInput,
            lastInputTime: entry.lastInputTime,
            previousRect: {
                x: entry.sources[0].previousRect.x,
                y: entry.sources[0].previousRect.y,
                width: entry.sources[0].previousRect.width,
                height: entry.sources[0].previousRect.height,
                top: entry.sources[0].previousRect.top,
                right: entry.sources[0].previousRect.right,
                bottom: entry.sources[0].previousRect.bottom,
                left: entry.sources[0].previousRect.left,
            },
            currentRect: {
                x: entry.sources[0].currentRect.x,
                y: entry.sources[0].currentRect.y,
                width: entry.sources[0].currentRect.width,
                height: entry.sources[0].currentRect.height,
                top: entry.sources[0].currentRect.top,
                right: entry.sources[0].currentRect.right,
                bottom: entry.sources[0].currentRect.bottom,
                left: entry.sources[0].currentRect.left,
            },
        };
    }
    else {
        return entry;
    }
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
function emptyNewData() {
    newData.clickEvents = [];
    newData.keyEvents = [];
    newData.mouseMoveEvents = [];
    newData.tabVisibilityEvents = [];
    newData.scrollEvents = [];
    newData.resizeEvents = [];
    newData.navigation = null;
    newData.resource = [];
    newData["layout-shift"] = [];
    newData.paint = [];
    newData["largest-contentful-paint"] = [];
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
function recordMouseMovement() {
    const throttledMouseMove = throttle((e) => {
        const newEvent = {
            x: e.pageX,
            y: e.pageY,
            realTimestamp: Date.now(),
        };
        newData.mouseMoveEvents.push(newEvent);
        hasNewData = true;
    }, 200);
    document.addEventListener("mousemove", throttledMouseMove);
}
function recordScrollMovement() {
    const throttledScroll = throttle(() => {
        const newEvent = {
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            realTimestamp: Date.now(),
        };
        newData.scrollEvents.push(newEvent);
        hasNewData = true;
    }, 200);
    window.addEventListener("scroll", throttledScroll);
}
function recordClicks() {
    document.addEventListener("click", (e) => {
        const isHTMLElement = e.target instanceof HTMLElement;
        const newEvent = {
            clickX: e.clientX,
            clickY: e.clientY,
            tagName: isHTMLElement ? e.target.tagName : null,
            id: isHTMLElement ? e.target.id : null,
            realTimestamp: Date.now(),
        };
        newData.clickEvents.push(newEvent);
        hasNewData = true;
    });
}
function recordKeys() {
    document.addEventListener("keydown", (e) => {
        const newEvent = { key: e.key, realTimestamp: Date.now() };
        newData.keyEvents.push(newEvent);
        hasNewData = true;
    });
}
function recordResize() {
    window.addEventListener("resize", () => {
        const newEvent = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            realTimestamp: Date.now(),
        };
        newData.resizeEvents.push(newEvent);
        hasNewData = true;
    });
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
function startEventsObserver(eventTypes) {
    eventTypes.forEach((type) => {
        // Start Observations
        const observer = new PerformanceObserver((list) => list.getEntries().forEach((entry) => {
            const entryType = entry.entryType;
            const newEntry = getEventEntryItems(entryType, entry);
            if (entryType === "navigation") {
                newData.navigation = newEntry;
            }
            else {
                newData[entryType].push(newEntry);
            }
            hasNewData = true;
        }));
        observer.observe({ type, buffered: true });
    });
}
function startManualEventsObserver(eventTypes) {
    const performanceDataCount = {
        resource: 0,
        navigation: 0,
        paint: 0,
        "largest-contentful-paint": 0,
        "layout-shift": 0,
    };
    setInterval(() => {
        eventTypes.forEach((type) => {
            if (!(type === "largest-contentful-paint" || type === "layout-shift")) {
                const allEntries = performance.getEntriesByType(type);
                if (type === "navigation" && performanceDataCount.navigation < 1) {
                    const newEntry = getEventEntryItems(type, allEntries[0]);
                    newData.navigation = newEntry;
                    performanceDataCount.navigation++;
                    hasNewData = true;
                }
                else if (!(type === "navigation")) {
                    // Get acknowledged events length, send difference (only un-acknowledged)
                    const newEntries = allEntries
                        .slice(performanceDataCount[type])
                        .map((entry) => getEventEntryItems(type, entry));
                    if (newData[type] !== newEntries) {
                        newData[type] = newEntries;
                        performanceDataCount[type] += newEntries.length;
                        hasNewData = true;
                    }
                }
            }
        });
    }, 5000);
}
// * Main Getter Function
// Event Listener (duration of visit)
function getPerformanceData() {
    const entryTypes = [
        "resource",
        "navigation", // Single Item
        "paint",
        "largest-contentful-paint", // Not in manual
        "layout-shift", // Not in manual
    ];
    // Performance Observer if possible, else get events onUnload
    if ("PerformanceObserver" in window) {
        startEventsObserver(entryTypes);
    }
    else {
        startManualEventsObserver(entryTypes);
    }
}
// Engagement Listener (duration of visit)
function getEngagementData() {
    recordMouseMovement();
    recordScrollMovement();
    recordClicks();
    recordKeys();
    recordResize();
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
        // Send Every 10 Seconds (If NewData)
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (hasNewData) {
                yield sendPost(newData);
                emptyNewData();
            }
        }), 10000);
    });
}
// * Main
const newData = {
    clickEvents: [],
    keyEvents: [],
    mouseMoveEvents: [],
    tabVisibilityEvents: [],
    scrollEvents: [],
    resizeEvents: [],
    navigation: null,
    resource: [],
    "layout-shift": [],
    paint: [],
    "largest-contentful-paint": [],
    pageURL: "",
    realTimestamp: 0,
};
let hasNewData = false;
getPerformanceData();
getEngagementData();
postData();
