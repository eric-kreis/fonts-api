export interface IFontFamily {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: Date;
  files: { [key: string]: string };
  category: string;
  kind: string;
}

export interface IApiFonts {
  kind: string;
  items: IFontFamily[]
}
