import classNames from 'classnames';
import React from 'react';

/**
 * @typedef {object} Props
 * @property {string} alt
 * @property {string} src
 */

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 * @type {React.VFC<Props>}
 */
const CoveredImage = ({ alt, src, srcSet, sizes, width, height }) => {
  return <img src={src} width={width} height={height} alt={alt} loading="lazy" className="w-full h-full object-cover" srcSet={srcSet} sizes={sizes} />;
};

export { CoveredImage };
