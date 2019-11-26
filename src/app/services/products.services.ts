import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable() 
export class ProductsService {
  private _jsonURL = 'assets/data/products.json';
  constructor(private httpClient: HttpClient) {
  }
  
  /**
   * Load books from the static books.json data, usually an API URL.
   * 
   * @return {Observable<Product[]>} A list of books.
   */

  getProducts(): Observable<any[]> {
    return this.httpClient
      .get(this._jsonURL)
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not load joke :-('))
      );
  }

  // getProducts(): Observable<Product[]> {
  //   return this.http.get('app/data/products.json') 
  //   .subscribe(data => {
  //      console.log(data);
  //   });
  //   .catch(res => console.log(res));


  //   // return this.http.get('app/data/products.json')
  //   //   .map(res => res.json().data)
  //   //   .catch(res => console.log(res));
  // }
}