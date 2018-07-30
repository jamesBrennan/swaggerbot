"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonapiClient = require('@holidayextras/jsonapi-client');
var JSONAPICrawler = /** @class */ (function () {
    function JSONAPICrawler(base, resource, params) {
        this.client = new JsonapiClient(base);
        this.resource = resource;
        this.limit = params.limit || 50;
        this.offset = params.offset || 0;
    }
    JSONAPICrawler.prototype.next = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.find(_this.resource, { page: _this.page }, function (err, resources) {
                if (err)
                    reject(err);
                _this.increment();
                resolve(resources);
            });
        });
    };
    JSONAPICrawler.prototype.increment = function () {
        this.offset += this.limit;
    };
    Object.defineProperty(JSONAPICrawler.prototype, "page", {
        get: function () {
            return {
                limit: this.limit,
                offset: this.offset
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONAPICrawler.prototype, "params", {
        get: function () {
            this.page;
        },
        enumerable: true,
        configurable: true
    });
    return JSONAPICrawler;
}());
exports.default = JSONAPICrawler;
