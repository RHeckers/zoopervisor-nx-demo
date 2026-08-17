import { Directive, ElementRef, inject, input } from '@angular/core';

/**
 * A hover-driven, pointer-oriented control. Tagged `platform:desktop`, so
 * anything `platform:mobile` is forbidden from importing it.
 */
@Directive({
  selector: '[zooTooltip]',
  host: {
    '[attr.title]': 'zooTooltip()',
    '[style.cursor]': '"help"',
  },
})
export class TooltipDirective {
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly zooTooltip = input('');
}
