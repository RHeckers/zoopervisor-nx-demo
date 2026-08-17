import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AnimalCardComponent,
  IncidentReportFormComponent,
} from '@zoo/animals/ui';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import { StackComponent } from '@zoo/shared/ui/common';
import { VisitorReportPanelComponent } from '@zoo/visitor/ui';
import { VisitorSearchSlice } from '@zoo/visitor/slices';
import { AnimalListFacade } from './animal-list.facade';

/**
 * Smart, but thin: it injects ONLY the facade — never a domain store directly.
 * It also drops in the app-level search slice (used again in enclosure-map).
 */
@Component({
  selector: 'zoo-animal-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnimalListFacade],
  imports: [
    AnimalCardComponent,
    EnclosureBadgeComponent,
    IncidentReportFormComponent,
    StackComponent,
    VisitorReportPanelComponent,
    VisitorSearchSlice,
  ],
  template: `<zoo-stack>
    <zoo-visitor-search-slice />
    @for (e of facade.vm().enclosures; track e.id) {
      <zoo-enclosure-badge [enclosure]="e" />
    }
    @for (a of facade.vm().animals; track a.id) {
      <zoo-animal-card [animal]="a" />
    }
    <!-- shared domain component that hosts <zoo-photo-picker> — the app's
         registered implementation resolves at this depth, no flag threaded. -->
    <zoo-incident-report-form />
    <!-- app UI panel: platform-neutral photo organism + desktop command bar;
         no isMobile prop, no mobile import (banned for platform:desktop). -->
    <zoo-visitor-report-panel (searchChange)="facade.search($event)" />
  </zoo-stack>`,
})
export class AnimalListComponent {
  protected readonly facade = inject(AnimalListFacade);

  constructor() {
    this.facade.refresh();
  }
}
