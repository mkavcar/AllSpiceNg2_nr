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
var LoginButton = (function () {
    function LoginButton(af) {
        var _this = this;
        this.af = af;
        af.auth.subscribe(function (user) {
            if (user) {
                _this.profileImageURL = user.google.profileImageURL;
                _this.displayName = user.google.displayName;
            }
        });
    }
    LoginButton.prototype.logout = function () {
        this.af.auth.logout();
    };
    LoginButton = __decorate([
        core_1.Component({
            selector: 'login-button',
            template: "\n    <button *ngIf=\"!(af.auth | async)\" class=\"btn btn-success\" (click)=\"af.auth.login()\"><span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span> Login</button>\n\n    <ul *ngIf=\"af.auth | async\" class=\"userDropdown\">\n        <li>\n            <a href=\"#\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                <img src=\"{{ profileImageURL }}\" title=\"{{ displayName }}\"><span class=\"hidden-xs\">{{ displayName }}&nbsp;&nbsp;</span><span style=\"color:#89E894;top: 6px;\" class=\"glyphicon glyphicon-chevron-down\" aria-hidden=\"true\"></span>\n            </a>\n            <ul class=\"dropdown-menu\">\n                <li><a (click)=\"logout()\">Logout</a></li>\n            </ul>\n        </li>\n    </ul>\n  "
        }), 
        __metadata('design:paramtypes', [angularfire2_1.AngularFire])
    ], LoginButton);
    return LoginButton;
}());
exports.LoginButton = LoginButton;
