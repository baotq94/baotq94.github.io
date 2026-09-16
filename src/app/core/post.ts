export interface Post {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  category: string;
  excerpt: string;
  substackUrl: string;
  tags: string[];
  /** BCP 47 language tag, e.g. 'en', 'vi', 'ja'. Set on the card so :lang() CSS applies. */
  lang: string;
}
