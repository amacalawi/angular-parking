import { EventEmitter, Injectable} from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MenuItems } from '../shared/menu';

@Injectable()
export class NavService {
  public leftSidebar: any;
  public rightSidebar: any;
  public currentUrl = new BehaviorSubject<string>(undefined);

  constructor(private router: Router,
    public menuItems: MenuItems
    
    ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public closeNav() {
    this.leftSidebar.close();
  }

  public getCredential() {
    return this.menuItems.getCredentials();
  }

  public openNav() {
    this.leftSidebar.open();
    console.log('open');
  }

  public closeSidebar() {
    this.rightSidebar.close();
  }

  public openSidebar() {
    this.rightSidebar.open();
  }


}
