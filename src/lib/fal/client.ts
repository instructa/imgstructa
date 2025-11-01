import { fal } from '@fal-ai/client';
import { env } from '~/env/server';

// Configure fal client with API key (server-only)
fal.config({
  credentials: env.FAL_KEY,
});

export { fal };

