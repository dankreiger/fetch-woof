export const reportWithAbort = (opts: {
  onAbort: () => void;
  onError: (err: unknown) => void;
}) => (err: { name: string }) => {
  const { onAbort, onError } = opts;

  err !== null &&
  typeof err === 'object' &&
  'name' in err &&
  err.name === 'AbortError'
    ? onAbort()
    : onError(err);
  return 'reported';
};
