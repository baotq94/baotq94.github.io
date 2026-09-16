export interface Post {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  category: string;
  excerpt: string;
  substackUrl: string;
  tags: string[];
}
