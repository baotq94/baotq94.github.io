import { Component, inject } from '@angular/core';
import { BookService } from '../../core/book.service';
import { Card } from '../../shared/card/card';
import { PageShell } from '../../shared/page-shell/page-shell';

/** Every book, grouped by year finished, newest first. Each row expands independently. */
@Component({
  selector: 'app-books',
  imports: [Card, PageShell],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books {
  private readonly bookService = inject(BookService);

  protected readonly years = this.bookService.byYear;
  protected readonly isLoading = this.bookService.isLoading;

  protected glyphs(rating: number) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  protected host(link: string) {
    return new URL(link).hostname.replace(/^www\./, '');
  }
}
