import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  opened = false;
  opened2 = false;

  log(state: any) {
    console.log(state)
  }

  log2(state: any) {
    console.log(state)
  }

  goTo(link: string) {
    setTimeout(() => {
      this.router.navigate(['/' + link]);
    }, 300);
  }

  searchbar = true;
  toggleClass(searchbar: boolean) {
    searchbar = !false;
  }

}
