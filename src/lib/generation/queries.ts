import { useMutation } from '@tanstack/react-query';
import { generateImage } from '~/server/function/generateImage';
import { generateVideo } from '~/server/function/generateVideo';
import { toast } from 'sonner';

export type GenerateImageInput = {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16';
  seed?: number;
};

export type GenerateImageOutput = {
  imageUrl: string;
  width: number;
  height: number;
  requestId: string;
};

export type GenerateVideoInput = {
  imageUrl: string;
  prompt?: string;
};

export type GenerateVideoOutput = {
  videoUrl: string;
  contentType: string;
  requestId: string;
};

export function useGenerateImageMutation() {
  return useMutation({
    mutationFn: async (input: GenerateImageInput) => await generateImage({ data: input }),
    onError: (error) => {
      toast.error(error.message || 'Failed to generate image');
    },
  });
}

export function useGenerateVideoMutation() {
  return useMutation({
    mutationFn: async (input: GenerateVideoInput) => await generateVideo({ data: input }),
    onError: (error) => {
      toast.error(error.message || 'Failed to generate video');
    },
  });
}
