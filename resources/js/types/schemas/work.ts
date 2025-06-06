import { z } from 'zod';

export const languages = {
  ja: 'Japanese',
  en: 'English',
  es: 'Spanish; Castilian',
  fr: 'French',
  pt: 'Portuguese',
  de: 'German',
  it: 'Italian',
  zh: 'Chinese',
  ko: 'Korean',
  ru: 'Russian',
  th: 'Thai',
  id: 'Indonesian',
  vi: 'Vietnamese',
  pl: 'Polish',
  tr: 'Turkish',
} as const;

const languagesKeys = Object.keys(languages) as [string, ...string[]];
export const languageSchema = z.enum(languagesKeys);
export type LanguageCode = z.infer<typeof languageSchema>;

export const publicationStatuses = ['unknown', 'ongoing', 'completed', 'hiatus', 'cancelled'] as const;
export const readingStatuses = ['reading', 'completed', 'on hold', 'dropped'] as const;

export const dbWorkSchema = z.object({
  id: z.string(),
  user_id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status_publication: z.enum(publicationStatuses).nullable(),
  status_reading: z.enum(readingStatuses),
  author: z.string().nullable(),
  language_original: languageSchema.nullable(),
  language_translated: languageSchema.nullable(),
  publication_year: z.number().nullable(),
  image: z.string().nullable(),
  tags: z.string().nullable(),
  links: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  collections: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
});

export const workFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title cannot be longer than 255 characters'),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
  status_publication: z.enum(publicationStatuses).optional(),
  status_reading: z.enum(readingStatuses),
  author: z.string().max(255, "Author's name can't be longer than 255 characters").optional(),
  language_original: languageSchema.optional(),
  language_translated: languageSchema.optional(),
  publication_year: z.coerce
    .number()
    .min(-5000, 'Publication year cannot be earlier than 5000 BCE')
    .max(5000, 'Publication year cannot be later than 5000 CE')
    .optional(),
  image_self: z.string().max(255, 'Image URL cannot exceed 255 characters').optional(),
  tags: z.string().max(1000, 'Tags cannot exceed 1000 characters').optional(),
  links: z.string().max(3000, 'Links cannot exceed 3000 characters').optional(),
});

export const searchSchema = z.object({
  q: z.string().max(255, "Query can't be longer than 255 characters").optional(),
  author: z.string().max(255, "Author's name can't be longer than 255 characters").nullable().optional(),
  tags: z.string().max(1000, 'Tags cannot exceed 1000 characters').nullable().optional(),
  language_original: languageSchema.nullable().optional(),
  language_translated: languageSchema.nullable().optional(),
  status_publication: z.enum(publicationStatuses).nullable().optional(),
  status_reading: z.enum(readingStatuses).nullable().optional(),
  publication_year: z.coerce
    .number()
    .min(-5000, 'The publication year cannot be earlier than -5000')
    .max(5000, 'The publication year cannot be later than 5000')
    .optional(),
});

export type Work = z.infer<typeof dbWorkSchema>;
export type WorkFormInput = z.infer<typeof workFormSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type PublicationStatus = (typeof publicationStatuses)[number];
export type ReadingStatus = (typeof readingStatuses)[number];
