var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This method decorator for Asynchronous methods allow multiple calls to the same method without
     * executing the content function more than one time.
     * Each call after first, and until the Promise wasn't resolved succesfully, returns the previous instance of promise.
     * When the function resolves or rejects the Promise then clear the current instance
     */
    function PromiseOnce(target, pName, descriptor) {
        var pNamePromise = "_(" + pName + ")Promise";
        if (descriptor == null) {
            descriptor = Object.getOwnPropertyDescriptor(target, pName);
        }
        var old_fn = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var self = this;
            if (self[pNamePromise] == null) {
                var retval = old_fn.apply(self, args);
                if (retval instanceof Promise) {
                    self[pNamePromise] = retval;
                    self[pNamePromise].then(function () { self[pNamePromise] = null; }).catch(function () { self[pNamePromise] = null; });
                }
                else {
                    return retval;
                }
            }
            return self[pNamePromise];
        };
    }
    exports.PromiseOnce = PromiseOnce;
    function serializeKeys(obj, methodName, args) {
        try {
            return methodName + "_" + JSON.stringify(args);
        }
        catch (err) {
            throw new Error("Unable to serialize arguments");
        }
    }
    function promiseCache(cacheKey) {
        if (cacheKey === void 0) { cacheKey = null; }
        return function (target, propertyKey, descriptor) {
            var methodName = propertyKey;
            var pdesc = descriptor || Object.getOwnPropertyDescriptor(target, propertyKey);
            var old_method = pdesc.value;
            pdesc.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    var _self, key, cacheRepos, cacheRepo, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _self = this;
                                if (typeof _self === "function") {
                                    _self = _self.prototype;
                                }
                                else {
                                    _self = _self.constructor.prototype;
                                }
                                key = cacheKey !== null ? cacheKey : serializeKeys(_self, methodName, args);
                                if (_self.$$cache === undefined) {
                                    _self.$$cache = {};
                                }
                                cacheRepos = _self.$$cache;
                                // se non ho un repositori per la cache nell'oggetto allora lo creo
                                if (cacheRepos[key] === undefined || (cacheRepos[key].value === undefined && cacheRepos[key].promise === undefined)) {
                                    cacheRepos[key] = {
                                        value: undefined,
                                        promise: undefined
                                    };
                                    cacheRepos[key].promise = old_method.apply(this, args);
                                    if (!(cacheRepos[key].promise instanceof Promise)) {
                                        throw new Error("PromiseCache decorator can only be used in async methods (methods that returns Promise)");
                                    }
                                }
                                cacheRepo = cacheRepos[key];
                                if (!(cacheRepo.value === undefined)) return [3 /*break*/, 2];
                                _a = cacheRepo;
                                return [4 /*yield*/, cacheRepo.promise];
                            case 1:
                                _a.value = _b.sent();
                                return [2 /*return*/, cacheRepo.value];
                            case 2: return [2 /*return*/, cacheRepo.value];
                        }
                    });
                });
            };
            return pdesc;
        };
    }
    function PromiseCache(p1, propertyKey, descriptor) {
        if (p1 === void 0) { p1 = null; }
        if (p1 === null || typeof p1 === "string") {
            return promiseCache(p1);
        }
        else {
            return promiseCache()(p1, propertyKey, descriptor);
        }
    }
    exports.PromiseCache = PromiseCache;
});
//# sourceMappingURL=promise-decorators.js.map