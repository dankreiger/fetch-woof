import { act, renderHook, waitFor } from '@testing-library/react';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { useFetch, UseFetchOptions } from './index';
enableFetchMocks();

const getProps = <R, T>(
  props: UseFetchOptions<R, T>
): UseFetchOptions<R, T> => ({
  ...props,
});
describe('useFetch', () => {
  afterEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });
  test('should do fetch', async () => {
    const expected = {
      complete: false,
      id: '1',
      title: 'something',
      userId: '2',
    } as const;
    fetchMock.mockResponseOnce(JSON.stringify(expected));

    const props = getProps<typeof expected, { dog: typeof expected }>({
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      transformResponse: (x) => ({ dog: x }),
    });

    const { result } = renderHook(() => useFetch(props));

    await act(async () => {
      await waitFor(() => result);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(props.url, {
      signal: expect.any(AbortSignal) as jest.Mock,
    });

    expect(result.current).toEqual({
      data: {
        dog: expected,
      },
      error: undefined,
      loading: false,
    });
  });

  test('should do lazy fetch', async () => {
    const expected = {
      complete: false,
      id: '1',
      title: 'something',
      userId: '2',
    };
    fetchMock.mockResponseOnce(JSON.stringify(expected));

    const props = getProps({
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      lazy: true,
      transformResponse: (x) => x,
    });

    const { result } = renderHook(() => useFetch(props));

    expect(result.current.callFetch).toBeDefined();

    expect(fetchMock).toHaveBeenCalledTimes(0);

    expect(result.current).toEqual({
      data: undefined,
      error: undefined,
      loading: false,
      callFetch: expect.any(Function) as jest.Mock,
    });

    act(() => {
      result.current.callFetch?.();
    });

    await act(async () => {
      await waitFor(() => result.current.data);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(props.url, {
      signal: expect.any(AbortSignal) as jest.Mock,
    });

    expect(result.current).toEqual({
      callFetch: expect.any(Function) as jest.Mock,
      data: expected,
      error: undefined,
      loading: false,
    });
  });

  test('should report errors', async () => {
    const props: Parameters<typeof useFetch>[0] = {
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      transformResponse: (x) => x,
    };

    fetchMock.mockRejectOnce(new Error('something'));

    const { result } = renderHook(() => useFetch(props));

    await act(async () => {
      await waitFor(() => result.current.error);
    });

    expect(result.current.error).toEqual(new Error('something'));
  });
});
