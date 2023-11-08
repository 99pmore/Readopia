import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoDecimals',
  standalone: true
})
export class TwoDecimalsPipe implements PipeTransform {

  transform(value: number): number {
    if (value || value === 0) {
      return parseFloat(value.toFixed(2))
    }
    return 0
  }

}
