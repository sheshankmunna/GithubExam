import React, { useRef, useCallback, memo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Button from './components/Button';

const PAGE_SIZE = 10;

const fetchClaimsPage = async ({ pageParam = 0, policyId = '' }) => {
  const url = `http://localhost:3001/api/claims?policyId=${policyId}&page=${pageParam}&size=${PAGE_SIZE}&sort=createdDate,desc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch claims');
  return res.json();
};

const SkeletonLoader = () => (
  <div className="skeleton-loader mb-2" style={{ height: 60, background: '#eee', borderRadius: 6 }} />
);

const ClaimItem = memo(({ claim, isLast, lastClaimRef }) => (
  <div
    key={claim.id}
    ref={isLast ? lastClaimRef : null}
    className="card mb-2 p-2"
    style={{ minHeight: 60 }}
  >
    <div><strong>Claim ID:</strong> {claim.id}</div>
    <div><strong>Policy ID:</strong> {claim.policyId}</div>
    <div><strong>Created:</strong> {claim.createdDate}</div>
    <div><strong>Status:</strong> {claim.status}</div>
  </div>
));

const ClaimsList = ({ policyId = '' }) => {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery({
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

  // Infinite scroll
  const observer = useRef();
  const lastClaimRef = useCallback(node => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div className="claims-list-container">
      <h3>Claims List</h3>
      {isLoading ? (
        Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonLoader key={i} />)
      ) : error ? (
        <div className="alert alert-danger">{error.message}</div>
      ) : (
        <>
          {data?.pages?.map((page, pageIdx) =>
            page.data?.map((claim, idx) => {
              const isLast = pageIdx === data.pages.length - 1 && idx === page.data.length - 1;
              return (
                <ClaimItem
                  key={claim.id || `${pageIdx}-${idx}`}
                  claim={claim}
                  isLast={isLast}
                  lastClaimRef={lastClaimRef}
                />
              );
            })
          )}
          {isFetchingNextPage && Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonLoader key={`next-${i}`} />)}
          {!hasNextPage && <div className="text-muted mt-2">No more claims to load.</div>}
          {/* Optional: Load More button for non-infinite scroll fallback */}
          {hasNextPage && (
            <Button type="button" className="btn btn-outline-primary w-100 mt-2" onClick={() => fetchNextPage()}>
              Load More
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ClaimsList;
