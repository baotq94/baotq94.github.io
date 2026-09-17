import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** The one reusable content unit: posts, home "latest", coming-soon states. */
@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly title = input.required<string>();
  readonly meta = input<string | null>();
  readonly excerpt = input<string>();
  /** Router link the title points to. Omit for a non-link card. */
  readonly link = input<string | readonly unknown[]>();
  /** Language of the card's text; drives per-language typography. */
  readonly lang = input<string>();
}
