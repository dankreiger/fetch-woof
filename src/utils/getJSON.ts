export const getJSON = async <R>(
  url: string,
  ac: AbortController
): Promise<R> => {
  const res = await fetch(url, { signal: ac.signal });
  return (await res.json()) as Promise<R>;
};
