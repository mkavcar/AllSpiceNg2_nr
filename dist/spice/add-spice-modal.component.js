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
var spice_service_1 = require('./spice.service');
var spice_model_1 = require('./spice.model');
var AddSpiceModal = (function () {
    function AddSpiceModal(spiceService) {
        this.spiceService = spiceService;
        this.active = true;
        this.spice = new spice_model_1.Spice();
        this.isUpdate = false;
        this.showStatus = false;
    }
    AddSpiceModal.prototype.ngAfterViewInit = function () {
        if (!this.modalObj)
            this.modalObj = $('#addSpiceModal');
    };
    AddSpiceModal.prototype.open = function (spice) {
        this.showStatus = false;
        if (spice !== null) {
            this.spice = spice;
            this.isUpdate = true;
        }
        else {
            this.spice = new spice_model_1.Spice();
            this.isUpdate = false;
        }
        this.modalObj.modal('show');
    };
    AddSpiceModal.prototype.submit = function () {
        var _this = this;
        if (this.isUpdate)
            this.spiceService.update(this.spice.$key, this.spice);
        else
            this.spiceService.add(this.spice);
        this.spice = new spice_model_1.Spice();
        this.active = false;
        setTimeout(function () { return _this.active = true; }, 0);
        this.showStatus = true;
    };
    AddSpiceModal.prototype.close = function () {
        this.modalObj.modal('hide');
    };
    AddSpiceModal = __decorate([
        core_1.Component({
            selector: 'add-spice-modal',
            template: "\n    <div class=\"modal fade\" id=\"addSpiceModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addSpiceModal\" data-backdrop=\"static\">\n        <div class=\"modal-dialog\" role=\"document\">\n            <div class=\"modal-content\">\n      \n                <form *ngIf=\"active\" novalidate #spiceForm=\"ngForm\">\n                    <div class=\"container-fluid\" style=\"max-width:1000px;background:#eee;\">\n                        \n                        <!-- Header -->\n                        <div class=\"row\" style=\"background: #444;padding-left: 10px;\">\n                            <h2 style=\"color: #89E894;\"><span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\" style=\"top: 2px;\"></span> {{ (isUpdate) ? 'Edit Spice' : 'Add Spice' }}</h2>\n                        </div>\n                        \n                        <!-- Entry View -->\n                        <div class=\"row\" *ngIf=\"showStatus !== true\">\n                            <div class=\"col-sm-6\" style=\"padding-top: 15px;\">\n                                <div class=\"form-group\" [class.has-error]=\"!name.valid && !name.pristine\">\n                                    <label for=\"inputName\">Name</label>\n                                    <input type=\"text\" [(ngModel)]=\"spice.name\" ngControl=\"name\" #name=\"ngForm\" class=\"form-control\" id=\"inputName\" name=\"inputName\" placeholder=\"Name\" required>\n                                    <div [hidden]=\"name.valid || name.pristine\" class=\"help-block\" role=\"alert\">\n                                        <div>This field is required</div>\n                                    </div>\n                                </div>\n                                <div class=\"form-group\">\n                                    <label for=\"inputDescription\">Description</label>\n                                    <textarea [(ngModel)]=\"spice.description\" ngControl=\"description\" #description=\"ngForm\" class=\"form-control\" id=\"inputDescription\"></textarea>\n                                </div>\n                                <div class=\"form-group\">\n                                    <label for=\"inputImageURL\">Image URL</label>\n                                    <input type=\"text\" [(ngModel)]=\"spice.imageURL\" class=\"form-control\" id=\"inputImageURL\" placeholder=\"Image URL\">\n                                </div>\n                                <img *ngIf=\"spice.imageURL\" src=\"{{spice.imageURL}}\" style=\"width:100%;margin-bottom: 15px;\">\n                            </div>\n                            <div class=\"col-sm-6\" style=\"background: #ddd;padding-top: 15px;\">\n                                <div class=\"row\">\n                                <div class=\"col-sm-4\">\n                                    <div class=\"form-group\" [class.has-error]=\"!prepTime.valid && !prepTime.pristine\">\n                                        <label><span class=\"glyphicon glyphicon-time\" aria-hidden=\"true\" style=\"top: 2px;\"></span> Prep (min)</label>\n                                        <input name=\"inputPrepTime\" [(ngModel)]=\"spice.prepTime\" ngControl=\"prepTime\" #prepTime=\"ngForm\" class=\"form-control\" maxlength=\"3\" pattern=\"^([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$\" />\n                                        <div [hidden]=\"prepTime.valid || prepTime.pristine\" class=\"help-block\" role=\"alert\">\n                                            <div>Please enter 1-999</div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class=\"col-sm-4\">\n                                    <div class=\"form-group\" [class.has-error]=\"!cookTime.valid && !cookTime.pristine\">\n                                        <label><span class=\"glyphicon glyphicon-time\" aria-hidden=\"true\" style=\"top: 2px;\"></span> Cook (min)</label>\n                                        <input name=\"inputCookTime\" [(ngModel)]=\"spice.cookTime\" ngControl=\"cookTime\" #cookTime=\"ngForm\" class=\"form-control\" maxlength=\"3\" pattern=\"^([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$\" />\n                                        <div [hidden]=\"cookTime.valid || cookTime.pristine\" class=\"help-block\" role=\"alert\">\n                                            <div>Please enter 1-999</div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class=\"col-sm-4\">\n                                    <div class=\"form-group\" [class.has-error]=\"!servings.valid && !servings.pristine\">\n                                        <label><span class=\"glyphicon glyphicon-cutlery\" aria-hidden=\"true\" style=\"top: 2px;\"></span> Servings</label>\n                                        <input name=\"inputServings\" [(ngModel)]=\"spice.servings\" ngControl=\"servings\" #servings=\"ngForm\" class=\"form-control\" maxlength=\"2\" pattern=\"^([1-9]|[1-9][0-9])$\" />\n                                        <div [hidden]=\"servings.valid || servings.pristine\" class=\"help-block\" role=\"alert\">\n                                            <div>Please enter 1-99</div>\n                                        </div>\n                                    </div>\n                                </div>\n                                </div>\n                                <div class=\"form-group\">\n                                    <label for=\"inputIngredients\">Ingredients</label>\n                                    <textarea [(ngModel)]=\"spice.ingredients\" ngControl=\"ingredients\" #ingredients=\"ngForm\" rows=\"4\" class=\"form-control\" id=\"inputIngredients\"></textarea>\n                                </div>\n                                <div class=\"form-group\">\n                                    <label for=\"inputDirections\">Directions</label>\n                                    <textarea [(ngModel)]=\"spice.directions\" ngControl=\"directions\" #directions=\"ngForm\" rows=\"4\" class=\"form-control\" id=\"inputDirections\"></textarea>\n                                </div>\n                                <div class=\"form-group\" style=\"margin-bottom:0;padding-bottom:15px;\">\n                                    <label for=\"inputTags\">Tags</label>\n                                    <input name=\"tags\" [(ngModel)]=\"spice.tags\" ngControl=\"tags\" #tags=\"ngForm\" class=\"form-control\" maxlength=\"100\" />                            \n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"row\" *ngIf=\"showStatus !== true\">\n                            <div class=\"col-xs-12\" style=\"background:#89E894;padding-top: 15px;padding-bottom: 10px;\">\n                                <button type=\"button\" (click)=\"submit()\" class=\"btn btn-success pull-right\" [disabled]=\"!spiceForm.form.valid\"><span class=\"glyphicon glyphicon-send\" aria-hidden=\"true\"></span> Submit</button>\n                                <button type=\"button\" (click)=\"close()\" class=\"btn btn-default pull-right\" style=\"margin-right:4px;\">Cancel</button>\n                            </div>\n                        </div>\n                        \n                        <!-- Status View -->\n                        <div class=\"row\" *ngIf=\"showStatus === true\">\n                            <div class=\"col-xs-12\" style=\"padding: 15px;\">\n                                <div class=\"app-alert app-alert-success\" style=\"border-color: #4BC74D;\">\n                                    <h4><span class=\"glyphicon glyphicon-ok\" style=\"top: 6px;padding-right: 10px;color: #4BC74D;\"></span>Spice submitted successfully!</h4>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"row\" *ngIf=\"showStatus === true\">\n                            <div class=\"col-xs-12\" style=\"background:#89E894;padding-top: 15px;padding-bottom: 20px;\">\n                                <button class=\"btn btn-success pull-right\" (click)=\"close()\">OK</button>\n                            </div>\n                        </div>\n                        \n                    </div>\n                </form>\n                      \n            </div>\n        </div>\n    </div>        \n    "
        }), 
        __metadata('design:paramtypes', [spice_service_1.SpiceService])
    ], AddSpiceModal);
    return AddSpiceModal;
}());
exports.AddSpiceModal = AddSpiceModal;
