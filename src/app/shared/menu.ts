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
        displayName: 'Load Credit',
        iconName: 'flaticon-gift',
        route: 'load-credit',
        children: []
    },
    {
        displayName: 'Applications',
        iconName: 'flaticon-interface-7',
        route: '',
        children: [
            {
                displayName: 'Customers',
                iconName: '',
                route: 'applications/customers',
                children: []
            },
            {
                displayName: 'Vehicles',
                iconName: '',
                route: 'applications/vehicles',
                children: []
            },
            {
                displayName: 'Fix Rate',
                iconName: '',
                route: 'applications/fixed-rate',
                children: []
            },
            {
                displayName: 'Subscription Rate',
                iconName: '',
                route: 'applications/subscription-rate',
                children: []
            },
            {
                displayName: 'Users',
                iconName: '',
                route: 'applications/users',
                children: []
            }
        ]
    },
    {
        displayName: 'Account',
        iconName: 'flaticon-settings',
        route: 'account',
        children: []
    },
    {
        displayName: 'Signout',
        iconName: 'flaticon-logout',
        route: 'logout',
        children: []
    }
]; 

@Injectable({
    providedIn: 'root'
})
export class MenuItems {
  getCredentials(): any {
    return JSON.parse(sessionStorage.credentials);
  }
  getAll(): any {
    return MENUITEMS;
  }
}
