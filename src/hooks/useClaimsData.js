import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 10;


import { useRef } from 'react';

export function useClaimsData(policyId = '') {
  const apiLatencyRef = useRef(null);

  async function fetchClaimsPage({ pageParam = 0, policyId = '' }) {
    const start = performance.now();
    const url = `http://localhost:3001/api/claims?policyId=${policyId}&page=${pageParam}&size=${PAGE_SIZE}&sort=createdDate,desc`;
    const res = await fetch(url);
    const latency = performance.now() - start;
    apiLatencyRef.current = Math.round(latency);
    if (!res.ok) throw new Error('Failed to fetch claims');
    return res.json();
  }

  const query = useInfiniteQuery({
    queryKey: ['claims', policyId],
    queryFn: ({ pageParam = 0 }) => fetchClaimsPage({ pageParam, policyId }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.pagination) return undefined;
      return lastPage.pagination.page + 1 < lastPage.pagination.totalPages ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
    keepPreviousData: true
  });

  return {
    ...query,
    apiLatency: apiLatencyRef.current
  };
}

async function fetchClaimsPage({ pageParam = 0, policyId = '' }) {
  const url = `http://localhost:3001/api/claims?policyId=${policyId}&page=${pageParam}&size=${PAGE_SIZE}&sort=createdDate,desc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch claims');
  return res.json();
}
