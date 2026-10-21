import { Directive, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[appInput], textarea[appInput]',
  host: {
    class: 'form-control',
    '[class.is-invalid]': 'isInvalid',
    '[attr.aria-invalid]': 'isInvalid ? "true" : null'
  }
})
export class InputDirective {
  readonly invalid = input<boolean | undefined>(undefined);

  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  protected get isInvalid(): boolean {
    return this.invalid() ?? !!(this.ngControl?.touched && this.ngControl.invalid);
  }
}
