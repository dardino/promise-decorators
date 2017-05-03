System.register(["../dist/promise-tools"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __moduleName = context_1 && context_1.id;
    var promise_tools_1, ClassWithPromise;
    return {
        setters: [
            function (promise_tools_1_1) {
                promise_tools_1 = promise_tools_1_1;
            }
        ],
        execute: function () {
            ClassWithPromise = (function () {
                function ClassWithPromise() {
                    this.CallCounter = 0;
                }
                ClassWithPromise.prototype.MetodoPromise = function () {
                    this.CallCounter++;
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(true);
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
            describe("Hello World Server", function () {
                var a;
                it("and so is a spec", function () {
                    a = true;
                    expect(a).toBe(true);
                });
            });
        }
    };
});
