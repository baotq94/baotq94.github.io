import { DOCUMENT } from '@angular/common';
import { inject, provideAppInitializer } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

const ORIGIN = 'https://baotq94.github.io';

/** Keeps <link rel="canonical"> in sync with the current route (runs at prerender and in the browser). */
export function provideCanonicalLink() {
  return provideAppInitializer(() => {
    const document = inject(DOCUMENT);
    const router = inject(Router);

    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      // GitHub Pages serves each route as a folder and 301s /blog -> /blog/, so canonical ends with a slash.
      const path = router.url.split(/[?#]/)[0].replace(/\/?$/, '/');
      link.setAttribute('href', ORIGIN + path);
    });
  });
}
