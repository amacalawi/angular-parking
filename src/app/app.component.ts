import { Component } from '@angular/core';
import { NavItem } from './shared/nav-item';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'point-of-sales';
    navItems: NavItem[] = [
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

}
