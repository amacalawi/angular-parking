import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService } from '../../services/nav.services'
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    pageTitle: string;
    
    lineChartData: ChartDataSets[] = [
        { data: [85, 72, 78, 75, 77, 75], label: '' }
    ];

    lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

    lineChartOptions = {
        responsive: true,
        legend: {
            display: false
        },
    };

    lineChartColors: Color[] = [
        {
            borderColor: 'rgba(169,84,52,1)',
            backgroundColor: 'rgba(189,93,56,0.28)',
        },
    ];

    lineChartLegend = true;
    lineChartPlugins = [];
    lineChartType = 'line';

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
