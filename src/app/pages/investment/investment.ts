import { Component } from '@angular/core';
import { Card } from '../../shared/card/card';
import { PageShell } from '../../shared/page-shell/page-shell';

@Component({
  selector: 'app-investment',
  imports: [Card, PageShell],
  template: `
    <app-page-shell heading="Investment" lede="Portfolio notes, principles and the occasional post-mortem.">
      <app-card title="Coming soon" excerpt="Nothing here yet. In the meantime, the blog has related posts." />
    </app-page-shell>
  `,
})
export class Investment {}
