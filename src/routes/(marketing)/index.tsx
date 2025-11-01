import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  useGenerateImageMutation,
  useGenerateVideoMutation,
  type GenerateImageOutput,
  type GenerateVideoOutput,
} from '~/lib/generation/queries';
import { toast } from 'sonner';
import GradientOrb from '~/components/gradient-orb';
import { Download, ImageIcon, Video, Sparkles, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/(marketing)/')({
  component: RouteComponent,
});

type State =
  | { type: 'idle' }
  | { type: 'imageGenerating' }
  | { type: 'imageSuccess'; image: GenerateImageOutput }
  | { type: 'imageError'; error: string }
  | { type: 'videoGenerating'; image: GenerateImageOutput }
  | { type: 'videoSuccess'; image: GenerateImageOutput; video: GenerateVideoOutput }
  | { type: 'videoError'; image: GenerateImageOutput; error: string };

function RouteComponent() {
  const [prompt, setPrompt] = useState('');
  const [motionPrompt, setMotionPrompt] = useState('');
  const [state, setState] = useState<State>({ type: 'idle' });

  const generateImageMutation = useGenerateImageMutation();
  const generateVideoMutation = useGenerateVideoMutation();

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setState({ type: 'imageGenerating' });
    try {
      const result = await generateImageMutation.mutateAsync({
        prompt: prompt.trim(),
      });
      setState({ type: 'imageSuccess', image: result });
      toast.success('Image generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
      setState({ type: 'imageError', error: errorMessage });
    }
  };

  const handleGenerateVideo = async () => {
    if (state.type !== 'imageSuccess') return;

    setState({ type: 'videoGenerating', image: state.image });
    try {
      const result = await generateVideoMutation.mutateAsync({
        imageUrl: state.image.imageUrl,
        prompt: motionPrompt.trim() || undefined,
      });
      setState({ type: 'videoSuccess', image: state.image, video: result });
      toast.success('Video generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate video';
      setState({ type: 'videoError', image: state.image, error: errorMessage });
    }
  };

  const handleStartNew = () => {
    setState({ type: 'idle' });
    setPrompt('');
    setMotionPrompt('');
  };

  const handleDownloadVideo = () => {
    if (state.type !== 'videoSuccess') return;
    const link = document.createElement('a');
    link.href = state.video.videoUrl;
    link.download = `generated-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Video download started');
  };

  const isGeneratingImage = state.type === 'imageGenerating' || generateImageMutation.isPending;
  const isGeneratingVideo =
    state.type === 'videoGenerating' || generateVideoMutation.isPending;
  const showImage =
    state.type === 'imageSuccess' ||
    state.type === 'videoGenerating' ||
    state.type === 'videoSuccess' ||
    state.type === 'videoError';
  const showVideo = state.type === 'videoSuccess';

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <GradientOrb className="absolute left-1/2 top-0 z-[-1] -translate-x-1/2 transform" />

      <main className="container relative z-0 mx-auto flex flex-col items-center px-4 pt-20 pb-20">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="max-w-4xl font-medium text-4xl text-foreground md:text-6xl">
              AI Image & Video Generator
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Create stunning images and bring them to life
            </p>
          </div>

          {/* Main Content Card */}
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
            {/* Image Placeholder/Display */}
            <div className="w-full aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 flex items-center justify-center overflow-hidden">
              {showImage ? (
                <img
                  src={state.image.imageUrl}
                  alt="Generated image"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-4 p-8">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">IMAGE PLACEHOLDER</p>
                </div>
              )}
            </div>

            {/* Image Generation Section */}
            {state.type === 'idle' || state.type === 'imageError' || state.type === 'imageSuccess' ? (
              <div className="space-y-4">
                {state.type === 'imageError' && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
                    <p className="font-medium">Oh no! Something went wrong!</p>
                    <p className="text-sm mt-1">{state.error}</p>
                    <Button
                      onClick={handleGenerateImage}
                      variant="destructive"
                      className="mt-3"
                      disabled={isGeneratingImage}
                    >
                      Try again
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isGeneratingImage && handleGenerateImage()}
                    placeholder="Create an avatar of myself in a medieval kingdom style."
                    className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={isGeneratingImage}
                  />
                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !prompt.trim()}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Video Generation Section */}
            {state.type === 'imageSuccess' && (
              <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <p className="font-medium">Perfect! Now bring your image to life.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={motionPrompt}
                    onChange={(e) => setMotionPrompt(e.target.value)}
                    placeholder="Optional: Describe the motion you want (e.g., 'slow pan upward', 'zoom in on subject')"
                    className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={isGeneratingVideo}
                  />
                  <Button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                  >
                    {isGeneratingVideo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Video Error State */}
            {state.type === 'videoError' && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
                <p className="font-medium">Oh no! Something went wrong!</p>
                <p className="text-sm mt-1">{state.error}</p>
                <Button
                  onClick={handleGenerateVideo}
                  variant="destructive"
                  className="mt-3"
                  disabled={isGeneratingVideo}
                >
                  Try again
                </Button>
              </div>
            )}

            {/* Video Display */}
            {showVideo && (
              <div className="space-y-4">
                <div className="rounded-lg border-2 border-primary/20 bg-muted/20 p-4">
                  <video
                    src={state.video.videoUrl}
                    controls
                    className="w-full rounded-lg"
                    autoPlay
                    loop
                  />
                </div>
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                  <p className="font-medium text-green-700 dark:text-green-400 mb-3">All done!</p>
                  <div className="flex gap-2">
                    <Button onClick={handleDownloadVideo} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download Video
                    </Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-500/20">
                    <p className="text-sm text-muted-foreground mb-2">Not happy?</p>
                    <Button onClick={handleStartNew} variant="outline" className="w-full">
                      Start a new session
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            {(isGeneratingImage || isGeneratingVideo) && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">
                    {isGeneratingImage ? 'Generating your image...' : 'Generating your video... This may take 2-3 minutes.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
