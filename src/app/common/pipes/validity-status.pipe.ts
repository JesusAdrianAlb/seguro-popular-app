import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validityStatus'
})
export class ValidityStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'A':
      return 'Activo';
      default:
      return 'Inactivo';
    }
  }

}
