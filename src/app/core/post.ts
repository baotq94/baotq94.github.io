export interface Post {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  category: string;
  excerpt: string;
  tags: string[];
  /** BCP 47 language tag, e.g. 'en', 'vi', 'ja'. Set on the card so :lang() CSS applies. */
  lang: string;
  /** Body rendered from Markdown at build time; empty if the post has no body yet. */
  html: string;
}
