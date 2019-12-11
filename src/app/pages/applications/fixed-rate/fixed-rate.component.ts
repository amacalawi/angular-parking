import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService } from '../../../services/nav.services'

@Component({
  selector: 'app-fixed-rate',
  templateUrl: './fixed-rate.component.html',
  styleUrls: ['./fixed-rate.component.scss']
})
export class FixedRateComponent implements OnInit {
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
