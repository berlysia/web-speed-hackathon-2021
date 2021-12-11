/**
 * @param {string} url
 * @returns {Promise<ArrayBuffer>}
 */
async function fetchBinary(url) {
  const result = await fetch(url, {
    method: 'GET',
    responseType: 'arraybuffer',
  });
  return await result.arrayBuffer();
}

/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
async function fetchJSON(url) {
  const result = await fetch(url, {
    method: 'GET',
  });
  if (!result.ok) throw result;
  return await result.json();
}

/**
 * @template T
 * @param {string} url
 * @param {File} file
 * @returns {Promise<T>}
 */
async function sendFile(url, file) {
  const result = await fetch(url, {
    data: file,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    method: 'POST',
  });
  if (!result.ok) throw result;
  return await result.json();
}

/**
 * @template T
 * @param {string} url
 * @param {object} data
 * @returns {Promise<T>}
 */
async function sendJSON(url, data) {
  const jsonString = JSON.stringify(data);
  const uint8Array = new TextEncoder().encode(jsonString);
  const { gzip } = await import('pako');
  const compressed = gzip(uint8Array);

  const result = await fetch(url, {
    data: new Blob([compressed]),
    headers: {
      'Content-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  if (!result.ok) throw result;
  return await result.json();
}

export { fetchBinary, fetchJSON, sendFile, sendJSON };
