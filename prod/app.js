var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("services/search.service", ['@angular/core', 'rxjs/Subject'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, Subject_1;
    var SearchService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            }],
        execute: function() {
            SearchService = (function () {
                function SearchService() {
                    this.searchSource = new Subject_1.Subject();
                    this.search$ = this.searchSource.asObservable();
                }
                SearchService.prototype.onSearch = function (search) {
                    this.lastSearch = search;
                    this.searchSource.next(search);
                };
                SearchService.prototype.getLast = function () {
                    return this.lastSearch;
                };
                SearchService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], SearchService);
                return SearchService;
            }());
            exports_1("SearchService", SearchService);
        }
    }
});
System.register("spice/spice.model", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Spice;
    return {
        setters:[],
        execute: function() {
            Spice = (function () {
                function Spice() {
                }
                return Spice;
            }());
            exports_2("Spice", Spice);
        }
    }
});
System.register("spice/spice.service", ['@angular/core', 'angularfire2', 'rxjs/add/operator/map'], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_2, angularfire2_1;
    var SpiceService;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (angularfire2_1_1) {
                angularfire2_1 = angularfire2_1_1;
            },
            function (_1) {}],
        execute: function() {
            SpiceService = (function () {
                function SpiceService(af) {
                    this.af = af;
                    this._spice = null;
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
                SpiceService.prototype.getObj = function () {
                    return this._spice;
                };
                SpiceService.prototype.setObj = function (spice) {
                    this._spice = spice;
                };
                SpiceService.prototype.add = function (spice) {
                    var svc = this;
                    spice.timestamp = Firebase.ServerValue.TIMESTAMP;
                    this.af.auth.subscribe(function (user) {
                        if (user) {
                            spice.user = {
                                'name': user.google.displayName.toString(),
                                'profileImageURL': user.google.profileImageURL.toString(),
                                'provider': user.provider.toString(),
                                'uid': user.uid
                            };
                            console.log(spice);
                            svc.spices.push(spice)
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
                    var svc = this;
                    this.af.auth.subscribe(function (user) {
                        if (user) {
                            if (spice.user.uid !== user.uid) {
                                if (!spice.pinnedUsers)
                                    spice.pinnedUsers = {};
                                spice.pinnedUsers[user.uid] = !(spice.pinnedUsers[user.uid] === true);
                                svc.update(spice.$key, spice);
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
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [angularfire2_1.AngularFire])
                ], SpiceService);
                return SpiceService;
            }());
            exports_3("SpiceService", SpiceService);
        }
    }
});
System.register("spice/spice-card.component", ['@angular/core', '@angular/router', 'angularfire2', "spice/spice.service", "spice/spice.model"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_3, router_1, angularfire2_2, spice_service_1, spice_model_1;
    var SpiceCard;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (angularfire2_2_1) {
                angularfire2_2 = angularfire2_2_1;
            },
            function (spice_service_1_1) {
                spice_service_1 = spice_service_1_1;
            },
            function (spice_model_1_1) {
                spice_model_1 = spice_model_1_1;
            }],
        execute: function() {
            SpiceCard = (function () {
                function SpiceCard(spiceService, af, router) {
                    this.spiceService = spiceService;
                    this.af = af;
                    this.router = router;
                    this.isPinned = false;
                    this.userId = '';
                }
                SpiceCard.prototype.ngOnInit = function () {
                    var vm = this;
                    this.af.auth.subscribe(function (user) {
                        if (user) {
                            vm.userId = user.uid;
                            if (vm.spice.pinnedUsers)
                                vm.isPinned = (vm.spice.pinnedUsers[user.uid] === true);
                        }
                    });
                };
                SpiceCard.prototype.edit = function () {
                    this.spiceService.setObj(this.spice);
                    this.router.navigate(['/addSpice']);
                };
                SpiceCard.prototype.delete = function () {
                    this.spiceService.remove(this.spice.$key);
                };
                SpiceCard.prototype.togglePin = function () {
                    this.spiceService.togglePin(this.spice);
                };
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', spice_model_1.Spice)
                ], SpiceCard.prototype, "spice", void 0);
                SpiceCard = __decorate([
                    core_3.Component({
                        selector: 'spice-card',
                        template: "\n    <div class=\"container-fluid\" style=\"max-width:1000px;margin-bottom:15px;background:#ccc\">\n      <div class=\"row animate-show-flipInX\" *ngIf=\"userId\">\n        <div *ngIf=\"showConfirm !== true\" class=\"col-xs-12 animate-show\" style=\"background:#89E894;padding-bottom:10px;padding-top:10px;\">\n          <button *ngIf=\"userId !== spice.user.uid\" (click)=\"togglePin()\" class=\"btn btn-success btn-sm\"><span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\" title=\"PinUnpin to My Feed\"></span> {{ (isPinned) ? 'Unpin' : 'Pin' }}</button>\n          <button *ngIf=\"userId === spice.user.uid\" (click)=\"edit()\" class=\"btn btn-success btn-sm\"><span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span> Edit</button>\n          <button *ngIf=\"userId === spice.user.uid\" (click)=\"showConfirm = true\" class=\"btn btn-success btn-sm\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span> Delete</button>\n        </div>\n        <div *ngIf=\"showConfirm === true\" class=\"col-xs-12 animate-show\" style=\"padding: 0;\">\n          <div class=\"alert alert-danger clearfix\" style=\"border-radius:0;margin-bottom:0;padding-bottom: 9px;padding-top: 9px;\">\n            <div class=\"pull-left\" style=\"line-height:30px;\">\n              <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\" style=\"font-size: 1.4em;top: 6px;padding-right: 10px;\"></span>Are you sure you want to delete this spice?    \n            </div>\n            <div class=\"pull-right\">\n              <button (click)=\"showConfirm = false\" class=\"btn btn-default btn-sm\">Cancel</button>\n              <button (click)=\"delete()\" class=\"btn btn-danger btn-sm\">Delete</button>  \n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\" style=\"background:white;\">\n        <div class=\"col-sm-6\">\n          <h2>{{spice.name}}</h2>\n          <div class=\"clearfix\" style=\"padding-bottom: 10px;\">\n            <img src=\"{{spice.user.profileImageURL}}\" class=\"pull-left\" style=\"margin-right:10px;border-radius: 50%;width:32px;\">\n            <div class=\"pull-left\">\n              <a href=\"#\"><strong>{{spice.user.name}}</strong></a>\n              <div><small>{{spice.timestamp | date:'short'}}</small></div>\n            </div>\n          </div>\n          <div class=\"row\" style=\"padding-bottom: 10px;\">\n            <div class=\"col-xs-4\">\n              <span class=\"glyphicon glyphicon-time\" aria-hidden=\"true\"></span> Prep (min)\n              <div style=\"color: #26B937;font-size: 24px;\">{{(spice.prepTime) ? spice.prepTime : '-'}}</div>\n            </div>\n            <div class=\"col-xs-4\">\n              <span class=\"glyphicon glyphicon-time\" aria-hidden=\"true\"></span> Cook (min)\n              <div style=\"color:#26B937; font-size: 24px;\">{{(spice.cookTime) ? spice.cookTime : '-'}}</div>\n            </div>\n            <div class=\"col-xs-4\">\n              <span class=\"glyphicon glyphicon-cutlery\" aria-hidden=\"true\"></span> Servings\n              <div style=\"color:#26B937; font-size: 24px;\">{{(spice.servings) ? spice.servings : '-'}}</div>\n            </div>\n          </div>\n          <div style=\"padding-bottom: 10px;\">{{spice.description}}</div>\n          <div *ngIf=\"spice.tags\" style=\"padding-bottom: 10px;\">\n            <button class=\"btn btn-warning btn-xs\" *ngFor=\"let tag of spice.tags.split(',')\" (click)=\"console.log(tag)\" style=\"margin-right:4px;\">{{ tag }}</button>\n          </div>\n        </div>\n        <div class=\"col-sm-6\" style=\"padding:0\">\n          <img style=\"width:100%;\" src=\"{{spice.imageURL}}\">\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-6\" style=\"background: #ddd;padding: 15px;\">\n          <h3 style=\"border-bottom: 1px solid #ccc;padding-bottom: 10px;margin-top:0px;\">Ingredients</h3>\n          <div style=\"white-space: pre-wrap;\">{{spice.ingredients}}</div>\n        </div>\n        <div class=\"col-sm-6\" style=\"background: #eee;padding: 15px;\">\n          <h3 style=\"border-bottom: 1px solid #ccc;padding-bottom: 10px;margin-top:0px;\">Directions</h3>\n          <div style=\"white-space: pre-wrap;\">{{spice.directions}}</div>\n        </div>\n      </div>\n    </div>\n    "
                    }), 
                    __metadata('design:paramtypes', [spice_service_1.SpiceService, angularfire2_2.AngularFire, router_1.Router])
                ], SpiceCard);
                return SpiceCard;
            }());
            exports_4("SpiceCard", SpiceCard);
        }
    }
});
System.register("spice/spice-feed.component", ['@angular/core', '@angular/common', '@angular/router', 'angularfire2', 'rxjs/add/operator/debounceTime', "spice/spice.service", "spice/spice-card.component", "services/search.service"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var core_4, common_1, router_2, angularfire2_3, spice_service_2, spice_card_component_1, search_service_1;
    var SpiceFeed;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_2_1) {
                router_2 = router_2_1;
            },
            function (angularfire2_3_1) {
                angularfire2_3 = angularfire2_3_1;
            },
            function (_2) {},
            function (spice_service_2_1) {
                spice_service_2 = spice_service_2_1;
            },
            function (spice_card_component_1_1) {
                spice_card_component_1 = spice_card_component_1_1;
            },
            function (search_service_1_1) {
                search_service_1 = search_service_1_1;
            }],
        execute: function() {
            SpiceFeed = (function () {
                function SpiceFeed(spiceService, searchService, routeSegment, af) {
                    this.spiceService = spiceService;
                    this.searchService = searchService;
                    this.routeSegment = routeSegment;
                    this.af = af;
                    this.loading = true;
                    this.search = new common_1.Control();
                    var vm = this;
                    vm.authSub = vm.af.auth.subscribe(function (user) {
                        if (vm.routeSegment.getParam('state') && user)
                            vm.uid = user.uid;
                    });
                    vm.searchSub = searchService.search$.subscribe(function (search) {
                        spiceService.getAll(vm.uid, search).subscribe(function (spices) { return vm.spices = spices; });
                    });
                    vm.inputSub = vm.search.valueChanges.debounceTime(250).subscribe(function (search) { return searchService.onSearch(search); });
                }
                SpiceFeed.prototype.routerOnActivate = function (curr, prev, currTree, prevTree) {
                    var _this = this;
                    this.loading = true;
                    this.spiceService.getAll(this.uid, this.searchService.getLast()).subscribe(function (spices) {
                        _this.spices = spices;
                        _this.loading = false;
                    });
                };
                SpiceFeed.prototype.ngOnDestroy = function () {
                    this.searchSub.unsubscribe();
                    this.authSub.unsubscribe();
                    this.inputSub.unsubscribe();
                };
                SpiceFeed = __decorate([
                    core_4.Component({
                        selector: 'spice-feed',
                        directives: [spice_card_component_1.SpiceCard],
                        template: "\n    <div class=\"form-group visible-xs-block\" style=\"padding: 10px;margin: 0;background: #5CB85C;\">\n        <div class=\"input-group\">\n            <div class=\"input-group-addon\">\n                <span style=\"color:#89E894\" class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span>\n            </div>\n            <input [ngFormControl]=\"search\" type=\"text\" class=\"form-control search-input\" placeholder=\"Search\" style=\"-webkit-box-shadow:none;box-shadow:none;\">\n        </div>\n    </div>\n    <spice-card *ngFor=\"let spice of spices; trackBy: spice?.$id\" [spice]=\"spice\"></spice-card>\n    <div *ngIf=\"!loading && spices.length === 0\" class=\"app-alert app-alert-warning\">\n        <h4><span class=\"glyphicon glyphicon-grain\"></span> No spice found</h4>\n    </div>\n    "
                    }), 
                    __metadata('design:paramtypes', [spice_service_2.SpiceService, search_service_1.SearchService, router_2.RouteSegment, angularfire2_3.AngularFire])
                ], SpiceFeed);
                return SpiceFeed;
            }());
            exports_5("SpiceFeed", SpiceFeed);
        }
    }
});
System.register("spice/add-spice.component", ['@angular/core', "spice/spice.service", "spice/spice.model"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_5, spice_service_3, spice_model_2;
    var AddSpice;
    return {
        setters:[
            function (core_5_1) {
                core_5 = core_5_1;
            },
            function (spice_service_3_1) {
                spice_service_3 = spice_service_3_1;
            },
            function (spice_model_2_1) {
                spice_model_2 = spice_model_2_1;
            }],
        execute: function() {
            AddSpice = (function () {
                function AddSpice(spiceService) {
                    this.spiceService = spiceService;
                    this.active = true;
                    this.isUpdate = false;
                    this.showStatus = false;
                }
                AddSpice.prototype.routerOnActivate = function (curr, prev, currTree, prevTree) {
                    this.spice = this.spiceService.getObj();
                    this.isUpdate = (this.spice) ? true : false;
                    if (!this.spice)
                        this.spice = new spice_model_2.Spice();
                };
                AddSpice.prototype.onSubmit = function () {
                    var _this = this;
                    if (this.isUpdate)
                        this.spiceService.update(this.spice.$key, this.spice);
                    else
                        this.spiceService.add(this.spice);
                    this.spice = new spice_model_2.Spice();
                    this.active = false;
                    setTimeout(function () { return _this.active = true; }, 0);
                    this.showStatus = true;
                };
                AddSpice.prototype.ok = function () {
                    this.showStatus = false;
                    this.isUpdate = false;
                };
                AddSpice.prototype.cancel = function () {
                    window.history.back();
                };
                AddSpice = __decorate([
                    core_5.Component({
                        selector: 'add-spice',
                        template: "\n        <form *ngIf=\"active\" novalidate #spiceForm=\"ngForm\" (ngSubmit)=\"onSubmit()\">\n            <div class=\"container-fluid\" style=\"max-width:1000px;background:#eee;\">\n                \n                <!-- Header -->\n                <div class=\"row\" style=\"background: #444;padding-left: 10px;\">\n                    <h2 style=\"color: #89E894;\"><span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\" style=\"top: 2px;\"></span> {{ (isUpdate) ? 'Edit Spice' : 'Add Spice' }}</h2>\n                </div>\n                \n                <!-- Entry View -->\n                <div class=\"row\" *ngIf=\"showStatus !== true\">\n                    <div class=\"col-sm-6\" style=\"padding-top: 15px;\">\n                        <div class=\"form-group\" [class.has-error]=\"!name.valid && !name.pristine\">\n                            <label for=\"inputName\">Name</label>\n                            <input type=\"text\" [(ngModel)]=\"spice.name\" ngControl=\"name\" #name=\"ngForm\" class=\"form-control\" id=\"inputName\" name=\"inputName\" placeholder=\"Name\" required>\n                            <div [hidden]=\"name.valid || name.pristine\" class=\"help-block\" role=\"alert\">\n                                <div>This field is required</div>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"inputDescription\">Description</label>\n                            <textarea [(ngModel)]=\"spice.description\" ngControl=\"description\" #description=\"ngForm\" class=\"form-control\" id=\"inputDescription\"></textarea>\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"inputImageURL\">Image URL</label>\n                            <input type=\"text\" [(ngModel)]=\"spice.imageURL\" class=\"form-control\" id=\"inputImageURL\" placeholder=\"Image URL\">\n                        </div>\n                        <img *ngIf=\"spice.imageURL\" src=\"{{spice.imageURL}}\" style=\"width:100%;margin-bottom: 15px;\">\n                    </div>\n                    <div class=\"col-sm-6\" style=\"background: #ddd;padding-top: 15px;\">\n                        <div class=\"row\">\n                        <div class=\"col-sm-4\">\n                            <div class=\"form-group\" [class.has-error]=\"!prepTime.valid && !prepTime.pristine\">\n                                <label><span class=\"glyphicon glyphicon-time\" aria-hidden=\"true\" style=\"top: 2px;\"></span> Prep (min)</label>\n                                <input name=\"inputPrepTime\" [(ngModel)]=\"spice.prepTime\" ngControl=\"prepTime\" #prepTime=\"ngForm\" class=\"form-control\" type=\"number\" min=\"1\" max=\"999\" ng-maxlength=\"3\">\n                                <div [hidden]=\"prepTime.valid || prepTime.pristine\" class=\"help-block\" role=\"alert\">\n                                    <div>Please enter 1-999</div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"col-sm-4\">\n                            <div class=\"form-group\" [class.has-error]=\"!cookTime.valid && !cookTime.pristine\">\n                                <label><span class=\"glyphicon glyphicon-time\" aria-hidden=\"true\" style=\"top: 2px;\"></span> Cook (min)</label>\n                                <input name=\"inputCookTime\" [(ngModel)]=\"spice.cookTime\" ngControl=\"cookTime\" #cookTime=\"ngForm\" class=\"form-control\" type=\"number\" min=\"1\" max=\"999\" ng-maxlength=\"3\">\n                                <div [hidden]=\"cookTime.valid || cookTime.pristine\" class=\"help-block\" role=\"alert\">\n                                    <div>Please enter 1-999</div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"col-sm-4\">\n                            <div class=\"form-group\" [class.has-error]=\"!servings.valid && !servings.pristine\">\n                                <label><span class=\"glyphicon glyphicon-cutlery\" aria-hidden=\"true\" style=\"top: 2px;\"></span> Servings</label>\n                                <input name=\"inputServings\" [(ngModel)]=\"spice.servings\" ngControl=\"servings\" #servings=\"ngForm\" class=\"form-control\" type=\"number\" min=\"1\" max=\"99\" ng-maxlength=\"2\">\n                                <div [hidden]=\"servings.valid || servings.pristine\" class=\"help-block\" role=\"alert\">\n                                    <div>Please enter 1-99</div>\n                                </div>\n                            </div>\n                        </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"inputIngredients\">Ingredients</label>\n                            <textarea [(ngModel)]=\"spice.ingredients\" ngControl=\"ingredients\" #ingredients=\"ngForm\" rows=\"4\" class=\"form-control\" id=\"inputIngredients\"></textarea>\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"inputDirections\">Directions</label>\n                            <textarea [(ngModel)]=\"spice.directions\" ngControl=\"directions\" #directions=\"ngForm\" rows=\"4\" class=\"form-control\" id=\"inputDirections\"></textarea>\n                        </div>\n                        <div class=\"form-group\" style=\"margin-bottom:0;padding-bottom:15px;\">\n                            <label for=\"inputTags\">Tags</label>\n                            <input name=\"tags\" [(ngModel)]=\"spice.tags\" ngControl=\"tags\" #tags=\"ngForm\" class=\"form-control\" maxlength=\"100\" />                            \n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\" *ngIf=\"showStatus !== true\">\n                    <div class=\"col-xs-12\" style=\"background:#89E894;padding-top: 15px;padding-bottom: 10px;\">\n                        <button type=\"submit\" class=\"btn btn-success pull-right\" [disabled]=\"!spiceForm.form.valid\"><span class=\"glyphicon glyphicon-send\" aria-hidden=\"true\"></span> Submit</button>\n                        <button [hidden]=\"isUpdate === false\" type=\"button\" class=\"btn btn-default pull-right\" (click)=\"cancel()\" style=\"margin-right:4px;\">Cancel</button>\n                    </div>\n                </div>\n                \n                <!-- Status View -->\n                <div class=\"row\" *ngIf=\"showStatus === true\">\n                    <div class=\"col-xs-12\" style=\"padding: 15px;\">\n                        <div class=\"app-alert app-alert-success\" style=\"border-color: #4BC74D;\">\n                            <h4><span class=\"glyphicon glyphicon-ok\" style=\"top: 6px;padding-right: 10px;color: #4BC74D;\"></span>Spice submitted successfully!</h4>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\" *ngIf=\"showStatus === true\">\n                    <div class=\"col-xs-12\" style=\"background:#89E894;padding-top: 15px;padding-bottom: 20px;\">\n                        <button class=\"btn btn-success pull-right\" (click)=\"ok()\">OK</button>\n                    </div>\n                </div>\n                \n            </div>\n        </form>\n    "
                    }), 
                    __metadata('design:paramtypes', [spice_service_3.SpiceService])
                ], AddSpice);
                return AddSpice;
            }());
            exports_6("AddSpice", AddSpice);
        }
    }
});
System.register("components/loginbutton.component", ['@angular/core', '@angular/router', 'angularfire2'], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var core_6, router_3, angularfire2_4;
    var LoginButton;
    return {
        setters:[
            function (core_6_1) {
                core_6 = core_6_1;
            },
            function (router_3_1) {
                router_3 = router_3_1;
            },
            function (angularfire2_4_1) {
                angularfire2_4 = angularfire2_4_1;
            }],
        execute: function() {
            LoginButton = (function () {
                function LoginButton(router, af) {
                    this.router = router;
                    this.af = af;
                    var vm = this;
                    af.auth.subscribe(function (user) {
                        if (user) {
                            vm.profileImageURL = user.google.profileImageURL;
                            vm.displayName = user.google.displayName;
                        }
                    });
                }
                LoginButton.prototype.logout = function () {
                    this.af.auth.logout();
                    this.router.navigate(['MyFeed']);
                };
                LoginButton = __decorate([
                    core_6.Component({
                        selector: 'login-button',
                        template: "\n    <button *ngIf=\"!(af.auth | async)\" class=\"btn btn-success\" (click)=\"af.auth.login()\"><span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span> Login</button>\n\n    <ul *ngIf=\"af.auth | async\" class=\"userDropdown\">\n        <li>\n            <a href=\"#\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                <img src=\"{{ profileImageURL }}\"><span class=\"hidden-xs\">{{ displayName }}&nbsp;&nbsp;</span><span style=\"color:#89E894;\" class=\"glyphicon glyphicon-chevron-down\" aria-hidden=\"true\"></span>\n            </a>\n            <ul class=\"dropdown-menu\">\n                <li><a (click)=\"logout()\">Logout</a></li>\n            </ul>\n        </li>\n    </ul>\n  "
                    }), 
                    __metadata('design:paramtypes', [router_3.Router, angularfire2_4.AngularFire])
                ], LoginButton);
                return LoginButton;
            }());
            exports_7("LoginButton", LoginButton);
        }
    }
});
System.register("app.component", ['@angular/core', '@angular/common', '@angular/router', 'angularfire2', 'rxjs/add/operator/debounceTime', "services/search.service", "spice/spice.service", "spice/spice-feed.component", "spice/add-spice.component", "components/loginbutton.component"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var core_7, common_2, router_4, angularfire2_5, search_service_2, spice_service_4, spice_feed_component_1, add_spice_component_1, loginbutton_component_1;
    var SpiceApp;
    return {
        setters:[
            function (core_7_1) {
                core_7 = core_7_1;
            },
            function (common_2_1) {
                common_2 = common_2_1;
            },
            function (router_4_1) {
                router_4 = router_4_1;
            },
            function (angularfire2_5_1) {
                angularfire2_5 = angularfire2_5_1;
            },
            function (_3) {},
            function (search_service_2_1) {
                search_service_2 = search_service_2_1;
            },
            function (spice_service_4_1) {
                spice_service_4 = spice_service_4_1;
            },
            function (spice_feed_component_1_1) {
                spice_feed_component_1 = spice_feed_component_1_1;
            },
            function (add_spice_component_1_1) {
                add_spice_component_1 = add_spice_component_1_1;
            },
            function (loginbutton_component_1_1) {
                loginbutton_component_1 = loginbutton_component_1_1;
            }],
        execute: function() {
            SpiceApp = (function () {
                function SpiceApp(searchService, spiceService, router, af) {
                    this.searchService = searchService;
                    this.spiceService = spiceService;
                    this.router = router;
                    this.af = af;
                    this.search = new common_2.Control();
                    this.search.valueChanges.debounceTime(250).subscribe(function (search) { return searchService.onSearch(search); });
                }
                SpiceApp.prototype.openAddSpice = function () {
                    this.spiceService.setObj(null);
                    this.router.navigate(['/addSpice']);
                };
                SpiceApp = __decorate([
                    core_7.Component({
                        selector: 'spice-app',
                        directives: [router_4.ROUTER_DIRECTIVES, loginbutton_component_1.LoginButton],
                        providers: [router_4.ROUTER_PROVIDERS, search_service_2.SearchService, spice_service_4.SpiceService],
                        template: "\n    <nav class=\"navbar navbar-default navbar-inverse navbar-fixed-top\">\n    <div class=\"container-fluid\">\n        <login-button class=\"pull-right\" style=\"margin-top:8px;\"></login-button>\n        \n        <!-- Brand and toggle get grouped for better mobile display -->\n        <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar-collapse\" aria-expanded=\"false\">\n            <span class=\"sr-only\">Toggle navigation</span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" [routerLink]=\"['/']\"><span style=\"color:#89E894\" class=\"glyphicon glyphicon-grain\" aria-hidden=\"true\"></span> All Spice</a>\n        </div>\n\n        <div class=\"collapse navbar-collapse\" id=\"navbar-collapse\">\n        <ul class=\"nav navbar-nav\">\n            <li><a [routerLink]=\"['/']\">My Feed</a></li>\n            <li *ngIf=\"af.auth | async\" ><a [routerLink]=\"['/','mySpice']\">My Spice</a></li>\n        </ul>\n\n        <ul *ngIf=\"af.auth | async\" class=\"nav navbar-nav navbar-right\" style=\"margin-right:0px;\">\n            <li><a (click)=\"openAddSpice()\"><span style=\"color:#89E894\" class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Add Spice</a></li>\n        </ul>\n\n        <form class=\"navbar-form navbar-right hidden-xs\" role=\"search\" style=\"margin-right:0\">\n          <div class=\"form-group\">\n            <div class=\"input-group\">\n                <div class=\"input-group-addon\">\n                <span style=\"color:#89E894\" class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span>\n                </div>\n                <input [ngFormControl]=\"search\" type=\"text\" class=\"form-control search-input\" placeholder=\"Search\" />\n            </div>\n          </div>\n        </form>\n        </div>\n    </div>\n    </nav>\n    <router-outlet></router-outlet>    \n    "
                    }),
                    router_4.Routes([
                        { path: '/', component: spice_feed_component_1.SpiceFeed },
                        { path: '/addSpice', component: add_spice_component_1.AddSpice },
                        { path: '/:state', component: spice_feed_component_1.SpiceFeed }
                    ]), 
                    __metadata('design:paramtypes', [search_service_2.SearchService, spice_service_4.SpiceService, router_4.Router, angularfire2_5.AngularFire])
                ], SpiceApp);
                return SpiceApp;
            }());
            exports_8("SpiceApp", SpiceApp);
        }
    }
});
System.register("main", ['@angular/core', '@angular/platform-browser-dynamic', 'angularfire2', '@angular/common', '@angular/router', "app.component"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var core_8, platform_browser_dynamic_1, angularfire2_6, common_3, router_5, app_component_1;
    return {
        setters:[
            function (core_8_1) {
                core_8 = core_8_1;
            },
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (angularfire2_6_1) {
                angularfire2_6 = angularfire2_6_1;
            },
            function (common_3_1) {
                common_3 = common_3_1;
            },
            function (router_5_1) {
                router_5 = router_5_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            }],
        execute: function() {
            platform_browser_dynamic_1.bootstrap(app_component_1.SpiceApp, [
                router_5.ROUTER_PROVIDERS,
                angularfire2_6.FIREBASE_PROVIDERS,
                angularfire2_6.defaultFirebase('https://amber-heat-8766.firebaseio.com'),
                angularfire2_6.firebaseAuthConfig({
                    method: angularfire2_6.AuthMethods.Popup,
                    provider: angularfire2_6.AuthProviders.Google
                }),
                core_8.provide(common_3.APP_BASE_HREF, { useValue: '/' }),
                core_8.provide(common_3.LocationStrategy, { useClass: common_3.PathLocationStrategy })
            ]);
        }
    }
});
