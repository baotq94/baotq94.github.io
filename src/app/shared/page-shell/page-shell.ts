import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-shell',
  template: `
    <header class="head">
      <h1>{{ heading() }}</h1>
      @if (lede(); as lede) {
        <p class="lede">{{ lede }}</p>
      }
    </header>
    <ng-content />
  `,
  styles: `
    :host { display: block; }
    .head { display: grid; gap: var(--space-2); margin-bottom: var(--space-5); }
    h1 { font-size: var(--text-2xl); }
    .lede { color: var(--muted); font-size: var(--text-lg); }
  `,
})
export class PageShell {
  readonly heading = input.required<string>();
  readonly lede = input<string>();
}
