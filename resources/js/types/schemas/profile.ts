import { z } from 'zod';

export const profileFormSchema = z.object({
  introduction: z.string().max(255, 'Your introduction must contain at most 255 characters').nullable(),
  description: z.string().max(2000, 'Your description must contain at most 2000 characters').nullable(),
  good_tags: z.string().max(255, 'Your favorite tags must contain at most 255 characters').nullable(),
  neutral_tags: z.string().max(255, 'Your tolerable tags must contain at most 255 characters').nullable(),
  bad_tags: z.string().max(255, 'Your most detested tags must contain at most 255 characters').nullable(),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
