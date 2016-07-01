import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'login-button',
  template: `
    <button *ngIf="!(af.auth | async)" class="btn btn-success" (click)="af.auth.login()"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Login</button>

    <ul *ngIf="af.auth | async" class="userDropdown">
        <li>
            <a href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src="{{ profileImageURL }}" title="{{ displayName }}"><span class="hidden-xs">{{ displayName }}&nbsp;&nbsp;</span><span style="color:#89E894;top: 6px;" class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
            </a>
            <ul class="dropdown-menu">
                <li><a (click)="logout()">Logout</a></li>
            </ul>
        </li>
    </ul>
  `
})

export class LoginButton {
    profileImageURL: string;
    displayName: string;
  
    constructor(public af:AngularFire) {
        af.auth.subscribe(user => {
            if (user) {
                this.profileImageURL = user.google.profileImageURL; 
                this.displayName = user.google.displayName; 
            }            
        });
    }
    
    logout() {
        this.af.auth.logout();        
    }
}