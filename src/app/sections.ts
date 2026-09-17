export interface Section {
  path: string;
  label: string;
}

/** Top-level sections shown in the header nav. */
export const SECTIONS: Section[] = [
  { path: '/blog', label: 'Blog' },
  { path: '/books', label: 'Books' },
];
