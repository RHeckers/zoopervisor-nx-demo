import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AnimalCardComponent,
  IncidentReportFormComponent,
} from '@zoo/animals/ui';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import {
  ButtonComponent,
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
    ButtonComponent,
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
        <small>
          {{ facade.vm().animals.length }} of
          {{ facade.vm().total }} species · live from iNaturalist
        </small>
      </div>
      <zoo-visitor-search-slice class="animal-list__search" />
    </header>

    <zoo-stack direction="row" class="animal-list__enclosures">
      @for (e of facade.vm().enclosures; track e.id) {
        <button
          type="button"
          class="animal-list__chip"
          [class.animal-list__chip--active]="facade.vm().enclosureFilter === e.id"
          (click)="facade.toggleEnclosure(e.id)"
        >
          <zoo-enclosure-badge [enclosure]="e" />
        </button>
      }
      @if (facade.vm().enclosureFilter) {
        <button
          type="button"
          class="animal-list__chip animal-list__chip--clear"
          (click)="facade.toggleEnclosure(facade.vm().enclosureFilter!)"
        >
          clear filter ✕
        </button>
      }
    </zoo-stack>

    @if (facade.vm().loading && facade.vm().animals.length === 0) {
      <zoo-spinner />
    } @else {
      <div class="animal-list__grid">
        @for (a of facade.vm().animals; track a.id) {
          <zoo-animal-card [animal]="a" />
        } @empty {
          <zoo-empty-state message="No animals match your search" />
        }
      </div>
      @if (facade.vm().canLoadMore) {
        <div class="animal-list__more">
          @if (facade.vm().loading) {
            <zoo-spinner />
          } @else {
            <zoo-button (pressed)="facade.loadMore()">Load more</zoo-button>
          }
        </div>
      }
    }

    <div class="animal-list__reports">
      <!-- shared domain component that hosts <zoo-photo-picker> — the app's
           registered implementation resolves at this depth, no flag threaded. -->
      <zoo-card><zoo-incident-report-form /></zoo-card>
      <!-- app UI panel: platform-neutral photo organism + desktop command bar;
           no isMobile prop, no mobile import (banned for platform:desktop). -->
      <zoo-visitor-report-panel />
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
    .animal-list__enclosures {
      flex-wrap: wrap;
    }
    .animal-list__chip {
      padding: 0;
      border: none;
      background: none;
      font: inherit;
      cursor: pointer;
    }
    .animal-list__chip--active {
      --zoo-enclosure-badge-background: var(--color-aquarium);
      --zoo-enclosure-badge-color: var(--color-paper);
    }
    .animal-list__chip--clear {
      color: var(--color-muted);
      font-size: var(--font-size-caption);
    }
    .animal-list__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--spacer-base);
    }
    .animal-list__grid zoo-empty-state {
      grid-column: 1 / -1;
    }
    .animal-list__more {
      display: flex;
      justify-content: center;
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
