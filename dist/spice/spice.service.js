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
var core_1 = require('@angular/core');
var angularfire2_1 = require('angularfire2');
require('rxjs/add/operator/map');
var SpiceService = (function () {
    function SpiceService(af) {
        this.af = af;
        this.spices = af.list('/spices');
        this.tags = af.list('/tags');
    }
    SpiceService.prototype.getAll = function (uid, search) {
        var _this = this;
        return this.spices.map(function (spices) {
            return spices
                .filter(function (item) { return _this.filter(item, uid, search); })
                .sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });
        });
    };
    SpiceService.prototype.add = function (spice) {
        var _this = this;
        this.af.auth.subscribe(function (user) {
            spice.timestamp = Firebase.ServerValue.TIMESTAMP;
            if (user) {
                spice.user = {
                    'name': user.google.displayName.toString(),
                    'profileImageURL': user.google.profileImageURL.toString(),
                    'provider': user.provider.toString(),
                    'uid': user.uid
                };
                console.log(spice);
                _this.spices.push(spice)
                    .then(function (_) { return console.log('add successful'); })
                    .catch(function (err) { return console.log(err, 'add error: ' + err); });
            }
        });
    };
    SpiceService.prototype.update = function (key, spice) {
        console.log(spice);
        var newSpice = JSON.parse(JSON.stringify(spice));
        delete newSpice.$key;
        this.spices.update(key, newSpice)
            .then(function (_) { return console.log(key + ' update successful'); })
            .catch(function (err) { return console.log(err, key + ' update error: ' + err); });
    };
    SpiceService.prototype.remove = function (key) {
        this.spices.remove(key)
            .then(function (_) { return console.log(key + ' remove successful'); })
            .catch(function (err) { return console.log(err, key + ' remove error: ' + err); });
    };
    SpiceService.prototype.togglePin = function (spice) {
        var _this = this;
        this.af.auth.subscribe(function (user) {
            if (user) {
                if (spice.user.uid !== user.uid) {
                    if (!spice.pinnedUsers)
                        spice.pinnedUsers = {};
                    spice.pinnedUsers[user.uid] = !(spice.pinnedUsers[user.uid] === true);
                    _this.update(spice.$key, spice);
                }
            }
        });
    };
    SpiceService.prototype.filter = function (item, uid, search) {
        var res = true;
        if (uid)
            res = ((item.user && item.user.uid === uid) || (item.pinnedUsers && item.pinnedUsers[uid] === true)) ? true : false;
        if (res && search) {
            search = search.toLowerCase();
            res = (item.name.toLowerCase().indexOf(search) >= 0 || item.user.name.toLowerCase().indexOf(search) >= 0);
            if (!res && item.description)
                res = (item.description.toLowerCase().indexOf(search) >= 0);
            if (!res && item.ingredients)
                res = (item.ingredients.toLowerCase().indexOf(search) >= 0);
            if (!res && item.directions)
                res = (item.directions.toLowerCase().indexOf(search) >= 0);
            if (!res && item.tags)
                res = (item.tags.toLowerCase().indexOf(search) >= 0);
        }
        return res;
    };
    SpiceService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [angularfire2_1.AngularFire])
    ], SpiceService);
    return SpiceService;
}());
exports.SpiceService = SpiceService;
