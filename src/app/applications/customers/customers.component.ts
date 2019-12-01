import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  collection = { count: 60, data: [] };
  config = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.collection.count
  };
 
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
      previousLabel: '',
      nextLabel: '',
      screenReaderPaginationLabel: 'Pagination',
      screenReaderPageLabel: 'page',
      screenReaderCurrentLabel: `You're on page`
  };

  constructor(private router: Router) { 
    for (var i = 0; i < this.collection.count; i++) {
      this.collection.data.push(
        {
          id: i + 1,
          value: "items number " + (i + 1)
        }
      );
    }
  }

  ngOnInit() {
  }

  onPageChange(event){
    console.log(event);
    this.config.currentPage = event;
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

  activeForm = false;
  toggleForm(activeForm: boolean) {
    activeForm = !false;
  }

}
