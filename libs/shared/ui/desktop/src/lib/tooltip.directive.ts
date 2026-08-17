import { Directive, computed, input, signal } from '@angular/core';
import { Pointer } from './native/pointer';

/**
 * A hover-driven tooltip. Hover intent is a pointer concept — it has no meaning
 * on a touch screen — so this control is `platform:desktop`. It gates on the
 * fake desktop `Pointer` capability to underline the point.
 */
@Directive({
  selector: '[zooTooltip]',
  host: {
    '[attr.title]': 'title()',
    '[style.cursor]': '"help"',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
  },
})
export class TooltipDirective {
  readonly zooTooltip = input('');
  protected readonly hovered = signal(false);
  private readonly finePointer = Pointer.hasFinePointer();

  protected readonly title = computed(() =>
    this.finePointer ? this.zooTooltip() : '',
  );
}
