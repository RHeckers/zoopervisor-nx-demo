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
import { AnimalStatusSlice, HealthDueSlice } from '@zoo/animals/slices';
import { HealthStatus } from '@zoo/animals/types';
import {
  KeeperFieldReport,
  KeeperReportPanelComponent,
  ReportUrgency,
} from '@zoo/keeper-mobile/ui';
import {
  BadgeComponent,
  CardComponent,
  StackComponent,
} from '@zoo/shared/ui/common';
import {
  BottomSheetComponent,
  TouchButtonComponent,
} from '@zoo/shared/ui/mobile';
import { AnimalDetailFacade } from './animal-detail.facade';

/**
 * Thin smart component. The animal cards on the left are the PICKER — tapping
 * one opens its record on the right (stacked below on a phone). Injects only
 * the facade and uses the mobile-only UI controls (touch button + bottom
 * sheet) — this app is platform:mobile.
 */
@Component({
  selector: 'zoo-animal-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnimalDetailFacade],
  imports: [
    AnimalCardComponent,
    AnimalStatusSlice,
    BadgeComponent,
    CardComponent,
    HealthDueSlice,
    IncidentReportFormComponent,
    KeeperReportPanelComponent,
    StackComponent,
    TouchButtonComponent,
    BottomSheetComponent,
  ],
  templateUrl: './animal-detail.component.html',
  styleUrl: './animal-detail.component.css',
})
export class AnimalDetailComponent implements OnInit {
  protected readonly facade = inject(AnimalDetailFacade);

  ngOnInit(): void {
    this.facade.open('a1');
  }

  /** Status for a picker card — known once its records have been loaded. */
  protected healthFor(animalId: string): HealthStatus | undefined {
    return this.facade.vm().records.find((r) => r.animalId === animalId)
      ?.status;
  }

  /** A field report IS a health entry — urgency maps onto the record status. */
  protected onReport(report: KeeperFieldReport): void {
    const status: Record<ReportUrgency, HealthStatus> = {
      routine: 'healthy',
      concern: 'observation',
      urgent: 'treatment',
    };
    void this.facade.logCheck(status[report.urgency]);
  }
}
