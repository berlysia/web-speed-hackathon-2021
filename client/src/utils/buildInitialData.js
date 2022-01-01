const map = new Map();
export function buildInitialData(key) {
  const cached = map.get(key);
  if (cached) return { initialData: cached };

  const data = window.__REACT_QUERY_PREFETCHED__?.[key];
  if (!data) return {};
  try {
    const parsed = JSON.parse(data);
    if (parsed) {
      map.set(key, parsed);
      return { initialData: parsed };
    }
  } catch (e) {
    console.error('broken JSON', e);
  }
  return {};
}

export function buildInitialDataForInfinite(key) {
  const cached = map.get(key);
  if (cached)
    return {
      initialData: {
        pages: [cached],
        pageParam: undefined,
      },
    };

  const data = window.__REACT_QUERY_PREFETCHED__?.[key];
  if (!data) return {};
  try {
    const parsed = JSON.parse(data);
    if (parsed) {
      map.set(key, parsed);
      return {
        initialData: {
          pages: [parsed],
          pageParam: undefined,
        },
      };
    }
  } catch (e) {
    console.error('broken JSON', e);
  }
  return {};
}
