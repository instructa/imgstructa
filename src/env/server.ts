import { createEnv } from '@t3-oss/env-core';
import * as z from 'zod';

export const env = createEnv({
  server: {
    MY_SECRET_VAR: z.url().optional(),
    FAL_KEY: z.string().min(1),
    FAL_IMAGE_MODEL: z.string().default('fal-ai/flux/dev'),
    FAL_VIDEO_MODEL: z.string().default('fal-ai/longcat-video/image-to-video/720p'),
  },
  runtimeEnv: process.env,
});
