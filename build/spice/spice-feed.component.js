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
var common_1 = require('@angular/common');
var angularfire2_1 = require('angularfire2');
require('rxjs/add/operator/debounceTime');
var spice_service_1 = require('./spice.service');
var spice_card_component_1 = require('./spice-card.component');
var state_service_1 = require('../services/state.service');
var SpiceFeed = (function () {
    function SpiceFeed(spiceService, stateService, af) {
        var _this = this;
        this.spiceService = spiceService;
        this.stateService = stateService;
        this.af = af;
        this.onFeedEdit = new core_1.EventEmitter();
        this.loading = true;
        this.search = new common_1.Control();
        this.authSub = this.af.auth.subscribe(function (user) { return _this.uid = (user) ? user.uid : null; });
        this.stateSub = stateService.state$.subscribe(function (state) { return _this.load(); });
        this.inputSub = this.search.valueChanges.debounceTime(250).subscribe(function (search) { return stateService.onSearch(search); });
    }
    SpiceFeed.prototype.load = function () {
        var _this = this;
        this.loading = true;
        var state = this.stateService.getLast();
        this.spiceService.getAll(state.showAll ? null : this.uid, state.search).subscribe(function (spices) {
            _this.spices = spices;
            _this.loading = false;
        });
    };
    SpiceFeed.prototype.onEdit = function (spice) {
        this.onFeedEdit.emit(spice);
    };
    SpiceFeed.prototype.ngOnInit = function () {
        this.load();
    };
    SpiceFeed.prototype.ngOnDestroy = function () {
        this.stateSub.unsubscribe();
        this.authSub.unsubscribe();
        this.inputSub.unsubscribe();
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SpiceFeed.prototype, "onFeedEdit", void 0);
    SpiceFeed = __decorate([
        core_1.Component({
            selector: 'spice-feed',
            directives: [spice_card_component_1.SpiceCard],
            template: "\n    <div class=\"form-group visible-xs-block\" style=\"padding: 10px;margin: 0;background: #5CB85C;\">\n        <div class=\"input-group\">\n            <div class=\"input-group-addon\">\n                <span style=\"color:#89E894\" class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span>\n            </div>\n            <input [ngFormControl]=\"search\" type=\"text\" class=\"form-control search-input\" placeholder=\"Search\" style=\"-webkit-box-shadow:none;box-shadow:none;\">\n        </div>\n    </div>\n    <spice-card *ngFor=\"let spice of spices; trackBy: spice?.$id\" [spice]=\"spice\" (onEdit)=\"onEdit($event)\"></spice-card>\n    <div *ngIf=\"!loading && spices.length === 0\" class=\"app-alert app-alert-warning\">\n        <h4><span class=\"glyphicon glyphicon-grain\"></span> No spice found</h4>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [spice_service_1.SpiceService, state_service_1.StateService, angularfire2_1.AngularFire])
    ], SpiceFeed);
    return SpiceFeed;
}());
exports.SpiceFeed = SpiceFeed;
