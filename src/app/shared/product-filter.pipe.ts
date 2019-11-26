import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './product';

@Pipe({
    name: 'productfilter',
    pure: false
})
export class ProductFilterPipe implements PipeTransform {
  transform(items: Product[], filter: Product): Product[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Product) => this.applyFilter(item, filter));
  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Product} Product The Product to compare to the filter.
   * @param {Product} filter The filter to apply.
   * @return {boolean} True if Product satisfies filters, false if not.
   */
  applyFilter(Product: Product, filter: Product): boolean {
    for (let field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (Product[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (Product[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}