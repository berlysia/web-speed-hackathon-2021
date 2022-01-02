import React from 'react';
import { getSoundWaveImagePath } from '../../../utils/get_path';

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ id }) => {
  return <img className="w-full h-full" src={getSoundWaveImagePath(id)} alt="" />;
};

export { SoundWaveSVG };
