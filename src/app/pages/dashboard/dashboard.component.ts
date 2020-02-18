import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService } from '../../services/nav.services'
import { DashboardService } from '../../services/dashboard.services'
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    pageTitle: string;
    thisdaysales: number = 0;
    thismonthsales: number = 0;
    lastmonthsales: number = 0;
    lineChartData: ChartDataSets[]; 
    lineChartLabels: Label[];

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
        private route: ActivatedRoute,
        public dashboardService: DashboardService
    ) {   
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");
    }

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.getAllSales();
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/login'], { replaceUrl: true });
        }
    }

    getAllSales() {
        this.dashboardService.getAllSales()
        .subscribe((transactions: any) => {
            console.log(transactions);
            this.thisdaysales = transactions.thisday;
            this.thismonthsales = transactions.thismonth;
            this.lastmonthsales = transactions.lastmonth;
            this.lineChartLabels = transactions.days;
            this.lineChartData = [
                { data: transactions.amounts , label: '' }
            ];
        }, error => { 
            console.log(error);
            // this.redirect();
        });
    }

    downloadSales() {
        window.open(`${environment.serverUrl}` + '/dashboard/download-sales', '_blank');
    }
}
