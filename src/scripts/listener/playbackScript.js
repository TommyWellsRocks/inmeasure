"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function inMeasure() {
    return __awaiter(this, void 0, void 0, function () {
        function recordSession() {
            return __awaiter(this, void 0, void 0, function () {
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
                    return __awaiter(this, void 0, void 0, function () {
                        var MAX_RETRIES, RETRY_DELAY_MS, tries, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    MAX_RETRIES = 3;
                                    RETRY_DELAY_MS = 1000;
                                    tries = 1;
                                    _a.label = 1;
                                case 1:
                                    if (!(tries <= 3)) return [3 /*break*/, 8];
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, 6, 7]);
                                    return [4 /*yield*/, fetch("https://www.inmeasure.com/api/v1/recording/{{APIKEY}}/{{CONNECTIONID}}", {
                                            mode: "no-cors",
                                            method: "POST",
                                            body: JSON.stringify(recordingLog),
                                        })];
                                case 3:
                                    _a.sent();
                                    tries = MAX_RETRIES;
                                    resetRecordingLog();
                                    return [3 /*break*/, 7];
                                case 4:
                                    err_1 = _a.sent();
                                    console.error(err_1);
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, RETRY_DELAY_MS); })];
                                case 5:
                                    _a.sent();
                                    return [3 /*break*/, 7];
                                case 6:
                                    tries++;
                                    return [7 /*endfinally*/];
                                case 7: return [3 /*break*/, 1];
                                case 8: return [2 /*return*/];
                            }
                        });
                    });
                }
                function throttle(func, waitTime) {
                    var lastRan = 0;
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var now = Date.now();
                        if (now - lastRan >= waitTime) {
                            lastRan = now;
                            func.apply(void 0, args);
                        }
                    };
                }
                // * Recording Functions
                function recordMouseMovement() {
                    var throttledMouseMove = throttle(function (e) {
                        var newEvent = {
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
                    var throttledScroll = throttle(function () {
                        var newEvent = {
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
                    document.addEventListener("click", function (e) {
                        var isHTMLElement = e.target instanceof HTMLElement;
                        var newEvent = {
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
                    document.addEventListener("keydown", function (e) {
                        var newEvent = { key: e.key, perfTimestamp: performance.now() };
                        recordingLog.keyEvents.push(newEvent);
                        hasRecordingLog = true;
                    });
                }
                function recordResize() {
                    window.addEventListener("resize", function () {
                        var newEvent = {
                            windowWidth: window.innerWidth,
                            windowHeight: window.innerHeight,
                            perfTimestamp: performance.now(),
                        };
                        recordingLog.resizeEvents.push(newEvent);
                        hasRecordingLog = true;
                    });
                }
                function recordTabHidden() {
                    document.addEventListener("visibilitychange", function () {
                        var newEvent = {
                            visibility: document.visibilityState,
                            perfTimestamp: performance.now(),
                        };
                        recordingLog.tabVisibilityEvents.push(newEvent);
                        hasRecordingLog = true;
                    });
                }
                var recordingLog, hasRecordingLog;
                var _this = this;
                return __generator(this, function (_a) {
                    recordingLog = {
                        clickEvents: [],
                        keyEvents: [],
                        mouseMoveEvents: [],
                        tabVisibilityEvents: [],
                        scrollEvents: [],
                        resizeEvents: [],
                    };
                    hasRecordingLog = false;
                    // * Main
                    recordMouseMovement();
                    recordScrollMovement();
                    recordClicks();
                    recordKeys();
                    recordResize();
                    recordTabHidden();
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!hasRecordingLog) return [3 /*break*/, 2];
                                    return [4 /*yield*/, sendRecordingLog()];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); }, 10000); // Send Data Every 10 Seconds
                    return [2 /*return*/];
                });
            });
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, recordSession()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
inMeasure();
