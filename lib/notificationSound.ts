// src/shared/utils/notificationSound.ts

export const playNotificationSound = () => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Notes for a pleasant dual-tone chime (E5 -> A5)
    const notes = [
      { freq: 659.25, time: 0, duration: 0.15 },  // E5
      { freq: 880.00, time: 0.1, duration: 0.3 }  // A5
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      // Smooth attack and exponential decay to avoid popping clicks
      gain.gain.setValueAtTime(0, ctx.currentTime + time);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + duration);
    });
  } catch (error) {
    console.warn('[Audio] Could not play notification sound:', error);
  }
};