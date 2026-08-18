import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnimalAvatarComponent } from '@zoo/animals/ui';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import {
  CardComponent,
  EmptyStateComponent,
  SpinnerComponent,
  StackComponent,
} from '@zoo/shared/ui/common';
import { VisitorSearchSlice } from '@zoo/visitor/slices';
import { EnclosureMapFacade } from './enclosure-map.facade';

/**
 * Thin smart component: injects only the facade; reuses the app search slice.
 * Each enclosure card lists its residents (composed from the animals domain)
 * with a capacity meter; +N more expands the full list in place.
 */
@Component({
  selector: 'zoo-enclosure-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EnclosureMapFacade],
  imports: [
    AnimalAvatarComponent,
    CardComponent,
    EmptyStateComponent,
    EnclosureBadgeComponent,
    SpinnerComponent,
    StackComponent,
    VisitorSearchSlice,
  ],
  template: `<zoo-stack class="enclosure-map">
    <header class="enclosure-map__header">
      <h2>Enclosures</h2>
      <zoo-visitor-search-slice class="enclosure-map__search" />
    </header>

    @if (facade.vm().loading) {
      <zoo-spinner />
    } @else {
      <div class="enclosure-map__grid">
        @for (e of facade.vm().enclosures; track e.id) {
          <zoo-card>
            <zoo-stack>
              <div class="enclosure-map__card-header">
                <h3>{{ e.name }}</h3>
                <zoo-enclosure-badge [enclosure]="e" />
              </div>

              <label class="enclosure-map__meter">
                <small>{{ e.residents.length }} / {{ e.capacity }} occupied</small>
                <progress [value]="e.residents.length" [max]="e.capacity"></progress>
              </label>

              @if (e.residents.length > 0) {
                <div class="enclosure-map__residents">
                  @for (
                    a of e.expanded ? e.residents : e.residents.slice(0, 6);
                    track a.id
                  ) {
                    <span class="enclosure-map__resident">
                      <zoo-animal-avatar [name]="a.name" [photoUrl]="a.photoUrl" />
                      @if (e.expanded) {
                        <small>{{ a.name }}</small>
                      }
                    </span>
                  }
                  @if (e.residents.length > 6) {
                    <button
                      type="button"
                      class="enclosure-map__toggle"
                      (click)="facade.toggleExpanded(e.id)"
                    >
                      {{ e.expanded ? 'show less' : '+' + (e.residents.length - 6) + ' more' }}
                    </button>
                  }
                </div>
              } @else {
                <zoo-empty-state message="No residents found" />
              }
            </zoo-stack>
          </zoo-card>
        } @empty {
          <zoo-empty-state message="No enclosure houses a match" />
        }
      </div>
    }
  </zoo-stack>`,
  styles: `
    .enclosure-map {
      --zoo-stack-gap: var(--spacer-lg);
    }
    .enclosure-map__header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacer-base);
    }
    .enclosure-map__search {
      flex: 0 1 320px;
    }
    .enclosure-map__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacer-base);
      align-items: start;
    }
    .enclosure-map__card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacer-sm);
    }
    .enclosure-map__meter {
      display: flex;
      flex-direction: column;
      gap: var(--spacer-xs);
    }
    .enclosure-map__meter progress {
      width: 100%;
      accent-color: var(--color-accent);
    }
    .enclosure-map__residents {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--spacer-sm);
      --zoo-animal-avatar-size: 3rem;
    }
    .enclosure-map__resident {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacer-xs);
      max-width: 5rem;
      text-align: center;
    }
    .enclosure-map__toggle {
      padding: 0;
      border: none;
      background: none;
      font: inherit;
      font-size: var(--font-size-caption);
      color: var(--color-accent);
      cursor: pointer;
    }
  `,
})
export class EnclosureMapComponent {
  protected readonly facade = inject(EnclosureMapFacade);

  constructor() {
    this.facade.refresh();
  }
}
