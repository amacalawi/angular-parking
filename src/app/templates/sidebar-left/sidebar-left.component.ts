import { Component, HostBinding, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from '../../shared/nav-item';
import { MenuItems } from '../../shared/menu';
import { NavService } from '../../services/nav.services';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CredentialsService } from '../../core/authentication/credentials.service';

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SidebarLeftComponent implements OnInit, OnDestroy {
    expanded: boolean;
    @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
    @Input() items: NavItem;
    fullname: string;
    credential: any[];
    privileges: any[];

    constructor(
        public navService: NavService,
        public router: Router,
        public menuItems: MenuItems,
        public credentialsService: CredentialsService
    ) {
        // if (sessionStorage.credentials !== undefined) {
            // console.log(this.credential = JSON.parse(sessionStorage.credentials));
            this.items = this.menuItems.getAll();
            // console.log(this.credentialsService.credentials);
        // }
    }


    ngOnDestroy(): void {}

    ngOnInit() {
        this.credentialsService.getEmitter().subscribe((credential) => {
            this.fullname = credential['name'];
        });
        
        this.navService.currentUrl.subscribe((url: string) => {
            if (this.items.route && url) {
                console.log(`Checking '/${this.items.route}' against '${url}'`);
                this.expanded = url.indexOf(`/${this.items.route}`) === 0;
                this.ariaExpanded = this.expanded;
                console.log(`${this.items.route} is expanded: ${this.expanded}`);
            }
        });
        // this.credential = this.navService.getCredential();
        // console.log(this.fullname = this.credential['name']);
        // console.log(this.privileges = this.credential['privileges']);
    }


    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    onItemSelected(item: NavItem) {
        if (!item.children || !item.children.length) {
            if (item.route !== 'logout') {
                this.router.navigate([item.route]);
                this.navService.closeNav();
            } else {
                this.navService.closeNav();
                this.logout();
            }
        }
        if (item.children && item.children.length) {
            this.expanded = !this.expanded;
        }
    }
}
