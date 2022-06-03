import { getJSON } from './getJSON';
import { reportWithAbort } from './reportWithAbort';
import { isTimeout, sleep } from './sleep';

type T_CreateFetchOpts<R, TransformedOutput> = {
  loadingStateDelay: number;
  onLoading: () => void;
  onDone: () => void;
  onError: (err: unknown) => void;
  onSuccess: (output: TransformedOutput) => void;
  transformResponse: (res: R) => TransformedOutput;
  url: string;
};

export const createFetch = <R, TransformedOutput>(
  opts: T_CreateFetchOpts<R, TransformedOutput>
) => {
  const ac = new AbortController();
  const {
    loadingStateDelay,
    onLoading,
    onDone,
    onError,
    onSuccess,
    transformResponse,
    url,
  } = opts;
  const sleepInstance = sleep(loadingStateDelay);

  Promise.race([
    sleepInstance.promise,
    (async () => {
      const json = await getJSON<R>(url, ac);
      return onSuccess(transformResponse(json));
    })(),
  ])
    .then((winner) => (isTimeout(winner) ? onLoading : sleepInstance.cancel))
    .catch(
      reportWithAbort({
        onAbort: onDone,
        onError,
      })
    )
    .finally(onDone);

  return {
    abort: () => {
      ac.abort();
      onDone();
      sleepInstance.cancel();
    },
  };
};
