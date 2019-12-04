import { Component, HostBinding, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavItem } from '../shared/nav-item';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
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
export class HomepageComponent implements OnInit, OnDestroy {
    expanded: boolean;
    @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
    @Input() item: NavItem;
    @Input() depth: number;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { 

    }

    ngOnDestroy(): void {}

    ngOnInit() {
        console.log('this is item' + this.item);
        if (sessionStorage.credentials !== undefined) {
            if (this.depth === undefined) {
                this.depth = 0;
            }

        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/login'], { replaceUrl: true });
        }
    }

    opened = false;
    log(state: any) {
        console.log(state)
    }

    opened2 = false;
    log2(state: any) {
        console.log(state)
    }

    goTo(link) {
        setTimeout (() => {
            this.router.navigate(['/' + link]);
        }, 300); 
    }

    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    onItemSelected(item: NavItem) {
        if (!item.children || !item.children.length) {
            this.router.navigate([item.route]);
        }
        if (item.children && item.children.length) {
            this.expanded = !this.expanded;
        }
    }
}
