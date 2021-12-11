import classNames from 'classnames';
import React from 'react';

import { AspectRatioBox } from '../AspectRatioBox';
import { FontAwesomeIcon } from '../FontAwesomeIcon';

/**
 * @typedef {object} Props
 * @property {string} src
 */

/**
 * クリックすると再生・一時停止を切り替えます。
 * @type {React.VFC<Props>}
 */
const PausableMovie = ({ src }) => {
  /** @type {React.RefObject<HTMLVideoElement>} */
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleClick = React.useCallback(() => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, []);

  const handleStateChange = React.useCallback((e) => {
    setIsPlaying(!e.currentTarget?.paused);
  });

  return (
    <AspectRatioBox aspectHeight={1} aspectWidth={1}>
      <button className="group relative block w-full h-full" onClick={handleClick} type="button">
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          className="w-full"
          onPlay={handleStateChange}
          onPause={handleStateChange}
          onEnded={handleStateChange}
        />
        <div
          className={classNames(
            'absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16 text-white text-3xl bg-black bg-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2',
            {
              'opacity-0 group-hover:opacity-100': isPlaying,
            },
          )}
        >
          <FontAwesomeIcon iconType={isPlaying ? 'pause' : 'play'} styleType="solid" />
        </div>
      </button>
    </AspectRatioBox>
  );
};

export { PausableMovie };
