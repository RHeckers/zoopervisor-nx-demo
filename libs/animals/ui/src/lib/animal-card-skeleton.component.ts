import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent, SkeletonComponent } from '@zoo/shared/ui/common';

/**
 * Loading placeholder shaped like zoo-animal-card's media layout (photo on
 * top, name + species below), so a list swaps between the two without layout
 * shift. Domain UI on purpose: the SHAPE of an animal card is animals-domain
 * knowledge; the shimmer atom it is built from stays generic in common.
 */
@Component({
  selector: 'zoo-animal-card-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, SkeletonComponent],
  templateUrl: './animal-card-skeleton.component.html',
  styleUrl: './animal-card-skeleton.component.css',
})
export class AnimalCardSkeletonComponent {}
