import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { fal } from '~/lib/fal/client';

const inputSchema = z.object({
  prompt: z.string().min(1),
  negativePrompt: z.string().optional(),
  aspectRatio: z.enum(['1:1', '16:9', '9:16']).optional(),
  seed: z.number().int().optional(),
});

// Map aspect ratios to hidream image_size format
function mapAspectRatioToImageSize(aspectRatio: '1:1' | '16:9' | '9:16'): {
  width: number;
  height: number;
} {
  switch (aspectRatio) {
    case '16:9':
      return { width: 1024, height: 576 };
    case '9:16':
      return { width: 576, height: 1024 };
    case '1:1':
    default:
      return { width: 1024, height: 1024 };
  }
}

export const generateImage = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const imageSize = mapAspectRatioToImageSize(data.aspectRatio ?? '1:1');
    const result = await fal.subscribe('fal-ai/hidream-i1-fast', {
      input: {
        prompt: data.prompt,
        negative_prompt: data.negativePrompt ?? '',
        image_size: imageSize,
        num_inference_steps: 16,
        seed: data.seed,
        num_images: 1,
        enable_safety_checker: true,
        output_format: 'jpeg',
      },
      logs: true,
    });

    const images = result.data.images;
    if (!images || !Array.isArray(images) || images.length === 0 || !images[0]?.url) {
      throw new Error('Invalid image response from API');
    }

    const img = images[0];
    return {
      imageUrl: img.url,
      width: img.width ?? imageSize.width,
      height: img.height ?? imageSize.height,
      requestId: result.requestId,
    };
  });
