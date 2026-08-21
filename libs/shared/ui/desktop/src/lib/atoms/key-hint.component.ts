import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Renders a keyboard-shortcut hint like ⌘K. Keyboard accelerators are a
 * desktop affordance — meaningless without a physical keyboard — so this is
 * `platform:desktop`.
 */
@Component({
  selector: 'zoo-key-hint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './key-hint.component.html',
  styleUrl: './key-hint.component.css',
})
export class KeyHintComponent {
  readonly keys = input.required<string>();
}
