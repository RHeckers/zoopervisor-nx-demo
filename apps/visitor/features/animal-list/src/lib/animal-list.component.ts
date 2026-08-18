import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AnimalCardComponent,
  IncidentReportFormComponent,
} from '@zoo/animals/ui';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import {
  CardComponent,
  EmptyStateComponent,
  SpinnerComponent,
  StackComponent,
} from '@zoo/shared/ui/common';
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
    CardComponent,
    EmptyStateComponent,
    EnclosureBadgeComponent,
    IncidentReportFormComponent,
    SpinnerComponent,
    StackComponent,
    VisitorReportPanelComponent,
    VisitorSearchSlice,
  ],
  template: `<zoo-stack class="animal-list">
    <header class="animal-list__header">
      <div class="animal-list__title">
        <h2>{{ facade.vm().heading }}</h2>
        <small>{{ facade.vm().animals.length }} species · live from iNaturalist</small>
      </div>
      <zoo-visitor-search-slice class="animal-list__search" />
    </header>

    <zoo-stack direction="row" class="animal-list__enclosures">
      @for (e of facade.vm().enclosures; track e.id) {
        <zoo-enclosure-badge [enclosure]="e" />
      }
    </zoo-stack>

    @if (facade.vm().loading) {
      <zoo-spinner />
    } @else {
      <div class="animal-list__grid">
        @for (a of facade.vm().animals; track a.id) {
          <zoo-animal-card [animal]="a" />
        } @empty {
          <zoo-empty-state message="No animals match your search" />
        }
      </div>
    }

    <div class="animal-list__reports">
      <!-- shared domain component that hosts <zoo-photo-picker> — the app's
           registered implementation resolves at this depth, no flag threaded. -->
      <zoo-card><zoo-incident-report-form /></zoo-card>
      <!-- app UI panel: platform-neutral photo organism + desktop command bar;
           no isMobile prop, no mobile import (banned for platform:desktop). -->
      <zoo-visitor-report-panel (searchChange)="facade.search($event)" />
    </div>
  </zoo-stack>`,
  styles: `
    .animal-list {
      --zoo-stack-gap: var(--spacer-lg);
    }
    .animal-list__header {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      justify-content: space-between;
      gap: var(--spacer-base);
    }
    .animal-list__title small {
      display: block;
      margin-top: var(--spacer-xs);
    }
    .animal-list__search {
      flex: 0 1 320px;
    }
    .animal-list__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--spacer-base);
    }
    .animal-list__grid zoo-empty-state {
      grid-column: 1 / -1;
    }
    .animal-list__reports {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--spacer-base);
      align-items: start;
    }
  `,
})
export class AnimalListComponent {
  protected readonly facade = inject(AnimalListFacade);

  constructor() {
    this.facade.refresh();
  }
}
