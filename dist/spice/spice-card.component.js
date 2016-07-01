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
var spice_service_1 = require('./spice.service');
var spice_model_1 = require('./spice.model');
var SpiceCard = (function () {
    function SpiceCard(spiceService, af) {
        this.spiceService = spiceService;
        this.af = af;
        this.onEdit = new core_1.EventEmitter();
        this.isPinned = false;
        this.userId = '';
    }
    SpiceCard.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.subscribe(function (user) {
            if (user) {
                _this.userId = user.uid;
                if (_this.spice.pinnedUsers)
                    _this.isPinned = (_this.spice.pinnedUsers[user.uid] === true);
            }
        });
    };
    SpiceCard.prototype.edit = function () {
        this.onEdit.emit(this.spice);
    };
    SpiceCard.prototype.delete = function () {
        this.spiceService.remove(this.spice.$key);
    };
    SpiceCard.prototype.togglePin = function () {
        this.spiceService.togglePin(this.spice);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', spice_model_1.Spice)
    ], SpiceCard.prototype, "spice", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SpiceCard.prototype, "onEdit", void 0);
    SpiceCard = __decorate([
        core_1.Component({
            selector: 'spice-card',
            template: "\n    <div class=\"container-fluid spice-card\">\n      <div class=\"row animate-show-flipInX\" *ngIf=\"userId\">\n        <div *ngIf=\"showConfirm !== true\" class=\"col-xs-12 animate-show\" style=\"background:#89E894;padding-bottom:10px;padding-top:10px;\">\n          <button *ngIf=\"userId !== spice.user.uid\" (click)=\"togglePin()\" class=\"btn btn-success btn-sm\"><span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\" title=\"PinUnpin to My Feed\"></span> {{ (isPinned) ? 'Unpin' : 'Pin' }}</button>\n          <button *ngIf=\"userId === spice.user.uid\" (click)=\"edit()\" class=\"btn btn-success btn-sm\"><span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span> Edit</button>\n          <button *ngIf=\"userId === spice.user.uid\" (click)=\"showConfirm = true\" class=\"btn btn-success btn-sm\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span> Delete</button>\n        </div>\n        <div *ngIf=\"showConfirm === true\" class=\"col-xs-12 animate-show\" style=\"padding: 0;\">\n          <div class=\"alert alert-danger clearfix\" style=\"border-radius:0;margin-bottom:0;padding-bottom: 9px;padding-top: 9px;\">\n            <div class=\"pull-left\" style=\"line-height:30px;\">\n              <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\" style=\"font-size: 1.4em;top: 6px;padding-right: 10px;\"></span>Are you sure you want to delete this spice?    \n            </div>\n            <div class=\"pull-right\">\n              <button (click)=\"showConfirm = false\" class=\"btn btn-default btn-sm\">Cancel</button>\n              <button (click)=\"delete()\" class=\"btn btn-danger btn-sm\">Delete</button>  \n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\" style=\"background:white;\">\n        <div class=\"col-sm-6\">\n          <h2>{{spice.name}}</h2>\n          <div class=\"clearfix\" style=\"padding-bottom: 10px;\">\n            <img src=\"{{spice.user.profileImageURL}}\" class=\"pull-left\" style=\"margin-right:10px;border-radius: 50%;width:32px;\">\n            <div class=\"pull-left\">\n              <a href=\"#\"><strong>{{spice.user.name}}</strong></a>\n              <div><small>{{spice.timestamp | date:'short'}}</small></div>\n            </div>\n          </div>\n          <div class=\"row\" style=\"padding-bottom: 10px;\">\n            <div class=\"col-xs-4\">\n              <span class=\"glyphicon glyphicon-time\" aria-hidden=\"true\"></span> Prep (min)\n              <div style=\"color: #26B937;font-size: 24px;\">{{(spice.prepTime) ? spice.prepTime : '-'}}</div>\n            </div>\n            <div class=\"col-xs-4\">\n              <span class=\"glyphicon glyphicon-time\" aria-hidden=\"true\"></span> Cook (min)\n              <div style=\"color:#26B937; font-size: 24px;\">{{(spice.cookTime) ? spice.cookTime : '-'}}</div>\n            </div>\n            <div class=\"col-xs-4\">\n              <span class=\"glyphicon glyphicon-cutlery\" aria-hidden=\"true\"></span> Servings\n              <div style=\"color:#26B937; font-size: 24px;\">{{(spice.servings) ? spice.servings : '-'}}</div>\n            </div>\n          </div>\n          <div style=\"padding-bottom: 10px;\">{{spice.description}}</div>\n          <div *ngIf=\"spice.tags\" style=\"padding-bottom: 10px;\">\n            <button class=\"btn btn-warning btn-xs\" *ngFor=\"let tag of spice.tags.split(',')\" (click)=\"console.log(tag)\" style=\"margin-right:4px;\">{{ tag }}</button>\n          </div>\n        </div>\n        <div class=\"col-sm-6\" style=\"padding:0\">\n          <img *ngIf=\"spice.imageURL\" style=\"width:100%;\" src=\"{{spice.imageURL}}\">\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-6\" style=\"background: #ddd;padding: 15px;\">\n          <h3 style=\"border-bottom: 1px solid #ccc;padding-bottom: 10px;margin-top:0px;\">Ingredients</h3>\n          <div style=\"white-space: pre-wrap;\">{{spice.ingredients}}</div>\n        </div>\n        <div class=\"col-sm-6\" style=\"background: #eee;padding: 15px;\">\n          <h3 style=\"border-bottom: 1px solid #ccc;padding-bottom: 10px;margin-top:0px;\">Directions</h3>\n          <div style=\"white-space: pre-wrap;\">{{spice.directions}}</div>\n        </div>\n      </div>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [spice_service_1.SpiceService, angularfire2_1.AngularFire])
    ], SpiceCard);
    return SpiceCard;
}());
exports.SpiceCard = SpiceCard;
