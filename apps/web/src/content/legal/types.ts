export interface LegalSection {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly bullets?: readonly string[];
}

export interface LegalDocument {
  readonly title: string;
  readonly standfirst: string;
  /** ISO date; rendered as the "last updated" stamp. */
  readonly updated: string;
  readonly version?: string;
  readonly sections: readonly LegalSection[];
}
