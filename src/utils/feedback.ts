let audioPool: HTMLAudioElement[] = [];
let poolIndex = 0;
const POOL_SIZE = 4;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (audioPool.length === 0) {
    try {
      for (let i = 0; i < POOL_SIZE; i++) {
        const audio = new Audio("/sounds/tap.mp3");
        audio.volume = 0.5;
        audio.preload = "auto";
        audioPool.push(audio);
      }
    } catch {
      return null;
    }
  }
  const audio = audioPool[poolIndex];
  poolIndex = (poolIndex + 1) % POOL_SIZE;
  return audio;
}

export function triggerFeedback(duration = 38) {
  if (typeof window === "undefined") return;

  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      const vibrated = navigator.vibrate([duration]);
      if (!vibrated) {
        navigator.vibrate(duration);
      }
    } catch {
      try {
        navigator.vibrate(duration);
      } catch {}
    }
  }

  try {
    const audio = getAudio();
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.5;
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    }
  } catch {}
}
