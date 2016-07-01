import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs';

import { SpiceService } from './spice.service';
import { Spice } from './spice.model';

@Component({
    selector: 'spice-card',
    template: `
    <div class="container-fluid spice-card">
      <div class="row animate-show-flipInX" *ngIf="userId">
        <div *ngIf="showConfirm !== true" class="col-xs-12 animate-show" style="background:#89E894;padding-bottom:10px;padding-top:10px;">
          <button *ngIf="userId !== spice.user.uid" (click)="togglePin()" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-heart" aria-hidden="true" title="Pin\Unpin to My Feed"></span> {{ (isPinned) ? 'Unpin' : 'Pin' }}</button>
          <button *ngIf="userId === spice.user.uid" (click)="edit()" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</button>
          <button *ngIf="userId === spice.user.uid" (click)="showConfirm = true" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</button>
        </div>
        <div *ngIf="showConfirm === true" class="col-xs-12 animate-show" style="padding: 0;">
          <div class="alert alert-danger clearfix" style="border-radius:0;margin-bottom:0;padding-bottom: 9px;padding-top: 9px;">
            <div class="pull-left" style="line-height:30px;">
              <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true" style="font-size: 1.4em;top: 6px;padding-right: 10px;"></span>Are you sure you want to delete this spice?    
            </div>
            <div class="pull-right">
              <button (click)="showConfirm = false" class="btn btn-default btn-sm">Cancel</button>
              <button (click)="delete()" class="btn btn-danger btn-sm">Delete</button>  
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="background:white;">
        <div class="col-sm-6">
          <h2>{{spice.name}}</h2>
          <div class="clearfix" style="padding-bottom: 10px;">
            <img src="{{spice.user.profileImageURL}}" class="pull-left" style="margin-right:10px;border-radius: 50%;width:32px;">
            <div class="pull-left">
              <a href="#"><strong>{{spice.user.name}}</strong></a>
              <div><small>{{spice.timestamp | date:'short'}}</small></div>
            </div>
          </div>
          <div class="row" style="padding-bottom: 10px;">
            <div class="col-xs-4">
              <span class="glyphicon glyphicon-time" aria-hidden="true"></span> Prep (min)
              <div style="color: #26B937;font-size: 24px;">{{(spice.prepTime) ? spice.prepTime : '-'}}</div>
            </div>
            <div class="col-xs-4">
              <span class="glyphicon glyphicon-time" aria-hidden="true"></span> Cook (min)
              <div style="color:#26B937; font-size: 24px;">{{(spice.cookTime) ? spice.cookTime : '-'}}</div>
            </div>
            <div class="col-xs-4">
              <span class="glyphicon glyphicon-cutlery" aria-hidden="true"></span> Servings
              <div style="color:#26B937; font-size: 24px;">{{(spice.servings) ? spice.servings : '-'}}</div>
            </div>
          </div>
          <div style="padding-bottom: 10px;">{{spice.description}}</div>
          <div *ngIf="spice.tags" style="padding-bottom: 10px;">
            <button class="btn btn-warning btn-xs" *ngFor="let tag of spice.tags.split(',')" (click)="console.log(tag)" style="margin-right:4px;">{{ tag }}</button>
          </div>
        </div>
        <div class="col-sm-6" style="padding:0">
          <img *ngIf="spice.imageURL" style="width:100%;" src="{{spice.imageURL}}">
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6" style="background: #ddd;padding: 15px;">
          <h3 style="border-bottom: 1px solid #ccc;padding-bottom: 10px;margin-top:0px;">Ingredients</h3>
          <div style="white-space: pre-wrap;">{{spice.ingredients}}</div>
        </div>
        <div class="col-sm-6" style="background: #eee;padding: 15px;">
          <h3 style="border-bottom: 1px solid #ccc;padding-bottom: 10px;margin-top:0px;">Directions</h3>
          <div style="white-space: pre-wrap;">{{spice.directions}}</div>
        </div>
      </div>
    </div>
    `
})

export class SpiceCard implements OnInit {
    @Input() spice: Spice;
    @Output() onEdit = new EventEmitter<Spice>();
    isPinned: boolean;
    userId: string;
    
    constructor(private spiceService: SpiceService, public af:AngularFire) {
        this.isPinned = false;
        this.userId = '';
    }
    
    ngOnInit() {
        this.af.auth.subscribe(user => {
            if (user) {
                this.userId = user.uid; 
                
                if (this.spice.pinnedUsers)
                    this.isPinned = (this.spice.pinnedUsers[user.uid] === true);                
            }
        });
    }
    
    edit() {
        this.onEdit.emit(this.spice);
    }
    
    delete() {
        this.spiceService.remove(this.spice.$key);
    }
    
    togglePin() {
        this.spiceService.togglePin(this.spice);
    }
}
