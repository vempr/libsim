import { z } from 'zod';

export const profileFormSchema = z.object({
  introduction: z.string().max(255).nullable(),
  description: z.string().max(2000).nullable(),
  good_tags: z.string().max(255).nullable(),
  neutral_tags: z.string().max(255).nullable(),
  bad_tags: z.string().max(255).nullable(),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
