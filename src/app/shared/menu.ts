import { Injectable } from '@angular/core';

const MENUITEMS = [
    {
        displayName: 'Dashboard',
        iconName: 'flaticon-dashboard',
        route: 'dashboard',
        children: []
    },
    {
        displayName: 'Point Of Sales',
        iconName: 'flaticon-share',
        route: 'pos',
        children: []
    },
    {
        displayName: 'Reports',
        iconName: 'flaticon-line-graph',
        route: 'reports',
        children: []
    },
    {
        displayName: 'Applications',
        iconName: 'flaticon-interface-7',
        route: 'applications',
        children: [
            {
                displayName: 'Customers',
                iconName: '',
                route: 'applications/customers'
            },
            {
                displayName: 'Vehicles',
                iconName: '',
                route: 'applications/vehicles'
            },
            {
                displayName: 'Fix Rate',
                iconName: '',
                route: 'applications/fix-rates'
            }
        ]
    }
]; 

@Injectable({
    providedIn: 'root'
})
export class MenuItems {
  getAll(): any {
    return MENUITEMS;
  }
}
