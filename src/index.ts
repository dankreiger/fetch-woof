import { useCallback, useEffect, useRef, useState } from 'react';
import { UseFetchOptions, UseFetchReturn } from './types';
import { createFetch, sleep } from './utils';

export const useFetch = <Response, TransformedOutput>(
  opts: UseFetchOptions<Response, TransformedOutput>
): UseFetchReturn<Response, TransformedOutput> => {
  const { url, transformResponse, loadingStateDelay, lazy } = opts;
  const [data, setData] = useState<TransformedOutput | Response>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const ref = useRef<ReturnType<typeof createFetch>>();

  const callFetch = useCallback(
    () =>
      createFetch<Response, TransformedOutput>({
        loadingStateDelay: loadingStateDelay || 250,
        onLoading: () => setLoading(true),
        onDone: () => setLoading(false),
        onError: setError,
        onSuccess: setData,
        transformResponse,
        url,
      }),
    [url, loadingStateDelay, transformResponse]
  );

  useEffect(() => {
    if (!lazy) {
      const instance = callFetch();
      ref.current = instance;
    }
    return () => {
      ref.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error, ...(lazy ? { callFetch } : {}) };
};

export { UseFetchOptions, UseFetchReturn, createFetch, sleep };
