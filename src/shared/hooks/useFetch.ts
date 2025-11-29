import { useState, useEffect } from 'react';

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * useFetch Hook
 * 
 * Generic data fetching hook with loading and error states
 * 
 * @param fetchFn - Async function that returns data
 * @param dependencies - Dependencies array to trigger refetch
 * @returns Object with data, loading, error, and refetch function
 * 
 * @example
 * const { data: bookings, loading, error, refetch } = useFetch(
 *   () => BookingService.getAll(),
 *   []
 * );
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * return <BookingList bookings={bookings} />;
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (isMounted) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
          setData(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [...dependencies, refetchTrigger]);

  return { data, loading, error, refetch };
}
