import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { 

    }

    ngOnDestroy(): void {}

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {

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
}
