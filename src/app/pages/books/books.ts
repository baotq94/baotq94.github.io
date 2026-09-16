import { Component } from '@angular/core';
import { Card } from '../../shared/card/card';
import { PageShell } from '../../shared/page-shell/page-shell';

@Component({
  selector: 'app-books',
  imports: [Card, PageShell],
  template: `
    <app-page-shell heading="Books" lede="Books I've read, with short notes on what stuck.">
      <app-card title="Coming soon" excerpt="Nothing here yet. In the meantime, the blog has related posts." />
    </app-page-shell>
  `,
})
export class Books {}
