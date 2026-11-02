export const TOTAL_FRAMES = 180;
const FRAME_PATH = "/assets/play-on-scroll/frame_";

const framePaths = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(4, "0");
  return `${FRAME_PATH}${num}.png`;
});

// Module-level cache so the loading screen and ContactSection share one download
let cachedImages: HTMLImageElement[] | null = null;
let preloadPromise: Promise<HTMLImageElement[]> | null = null;

export function preloadContactFrames(
  onItemLoaded?: () => void,
): Promise<HTMLImageElement[]> {
  if (cachedImages) return Promise.resolve(cachedImages);
  if (preloadPromise) return preloadPromise;

  let loadedCount = 0;
  const images: HTMLImageElement[] = [];

  preloadPromise = new Promise((resolve) => {
    framePaths.forEach((src, i) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount++;
        onItemLoaded?.();
        if (loadedCount === TOTAL_FRAMES) {
          cachedImages = images;
          resolve(images);
        }
      };
      img.src = src;
      images[i] = img;
    });
  });

  return preloadPromise;
}
