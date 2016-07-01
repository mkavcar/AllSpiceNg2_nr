import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Control } from '@angular/common';
import { Observable } from 'rxjs';
import { Subscription }   from 'rxjs/Subscription';
import { AngularFire } from 'angularfire2';
import 'rxjs/add/operator/debounceTime';

import { SpiceService } from './spice.service';
import { SpiceCard } from './spice-card.component';
import { StateService } from '../services/state.service';
import { Spice } from './spice.model';
import { State } from '../services/state.model';

@Component({
    selector: 'spice-feed',
    directives: [ SpiceCard ],
    template: `
    <div class="form-group visible-xs-block" style="padding: 10px;margin: 0;background: #5CB85C;">
        <div class="input-group">
            <div class="input-group-addon">
                <span style="color:#89E894" class="glyphicon glyphicon-search" aria-hidden="true"></span>
            </div>
            <input [ngFormControl]="search" type="text" class="form-control search-input" placeholder="Search" style="-webkit-box-shadow:none;box-shadow:none;">
        </div>
    </div>
    <spice-card *ngFor="let spice of spices; trackBy: spice?.$id" [spice]="spice" (onEdit)="onEdit($event)"></spice-card>
    <div *ngIf="!loading && spices.length === 0" class="app-alert app-alert-warning">
        <h4><span class="glyphicon glyphicon-grain"></span> No spice found</h4>
    </div>
    `
})

export class SpiceFeed implements OnInit, OnDestroy {
    @Output() onFeedEdit = new EventEmitter<Spice>();
    private uid: string;
    loading: boolean = true;
    spices: Array<Spice>;
    stateSub: Subscription;
    inputSub: Subscription;
    authSub: Subscription;
    search = new Control();
    
    constructor(private spiceService: SpiceService, private stateService: StateService, private af:AngularFire) {
        this.authSub = this.af.auth.subscribe(
            user => this.uid = (user) ? user.uid : null
        );
        
        this.stateSub = stateService.state$.subscribe(
            state => this.load()
        );
        
        this.inputSub = this.search.valueChanges.debounceTime(250).subscribe(
            search => stateService.onSearch(search)
        );
    }
    
    load() {
        this.loading = true;
        let state = this.stateService.getLast();
        
        this.spiceService.getAll(state.showAll ? null : this.uid, state.search).subscribe(
            spices => { 
                this.spices = spices;
                this.loading = false;                 
            }
        );
    }
    
    onEdit(spice: Spice) {
        this.onFeedEdit.emit(spice);
    }
        
    ngOnInit() {
        this.load();
    }
    
    ngOnDestroy() {
        this.stateSub.unsubscribe();
        this.authSub.unsubscribe();
        this.inputSub.unsubscribe();
    }
}