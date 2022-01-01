import React from "react"
import { useInfiniteQuery } from "react-query";

const LIMIT = 10;

/**
 * @template T
 * @typedef {object} ReturnValues
 * @property {Array<T>} data
 * @property {Error | null} error
 * @property {boolean} isLoading
 * @property {() => Promise<void>} fetchMore
 */

export function wrapFetcherAsInfinite(fetcher) {
  return (context) =>
    fetcher(`${context.queryKey[0]}?limit=${LIMIT}${context.pageParam ? `&offset=${context.pageParam}` : ''}`);
}

export function buildInfiniteQueryOption(option) {
  return {
    ...option,
    getNextPageParam: (_lastPage, allPages) => {
      return allPages.length * LIMIT;
    },
  };
}

/**
 * @template T
 * @param {string} apiPath
 * @param {(apiPath: string) => Promise<T[]>} fetcher
 * @returns {ReturnValues<T>}
 */
export function useInfiniteFetch(apiPath, fetcher, option = {}) {
  const result = useInfiniteQuery(apiPath, wrapFetcherAsInfinite(fetcher), buildInfiniteQueryOption(option));

  const data = React.useMemo(() => result.data?.pages.flat() ?? [], [result.data?.pages]);

  return {
    data: data,
    error: result.error,
    isLoading: !result.isSuccess || !result.isError,
    fetchMore: result.fetchNextPage,
  };
}
