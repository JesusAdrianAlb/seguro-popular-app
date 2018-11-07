import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';



@Directive({
  selector: '[appCustomMinLength]'
})
export class CustomMinLengthDirective {

  @Input('appCustomMinLength') MinLength: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  constructor() { }

  @HostListener('keyup', ['$event']) onKeyup(event) {
    const element = event.target as HTMLInputElement;
    const limit = this.MinLength;
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
