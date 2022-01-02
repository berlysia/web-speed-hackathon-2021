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
 * @param {"80" | "128" | "256"} scale
 * @returns {string}
 */
function getProfileImagePath(profileImageId, scale = "256") {
  return `/images/profiles/${profileImageId}.${scale}.avif`;
}

export { getImagePath, getMoviePath, getSoundPath, getSoundWaveImagePath, getProfileImagePath };
