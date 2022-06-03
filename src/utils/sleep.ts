const done = Symbol('done');
const _sleep = (ms: number) => {
  let timeout: NodeJS.Timeout;
  const promise = new Promise<symbol>((resolve) => {
    timeout = setTimeout(() => resolve(done), ms);
  });

  return {
    cancel: () => clearTimeout(timeout),
    promise,
  };
};

export const sleep = Object.assign(_sleep, { done });
export const isTimeout = (winner: unknown) => winner === sleep.done;
