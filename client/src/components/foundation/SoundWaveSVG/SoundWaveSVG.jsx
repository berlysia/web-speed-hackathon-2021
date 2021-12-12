import React from 'react';
import { wrap } from 'comlink';

/**
 * @typedef {object} Props
 * @property {ArrayBuffer} soundData
 */

async function calculate(data) {
  const audioCtx = window.AudioContext
    ? new AudioContext()
    : new (await import('standardized-audio-context').AudioContext)();

  // 音声をデコードする
  /** @type {AudioBuffer} */
  const buffer = await new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(data.slice(0), resolve, reject);
  });

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  if (window.Worker) {
    const worker = wrap(new Worker(new URL('./SoundWaveWorker.js', import.meta.url)));
    return await worker.calculate(left, right);
  }
  const worker = await import('./SoundWaveWorker.js').then((m) => m.api);
  return await worker.calculate(left, right);
}

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ soundData }) => {
  const uniqueIdRef = React.useRef(Math.random().toString(16));
  const [{ max, peaks }, setPeaks] = React.useState({ max: 0, peaks: [] });

  React.useEffect(() => {
    calculate(soundData).then(({ max, peaks }) => {
      setPeaks({ max, peaks });
    });
  }, [soundData]);

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = peak / max;
        return (
          <rect key={`${uniqueIdRef.current}#${idx}`} fill="#2563EB" height={ratio} width="1" x={idx} y={1 - ratio} />
        );
      })}
    </svg>
  );
};

export { SoundWaveSVG };
