import { Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { PageShell } from '../../shared/page-shell/page-shell';

interface Sample {
  lang: string | null;
  label: string;
  heading: string;
  body: string;
}

/** Internal typography comparison page. noindex, not linked from the nav. */
@Component({
  selector: 'app-type-test',
  imports: [PageShell],
  templateUrl: './type-test.html',
  styleUrl: './type-test.scss',
})
export class TypeTest {
  protected readonly samples: Sample[] = [
    {
      lang: 'vi',
      label: 'Vietnamese',
      heading: 'Tập cho con tự quyết định từ khi còn nhỏ',
      body: 'Thích thì có thích, nhưng không tự tin để nói ra.',
    },
    {
      lang: 'ja',
      label: 'Japanese',
      heading: '子どもが小さいうちから自分で決める練習',
      body: '好きは好きでも、自信がなくて言い出せない。',
    },
    {
      lang: 'ja',
      label: 'Japanese + Latin, lang="ja" (override on)',
      heading: '2026年、Substackで書き始めた理由',
      body: 'Angular 22とGitHub Pagesで作った個人サイトです。',
    },
    {
      lang: null,
      label: 'Japanese + Latin, no lang (override off: Latin from the serif, kana from mincho)',
      heading: '2026年、Substackで書き始めた理由',
      body: 'Angular 22とGitHub Pagesで作った個人サイトです。',
    },
    {
      lang: 'en',
      label: 'English',
      heading: 'Teaching kids to decide for themselves, early',
      body: 'They like it, but they are not confident enough to say so.',
    },
  ];

  constructor() {
    const meta = inject(Meta);
    meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    inject(DestroyRef).onDestroy(() => meta.removeTag('name="robots"'));
  }
}
