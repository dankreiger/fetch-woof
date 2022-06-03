export type UseFetchReturn<TransformedOutput> = {
  data: TransformedOutput | undefined;
  loading: boolean;
  error: unknown;
  callFetch?: () => {
    abort: () => void;
  };
};
export type UseFetchOptions<R, T> = {
  url: string;
  transformResponse: (res: R) => T;
  loadingStateDelay?: number;
  lazy?: boolean;
};
