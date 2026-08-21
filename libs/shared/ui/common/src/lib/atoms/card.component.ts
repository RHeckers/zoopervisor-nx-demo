import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Dumb surface. All values are CSS custom properties: the fallback is the
 * global token (libs/shared/styles), the `--zoo-card-*` var is an override
 * hook any consumer can set on an ancestor — no inputs, no TS styling.
 */
@Component({
  selector: 'zoo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {}
