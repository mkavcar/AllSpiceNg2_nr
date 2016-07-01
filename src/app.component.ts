import { Component, ViewChild } from '@angular/core';
import { Control } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { AngularFire } from 'angularfire2';
import 'rxjs/add/operator/debounceTime';
///<reference path="../typings/browser/main/jquery/index.d.ts" />

import { StateService } from './services/state.service';
import { SpiceService } from './spice/spice.service';
import { SpiceFeed } from './spice/spice-feed.component';
import { LoginButton } from './components/loginbutton.component';
import { AddSpiceModal } from './spice/add-spice-modal.component';
import { Spice } from './spice/spice.model';

@Component({
    selector: 'spice-app',
    directives: [ SpiceFeed, LoginButton, AddSpiceModal ],
    providers: [ StateService, SpiceService ],
    template: `
    <nav class="navbar navbar-default navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header pull-left">
                <div class="navbar-brand"><span style="color:#89E894" class="glyphicon glyphicon-grain" aria-hidden="true"></span> All Spice</div>
            </div>

            <login-button class="pull-right" style="margin-top:8px;"></login-button>

            <ul *ngIf="af.auth | async" class="nav navbar-nav navbar-right pull-right" style="margin-right:0px;">
                <li><a (click)="openSpiceModal(null)"><span style="color:#89E894" class="glyphicon glyphicon-plus" aria-hidden="true" title="Add Spice"></span><span class="hidden-xs"> Add Spice</span></a></li>
            </ul>
            
            <ul class="nav navbar-nav navbar-link">
                <li *ngIf="af.auth | async"><a (click)="filterFeed()" title="{{ showAllState ? 'Show My Spice' : 'Show All' }}"><span style="color:#89E894" class="glyphicon glyphicon-{{ showAllState ? 'heart-empty' : 'heart' }}" aria-hidden="true"></span><span class="hidden-xs">{{ showAllState ? ' Show My Spice' : ' Show All' }}</span></a></li>
            </ul>
            
            <form class="navbar-form navbar-right hidden-xs" role="search" style="margin-right:0">
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-addon">
                        <span style="color:#89E894" class="glyphicon glyphicon-search" aria-hidden="true"></span>
                        </div>
                        <input [ngFormControl]="search" type="text" class="form-control search-input" placeholder="Search" />
                    </div>
                </div>
            </form>
        </div>
    </nav>
    <spice-feed (onFeedEdit)="openSpiceModal($event)"></spice-feed>    
    <add-spice-modal></add-spice-modal>
    `
})

export class SpiceApp {
    @ViewChild(AddSpiceModal) addSpiceModal:AddSpiceModal;
    search = new Control();
    showAllState: boolean = true;
    
    constructor(private stateService: StateService, private spiceService: SpiceService, public af: AngularFire) {
        this.search.valueChanges.debounceTime(250).subscribe(
            search => stateService.onSearch(search)
        );
        
        stateService.state$.subscribe(
            state => this.showAllState = state.showAll
        );
    }
    
    openSpiceModal(spice?: Spice) {
        this.addSpiceModal.open(spice);
    }
    
    filterFeed() {
        this.stateService.onShowAll(!this.showAllState);
    }
}