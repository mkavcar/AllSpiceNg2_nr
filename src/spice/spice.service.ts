import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { Spice } from './spice.model';

@Injectable()
export class SpiceService {
    spices: FirebaseListObservable<Spice[]>;
    tags: FirebaseListObservable<any[]>;
    
    constructor(public af:AngularFire) {
        this.spices = af.list('/spices');
        this.tags = af.list('/tags');
    }
    
    getAll(uid?: string, search?: string) {
        return this.spices.map((spices) => {
          return spices
            .filter(item => this.filter(item, uid, search))
            .sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });  
        });            
    }
    
    add(spice: Spice) {
        this.af.auth.subscribe(user => {
            spice.timestamp = Firebase.ServerValue.TIMESTAMP;
            if (user) {
                spice.user = {
                    'name': user.google.displayName.toString(),
                    'profileImageURL': user.google.profileImageURL.toString(),
                    'provider' : user.provider.toString(),
                    'uid': user.uid
                };
                
                console.log(spice);
                this.spices.push(spice)
                    .then(_ => console.log('add successful'))
                    .catch(err => console.log(err, 'add error: ' + err));
            }
        });
    }
    
    update(key: string, spice: Spice) {
        console.log(spice);
        
        var newSpice: Spice = JSON.parse(JSON.stringify(spice));
        delete newSpice.$key;
           
        this.spices.update(key, newSpice)
            .then(_ => console.log(key + ' update successful'))
            .catch(err => console.log(err, key + ' update error: ' + err));
    }
    
    remove(key: string) {
        this.spices.remove(key)
            .then(_ => console.log(key + ' remove successful'))
            .catch(err => console.log(err, key + ' remove error: ' + err));
    }
    
    togglePin(spice: Spice) {
        this.af.auth.subscribe(user => {
            if (user) {
                if (spice.user.uid !== user.uid) {
                    if (!spice.pinnedUsers) 
                        spice.pinnedUsers = {};    

                    spice.pinnedUsers[user.uid] = !(spice.pinnedUsers[user.uid] === true);       
                    this.update(spice.$key, spice);
                }                
            }
        });
    }
    
    filter(item: Spice, uid?: string, search?: string) {        
        let res = true;
            
        if (uid)
            res = ((item.user && item.user.uid === uid) || (item.pinnedUsers && item.pinnedUsers[uid] === true)) ? true : false;
        
        if (res && search) {
            search = search.toLowerCase();

            res = (item.name.toLowerCase().indexOf(search) >= 0 || item.user.name.toLowerCase().indexOf(search) >= 0)
            
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
    }
}