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
import { KeeperReportPanelComponent } from '@zoo/keeper-mobile/ui';
import {
  BottomSheetComponent,
  TouchButtonComponent,
} from '@zoo/shared/ui/mobile';
import { AnimalDetailFacade } from './animal-detail.facade';

/**
 * Thin smart component. Injects only the facade and uses the mobile-only UI
 * controls (touch button + bottom sheet) — this app is platform:mobile.
 */
@Component({
  selector: 'zoo-animal-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnimalDetailFacade],
  imports: [
    AnimalCardComponent,
    IncidentReportFormComponent,
    KeeperReportPanelComponent,
    TouchButtonComponent,
    BottomSheetComponent,
  ],
  templateUrl: './animal-detail.component.html',
})
export class AnimalDetailComponent implements OnInit {
  protected readonly facade = inject(AnimalDetailFacade);

  ngOnInit(): void {
    this.facade.open('a1');
  }
}
