export interface Section {
  path: string;
  label: string;
  description: string;
}

/** Top-level sections, used by the header nav and the home page. */
export const SECTIONS: Section[] = [
  { path: '/blog', label: 'Blog', description: 'Essays and notes, published on Substack.' },
  { path: '/investment', label: 'Investment', description: 'Portfolio notes and principles.' },
  { path: '/books', label: 'Books', description: 'What I read and what stuck.' },
];
