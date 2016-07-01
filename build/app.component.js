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
var state_service_1 = require('./services/state.service');
var spice_service_1 = require('./spice/spice.service');
var spice_feed_component_1 = require('./spice/spice-feed.component');
var loginbutton_component_1 = require('./components/loginbutton.component');
var add_spice_modal_component_1 = require('./spice/add-spice-modal.component');
var SpiceApp = (function () {
    function SpiceApp(stateService, spiceService, af) {
        var _this = this;
        this.stateService = stateService;
        this.spiceService = spiceService;
        this.af = af;
        this.search = new common_1.Control();
        this.showAllState = true;
        this.search.valueChanges.debounceTime(250).subscribe(function (search) { return stateService.onSearch(search); });
        stateService.state$.subscribe(function (state) { return _this.showAllState = state.showAll; });
    }
    SpiceApp.prototype.openSpiceModal = function (spice) {
        this.addSpiceModal.open(spice);
    };
    SpiceApp.prototype.filterFeed = function () {
        this.stateService.onShowAll(!this.showAllState);
    };
    __decorate([
        core_1.ViewChild(add_spice_modal_component_1.AddSpiceModal), 
        __metadata('design:type', add_spice_modal_component_1.AddSpiceModal)
    ], SpiceApp.prototype, "addSpiceModal", void 0);
    SpiceApp = __decorate([
        core_1.Component({
            selector: 'spice-app',
            directives: [spice_feed_component_1.SpiceFeed, loginbutton_component_1.LoginButton, add_spice_modal_component_1.AddSpiceModal],
            providers: [state_service_1.StateService, spice_service_1.SpiceService],
            template: "\n    <nav class=\"navbar navbar-default navbar-inverse navbar-fixed-top\">\n        <div class=\"container-fluid\">\n            <div class=\"navbar-header pull-left\">\n                <div class=\"navbar-brand\"><span style=\"color:#89E894\" class=\"glyphicon glyphicon-grain\" aria-hidden=\"true\"></span> All Spice</div>\n            </div>\n\n            <login-button class=\"pull-right\" style=\"margin-top:8px;\"></login-button>\n\n            <ul *ngIf=\"af.auth | async\" class=\"nav navbar-nav navbar-right pull-right\" style=\"margin-right:0px;\">\n                <li><a (click)=\"openSpiceModal(null)\"><span style=\"color:#89E894\" class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\" title=\"Add Spice\"></span><span class=\"hidden-xs\"> Add Spice</span></a></li>\n            </ul>\n            \n            <ul class=\"nav navbar-nav navbar-link\">\n                <li *ngIf=\"af.auth | async\"><a (click)=\"filterFeed()\" title=\"{{ showAllState ? 'Show My Spice' : 'Show All' }}\"><span style=\"color:#89E894\" class=\"glyphicon glyphicon-{{ showAllState ? 'heart-empty' : 'heart' }}\" aria-hidden=\"true\"></span><span class=\"hidden-xs\">{{ showAllState ? ' Show My Spice' : ' Show All' }}</span></a></li>\n            </ul>\n            \n            <form class=\"navbar-form navbar-right hidden-xs\" role=\"search\" style=\"margin-right:0\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\">\n                        <div class=\"input-group-addon\">\n                        <span style=\"color:#89E894\" class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span>\n                        </div>\n                        <input [ngFormControl]=\"search\" type=\"text\" class=\"form-control search-input\" placeholder=\"Search\" />\n                    </div>\n                </div>\n            </form>\n        </div>\n    </nav>\n    <spice-feed (onFeedEdit)=\"openSpiceModal($event)\"></spice-feed>    \n    <add-spice-modal></add-spice-modal>\n    "
        }), 
        __metadata('design:paramtypes', [state_service_1.StateService, spice_service_1.SpiceService, angularfire2_1.AngularFire])
    ], SpiceApp);
    return SpiceApp;
}());
exports.SpiceApp = SpiceApp;
