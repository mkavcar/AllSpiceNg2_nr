import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { State } from './state.model';

@Injectable()
export class StateService {
    private lastState: State = new State(); 
    private stateSource = new Subject<State>();
    state$ = this.stateSource.asObservable();
    
    constructor() {
        this.lastState.showAll = true;        
    }
    
    onSearch(search: string) {        
        this.lastState.search = search;
        this.stateSource.next(this.lastState);
    }
    
    onShowAll(showAll: boolean) {        
        this.lastState.showAll = showAll;
        this.stateSource.next(this.lastState);
    }
    
    getLast() {
        return this.lastState;
    }
}