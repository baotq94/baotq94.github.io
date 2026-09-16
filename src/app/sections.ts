export interface Section {
  path: string;
  label: string;
}

/** Top-level sections shown in the header nav. */
export const SECTIONS: Section[] = [
  { path: '/blog', label: 'Blog' },
  { path: '/investment', label: 'Investment' },
  { path: '/books', label: 'Books' },
];
