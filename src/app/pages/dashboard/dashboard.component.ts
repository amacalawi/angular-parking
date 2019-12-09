import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService } from '../../services/nav.services'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    pageTitle: string;
      
    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute
    ) {   
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");
    }

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/login'], { replaceUrl: true });
        }
    }
}
