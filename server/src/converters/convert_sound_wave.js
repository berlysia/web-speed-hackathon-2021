function zip(a, b) {
  // サイズは同じ前提でチェック飛ばす
  const result = [];
  const len = a.length;
  for (let i = 0; i < len; ++i) {
    result.push([a[i], b[i]]);
  }

  return result;
}

function chunk(arr, size) {
  const result = [];

  for (let count = 0; count < arr.length; count += size) {
    result.push(arr.slice(count, count + size));
  }

  return result;
}

function mean(arr) {
  let sum = 0;
  for (const item of arr) {
    sum += item;
  }
  return sum / arr.length;
}

/**
 * @param {ArrayBuffer} left
 * @param {ArrayBuffer} right
 * @returns {Promise<{ max: number, peaks: number[] }}
 */
async function calculate(left, right) {
  // 左の音声データの絶対値を取る
  const leftData = left.map((x) => Math.abs(x));
  // 右の音声データの絶対値を取る
  const rightData = right.map((x) => Math.abs(x));

  // 左右の音声データの平均を取る
  const normalized = zip(leftData, rightData).map((x) => mean(x));
  // 100 個の chunk に分ける
  const chunks = chunk(normalized, Math.ceil(normalized.length / 100));
  // chunk ごとに平均を取る
  const peaks = chunks.map((x) => mean(x));
  // chunk の平均の中から最大値を取る
  const max = Math.max(...peaks);

  return { max, peaks };
}

function createSVG(max, peaks) {
  return `<?xml version="1.0" encoding="UTF-8"?><svg preserveAspectRatio="none" viewBox="0 0 100 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      ${peaks
        .map((peak, idx) => {
          const ratio = peak / max;
          return `<rect fill="#2563EB" height="${ratio}" width="1" x="${idx}" y="${1 - ratio}" />`;
        })
        .join('\n')}
    </svg>`;
}

/**
 * @typedef {object} Props
 * @property {ArrayBuffer} soundData
 */

async function convertSoundWave(data) {
  const audioCtx = new (require('web-audio-api').AudioContext)();

  // 音声をデコードする
  /** @type {AudioBuffer} */
  const buffer = await new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(data.slice(0), resolve, reject);
  });

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  const seeds = await calculate(left, right);

  const svgStr = createSVG(seeds.max, seeds.peaks);

  return svgStr;
}

module.exports = { convertSoundWave };
