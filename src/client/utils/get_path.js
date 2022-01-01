/**
 * @param {string} imageId
 * @returns {string}
 */
function getImagePath(imageId) {
  return `/images/${imageId}.avif`;
}

/**
 * @param {string} movieId
 * @returns {string}
 */
function getMoviePath(movieId) {
  return `/movies/${movieId}.webm`;
}

/**
 * @param {string} soundId
 * @returns {string}
 */
function getSoundPath(soundId) {
  return `/sounds/${soundId}.m4a`;
}

function getSoundWaveImagePath(soundId) {
  return `/sounds/${soundId}.svg`;
}

/**
 * @param {string} profileImageId
 * @returns {string}
 */
function getProfileImagePath(profileImageId) {
  return `/images/profiles/${profileImageId}.avif`;
}

export { getImagePath, getMoviePath, getSoundPath, getSoundWaveImagePath, getProfileImagePath };