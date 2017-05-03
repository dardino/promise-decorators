/**
 * This method decorator for Asynchronous methods allow multiple calls to the same method without
 * executing the content function more than one time.
 * Each call after first, and until the Promise wasn't resolved succesfully, returns the previous instance of promise.
 * When the function resolves or rejects the Promise then clear the current instance
 */
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
});
//# sourceMappingURL=promise-tools.js.map