import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRutFormatter]',
  standalone: true,
})
export class RutFormatterDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement.value;
    this.el.nativeElement.value = this.formatRut(input);
  }
  @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent): void {
    const input = this.el.nativeElement.value;
    this.el.nativeElement.value = this.formatRut(input);
    this.el.nativeElement.dispatchEvent(new Event('input'));
  }
  private formatRut(value: string): string {
    let newValue = value.replace(/[^0-9kK]/g, '');
    if (newValue.length > 1) {
      newValue = newValue.slice(0, -1) + '-' + newValue.slice(-1);
    }
    if (newValue.length > 5) {
      newValue = newValue.slice(0, -5) + '.' + newValue.slice(-5);
    }
    if (newValue.length > 9) {
      newValue = newValue.slice(0, -9) + '.' + newValue.slice(-9);
    }
    return newValue;
  }
}
