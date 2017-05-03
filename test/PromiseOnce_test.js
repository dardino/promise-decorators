var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../dist/promise-tools"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var promise_tools_1 = require("../dist/promise-tools");
    var ClassWithPromise = (function () {
        function ClassWithPromise() {
            this.CallCounter = 0;
            this.CallCounter2 = 0;
        }
        ClassWithPromise.prototype.MetodoPromise = function () {
            this.CallCounter++;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(true);
                }, 5000);
            });
        };
        ClassWithPromise.prototype.MetodoPromise2 = function () {
            this.CallCounter2++;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(false);
                }, 5000);
            });
        };
        return ClassWithPromise;
    }());
    __decorate([
        promise_tools_1.PromiseOnce,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ClassWithPromise.prototype, "MetodoPromise", null);
    describe("Test no PromiseOnce", function () {
        var cp = new ClassWithPromise();
        var p1 = cp.MetodoPromise2();
        var p2 = cp.MetodoPromise2();
        var p3 = cp.MetodoPromise2();
        var p4 = cp.MetodoPromise2();
        var x = cp.CallCounter2;
        Promise.all([p1, p2, p3, p4]).then(function (list) {
            it("all promises resolved", function () {
                expect(list.length).toBe(4);
                expect(list.every(function (f) { return f === false; })).toBe(true);
            });
        });
        it("PromiseOnce counter test", function () {
            expect(x).toBe(4);
        });
    });
    describe("Test PromiseOnce", function () {
        var cp = new ClassWithPromise();
        var p1 = cp.MetodoPromise();
        var p2 = cp.MetodoPromise();
        var p3 = cp.MetodoPromise();
        var p4 = cp.MetodoPromise();
        var x = cp.CallCounter;
        Promise.all([p1, p2, p3, p4]).then(function (list) {
            it("all promises resolved", function () {
                expect(list.length).toBe(5);
                expect(list.every(function (f) { return f === true; })).toBe(true);
                cp.MetodoPromise2();
                var x = cp.CallCounter2;
                expect(x).toBe(2);
            });
        });
        it("PromiseOnce counter test", function () {
            expect(x).toBe(1);
        });
    });
});
