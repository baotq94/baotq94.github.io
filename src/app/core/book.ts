export interface Book {
  slug: string;
  title: string;
  author: string;
  /** ISO date, YYYY-MM-DD. Its year is the group the book is listed under. */
  finished: string;
  summary: string;
  /** Whole number 1–5, or null when unrated. */
  rating: number | null;
  tags: string[];
  /** Optional https link (shop, Goodreads). */
  link: string | null;
  /** BCP 47 language tag, e.g. 'en', 'vi', 'ja'. */
  lang: string;
  /** False when the Markdown body is blank; `review` is then ''. */
  hasReview: boolean;
  /** The review memo rendered from Markdown to HTML. */
  review: string;
}

export interface BookYear {
  year: string;
  books: Book[];
}
