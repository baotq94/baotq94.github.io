import { Component, input } from '@angular/core';

/** The one reusable content unit: posts, home "latest", coming-soon states. */
@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly title = input.required<string>();
  readonly meta = input<string | null>();
  readonly excerpt = input<string>();
  /** External URL; opens in a new tab. Omit for a non-link card. */
  readonly href = input<string>();
}
