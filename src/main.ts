import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Strip click-tracking params (e.g. ?fbclid= added by Facebook) from the address bar.
const url = new URL(location.href);
const TRACKING_PARAMS = ['fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
if (TRACKING_PARAMS.some((p) => url.searchParams.has(p))) {
  TRACKING_PARAMS.forEach((p) => url.searchParams.delete(p));
  history.replaceState(history.state, '', url.pathname + url.search + url.hash);
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
