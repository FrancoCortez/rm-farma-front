import {
  Directive,
  DoCheck,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Directive({
  selector: '[appFormControlStatus]',
  standalone: true,
})
export class FormControlStatusDirective implements DoCheck {
  @Input('appFormControlStatus') control!: AbstractControl | null;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}
  ngDoCheck(): void {
    const formControl = this.control as FormControl;
    if (formControl) {
      if (formControl.invalid && (formControl.touched || formControl.dirty)) {
        this.renderer.addClass(this.el.nativeElement, 'ng-invalid');
        this.renderer.addClass(this.el.nativeElement, 'ng-dirty');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'ng-invalid');
        this.renderer.removeClass(this.el.nativeElement, 'ng-dirty');
      }
    }
  }
}
