import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-bool-icon',
  imports: [FaIconComponent],
  templateUrl: './bool-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoolIconComponent {
  readonly value = input<boolean | null | undefined>(false);
}
