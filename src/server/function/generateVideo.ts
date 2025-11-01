import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { fal } from '~/lib/fal/client';

const videoInputSchema = z.object({
  imageUrl: z.string().url(),
  prompt: z.string().optional(),
});

export const generateVideo = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => videoInputSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const input = {
        image_url: data.imageUrl,
        prompt: data.prompt?.trim() || 'Smooth motion, cinematic movement, dynamic scene',
        prompt_optimizer: true,
        duration: '6',
      };

      const result = await fal.subscribe('fal-ai/minimax/hailuo-2.3-fast/standard/image-to-video', {
        input,
        logs: true,
      });

      const vid = result.data.video;
      if (!vid || !vid.url) {
        throw new Error('Invalid video response from API');
      }

      return {
        videoUrl: vid.url,
        contentType: vid.content_type ?? 'video/mp4',
        requestId: result.requestId,
      };
    } catch (error: unknown) {
      // Better error handling for validation errors
      if (error && typeof error === 'object' && 'status' in error && error.status === 422) {
        const validationError = error as { body?: { detail?: unknown } };
        const detail = validationError.body?.detail;
        const errorMessage = detail
          ? `API validation error: ${JSON.stringify(detail)}`
          : 'API validation error: Invalid request parameters';
        throw new Error(errorMessage);
      }
      throw error;
    }
  });
