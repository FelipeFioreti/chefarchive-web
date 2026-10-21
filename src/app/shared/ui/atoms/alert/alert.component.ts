import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AlertVariant = 'danger' | 'success' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {
  readonly variant = input<AlertVariant>('info');
}
