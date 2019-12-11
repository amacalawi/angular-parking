import { Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { VERSION } from '@angular/material';
import { NavService } from './services/nav.services';
import { MenuItems } from './shared/menu';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
    @ViewChild('leftSidebar', {static: false}) leftSidebar: ElementRef;
    @ViewChild('rightSidebar', {static: false}) rightSidebar: ElementRef;
    version = VERSION;
    
    constructor(
        private navService: NavService,
        public menuItems: MenuItems, 
    ) {
    }

    ngAfterViewInit() {
      this.navService.leftSidebar = this.leftSidebar;
      this.navService.rightSidebar = this.rightSidebar;
    }
  }
  