export type LocalizedText = {
  en: string;
  ar: string;
};

export type College = {
  id: string;

  name: LocalizedText;
  description: LocalizedText;

  image: string;

  majors?: LocalizedText[];

  planName?: string;
  planUrl?: string;

  active?: boolean;
};