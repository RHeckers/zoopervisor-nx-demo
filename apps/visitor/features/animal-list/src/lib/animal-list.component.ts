import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
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
  templateUrl: './animal-list.component.html',
  styleUrl: './animal-list.component.css',
})
export class AnimalListComponent implements OnInit {
  protected readonly facade = inject(AnimalListFacade);

  ngOnInit(): void {
    this.facade.refresh();
  }
}
