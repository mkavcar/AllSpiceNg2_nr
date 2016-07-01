import { Component, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/common';
///<reference path="../../typings/browser/main/jquery/index.d.ts" />

import { SpiceService } from './spice.service';
import { Spice } from './spice.model';

@Component({
    selector: 'add-spice-modal',
    template: `
    <div class="modal fade" id="addSpiceModal" tabindex="-1" role="dialog" aria-labelledby="addSpiceModal" data-backdrop="static">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
      
                <form *ngIf="active" novalidate #spiceForm="ngForm">
                    <div class="container-fluid" style="max-width:1000px;background:#eee;">
                        
                        <!-- Header -->
                        <div class="row" style="background: #444;padding-left: 10px;">
                            <h2 style="color: #89E894;"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true" style="top: 2px;"></span> {{ (isUpdate) ? 'Edit Spice' : 'Add Spice' }}</h2>
                        </div>
                        
                        <!-- Entry View -->
                        <div class="row" *ngIf="showStatus !== true">
                            <div class="col-sm-6" style="padding-top: 15px;">
                                <div class="form-group" [class.has-error]="!name.valid && !name.pristine">
                                    <label for="inputName">Name</label>
                                    <input type="text" [(ngModel)]="spice.name" ngControl="name" #name="ngForm" class="form-control" id="inputName" name="inputName" placeholder="Name" required>
                                    <div [hidden]="name.valid || name.pristine" class="help-block" role="alert">
                                        <div>This field is required</div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputDescription">Description</label>
                                    <textarea [(ngModel)]="spice.description" ngControl="description" #description="ngForm" class="form-control" id="inputDescription"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="inputImageURL">Image URL</label>
                                    <input type="text" [(ngModel)]="spice.imageURL" class="form-control" id="inputImageURL" placeholder="Image URL">
                                </div>
                                <img *ngIf="spice.imageURL" src="{{spice.imageURL}}" style="width:100%;margin-bottom: 15px;">
                            </div>
                            <div class="col-sm-6" style="background: #ddd;padding-top: 15px;">
                                <div class="row">
                                <div class="col-sm-4">
                                    <div class="form-group" [class.has-error]="!prepTime.valid && !prepTime.pristine">
                                        <label><span class="glyphicon glyphicon-time" aria-hidden="true" style="top: 2px;"></span> Prep (min)</label>
                                        <input name="inputPrepTime" [(ngModel)]="spice.prepTime" ngControl="prepTime" #prepTime="ngForm" class="form-control" maxlength="3" pattern="^([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$" />
                                        <div [hidden]="prepTime.valid || prepTime.pristine" class="help-block" role="alert">
                                            <div>Please enter 1-999</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group" [class.has-error]="!cookTime.valid && !cookTime.pristine">
                                        <label><span class="glyphicon glyphicon-time" aria-hidden="true" style="top: 2px;"></span> Cook (min)</label>
                                        <input name="inputCookTime" [(ngModel)]="spice.cookTime" ngControl="cookTime" #cookTime="ngForm" class="form-control" maxlength="3" pattern="^([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$" />
                                        <div [hidden]="cookTime.valid || cookTime.pristine" class="help-block" role="alert">
                                            <div>Please enter 1-999</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group" [class.has-error]="!servings.valid && !servings.pristine">
                                        <label><span class="glyphicon glyphicon-cutlery" aria-hidden="true" style="top: 2px;"></span> Servings</label>
                                        <input name="inputServings" [(ngModel)]="spice.servings" ngControl="servings" #servings="ngForm" class="form-control" maxlength="2" pattern="^([1-9]|[1-9][0-9])$" />
                                        <div [hidden]="servings.valid || servings.pristine" class="help-block" role="alert">
                                            <div>Please enter 1-99</div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputIngredients">Ingredients</label>
                                    <textarea [(ngModel)]="spice.ingredients" ngControl="ingredients" #ingredients="ngForm" rows="4" class="form-control" id="inputIngredients"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="inputDirections">Directions</label>
                                    <textarea [(ngModel)]="spice.directions" ngControl="directions" #directions="ngForm" rows="4" class="form-control" id="inputDirections"></textarea>
                                </div>
                                <div class="form-group" style="margin-bottom:0;padding-bottom:15px;">
                                    <label for="inputTags">Tags</label>
                                    <input name="tags" [(ngModel)]="spice.tags" ngControl="tags" #tags="ngForm" class="form-control" maxlength="100" />                            
                                </div>
                            </div>
                        </div>
                        <div class="row" *ngIf="showStatus !== true">
                            <div class="col-xs-12" style="background:#89E894;padding-top: 15px;padding-bottom: 10px;">
                                <button type="button" (click)="submit()" class="btn btn-success pull-right" [disabled]="!spiceForm.form.valid"><span class="glyphicon glyphicon-send" aria-hidden="true"></span> Submit</button>
                                <button type="button" (click)="close()" class="btn btn-default pull-right" style="margin-right:4px;">Cancel</button>
                            </div>
                        </div>
                        
                        <!-- Status View -->
                        <div class="row" *ngIf="showStatus === true">
                            <div class="col-xs-12" style="padding: 15px;">
                                <div class="app-alert app-alert-success" style="border-color: #4BC74D;">
                                    <h4><span class="glyphicon glyphicon-ok" style="top: 6px;padding-right: 10px;color: #4BC74D;"></span>Spice submitted successfully!</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row" *ngIf="showStatus === true">
                            <div class="col-xs-12" style="background:#89E894;padding-top: 15px;padding-bottom: 20px;">
                                <button class="btn btn-success pull-right" (click)="close()">OK</button>
                            </div>
                        </div>
                        
                    </div>
                </form>
                      
            </div>
        </div>
    </div>        
    `
})

export class AddSpiceModal implements AfterViewInit {
    modalObj: any;
    active: boolean = true;
    spice: Spice = new Spice();
    isUpdate: boolean = false;
    showStatus: boolean = false;
    
    constructor(private spiceService: SpiceService) {}
    
    ngAfterViewInit() {
        if (!this.modalObj)
            this.modalObj = $('#addSpiceModal'); 
    }
    
    open(spice: Spice) {
        this.showStatus = false;
                
        if (spice !== null) {
            this.spice = spice;
            this.isUpdate = true;
        }
        else {
            this.spice = new Spice();
            this.isUpdate = false;
        }
            
        this.modalObj.modal('show');
    }
    
    submit() {
        if (this.isUpdate)
            this.spiceService.update(this.spice.$key, this.spice);
        else
            this.spiceService.add(this.spice);
            
        this.spice = new Spice();
        
        //workaround until angular has a form reset method
        this.active = false;
        setTimeout(()=> this.active=true, 0);
        
        this.showStatus = true;
    }    
    
    close() {
        this.modalObj.modal('hide');
    }
}