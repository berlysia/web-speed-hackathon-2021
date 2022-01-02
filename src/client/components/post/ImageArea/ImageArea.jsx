import classNames from 'classnames';
import React from 'react';

import { getImagePath } from '../../../utils/get_path';
import { AspectRatioBox } from '../../foundation/AspectRatioBox';
import { CoveredImage } from '../../foundation/CoveredImage';

/**
 * @typedef {object} Props
 * @property {Array<Models.Image>} images
 */

/** @type {React.VFC<Props>} */
const ImageArea = ({ images }) => {
  return (
    <AspectRatioBox aspectHeight={9} aspectWidth={16}>
      <div className="grid gap-1 grid-cols-2 grid-rows-2 w-full h-full border border-gray-300 rounded-lg overflow-hidden">
        {images.map((image, idx) => {
          return (
            <div
              key={image.id}
              // CSS Grid で表示領域を指定する
              className={classNames('bg-gray-300', {
                'col-span-1': images.length !== 1,
                'col-span-2': images.length === 1,
                'row-span-1': images.length > 2 && (images.length !== 3 || idx !== 0),
                'row-span-2': images.length <= 2 || (images.length === 3 && idx === 0),
              })}
            >
              <CoveredImage
                alt={image.alt}
                src={getImagePath(image.id)}
                srcSet={`${getImagePath(image.id, 'tiny')} 200w, ${getImagePath(
                  image.id,
                  'small',
                )} 400w, ${getImagePath(image.id, 'medium')} 640w`}
                sizes={`(max-width: 479px) ${images.length === 1 ? '382px' : '189px'}, ${
                  images.length === 1 ? '522px' : '245px'
                }`}
              />
            </div>
          );
        })}
      </div>
    </AspectRatioBox>
  );
};

export { ImageArea };
