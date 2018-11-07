import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';


@Directive({
  selector: '[appCustomMaxLength]'
})
export class CustomMaxLengthDirective {

  @Input('appCustomMaxLength') MaxLength: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  constructor(public plaform: Platform) {

  }

  @HostListener('keyup', ['$event']) onKeyup(event) {
    const element = event.target as HTMLInputElement;
    const limit = this.MaxLength;
    // alert('t');

    const value = element.value.substr(0, limit);
    // alert(value);
    if (value.length <= limit) {
        element.value = value;
    } else {
        element.value = value.substr(0, limit - 1);
    }
    this.ngModelChange.emit(element.value);
  }

  @HostListener('focus', ['$event']) onFocus(event) {
    const element = event.target as HTMLInputElement;
    // TODO: Verificar esto pa IOS
    // if (!this.plaform.is('android')) {
    //   element.setAttribute('maxlength', this.MaxLength);
    // }
  }

}
