import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { PhotoPickerComponent } from '@zoo/shared/ui/photo-picker';

/*
 * <zoo-photo-picker> sits inside a SHARED DOMAIN component, not a feature.
 * Nothing between the app and the picker passes a flag, a slot, or a template:
 * the injector resolves whichever implementation the app registered for
 * PHOTO_PICKER, at exactly this depth. keeper-mobile gets the camera, visitor
 * gets the file input, and ticket-kiosk (which registers nothing) fails closed.
 */
@Component({
  selector: 'zoo-incident-report-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhotoPickerComponent],
  template: `<h3>Incident report</h3>
    <zoo-photo-picker [multiple]="true" (selected)="photos.emit($event)" />`,
})
export class IncidentReportFormComponent {
  readonly photos = output<File[]>();
}
