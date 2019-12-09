import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService } from '../../../services/nav.services'

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
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
    }

}
