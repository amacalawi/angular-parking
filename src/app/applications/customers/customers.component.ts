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
  log(state: any) {
    console.log(state)
  }

  opened2 = false;
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
  documentHeight: any;

  toggleForm(activeForm: boolean) {
    if(activeForm == false) {
        this.documentHeight = <HTMLElement> document.querySelector('.content-table');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
    } else {
        this.documentHeight = <HTMLElement> document.querySelector('.content-form');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
    }
    console.log(this.documentHeight);
    activeForm = !false;
    
  }

}
