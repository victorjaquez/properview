import { useToast } from '@/hooks/useToast';

export function useShareCopy() {
  const { toast } = useToast();

  const shareOrCopy = async (data: {
    title: string;
    text: string;
    url: string;
  }): Promise<{ success: boolean; method: 'shared' | 'copied' }> => {
    // Try native share first (macOS Safari, iOS, Android)
    if (navigator.share) {
      try {
        await navigator.share(data);
        return { success: true, method: 'shared' };
      } catch (err) {
        // User cancelled or error occurred, fall back to clipboard
      }
    }

    // Fallback to clipboard
    await navigator.clipboard.writeText(data.url);
    toast({
      title: 'Success!',
      description: 'URL copied to clipboard!',
    });
    return { success: true, method: 'copied' };
  };

  return shareOrCopy;
}
