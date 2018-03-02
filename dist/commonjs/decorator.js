"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var Observable_1 = require("rxjs/Observable");
var Subscription_1 = require("rxjs/Subscription");
var store_1 = require("./store");
function connectTo(settings) {
    var store = aurelia_dependency_injection_1.Container.instance.get(store_1.Store);
    return function (target) {
        var originalBind = target.prototype.bind;
        var originalUnbind = target.prototype.unbind;
        target.prototype.bind = function () {
            var _this = this;
            var source = store.state;
            if (typeof settings === "function") {
                var selector = settings(store);
                if (selector instanceof Observable_1.Observable) {
                    source = selector;
                }
            }
            this._stateSubscription = source.subscribe(function (state) { return _this.state = state; });
            if (originalBind) {
                originalBind.apply(this, arguments);
            }
        };
        target.prototype.unbind = function () {
            if (this._stateSubscription &&
                this._stateSubscription instanceof Subscription_1.Subscription &&
                this._stateSubscription.closed === false) {
                this._stateSubscription.unsubscribe();
            }
            if (originalUnbind) {
                originalUnbind.apply(this, arguments);
            }
        };
    };
}
exports.connectTo = connectTo;
//# sourceMappingURL=decorator.js.map