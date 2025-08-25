import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Button from './components/Button';

// Simulated fetch function for claims data
const fetchClaims = async () => {
  const res = await fetch('http://localhost:3001/api/claims');
  if (!res.ok) throw new Error('Failed to fetch claims');
  return res.json();
};

const ClaimsScreen = () => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isStale
  } = useQuery({
    queryKey: ['claims'],
    queryFn: fetchClaims,
    cacheTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 2,  // 2 minutes
    refetchOnWindowFocus: false
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ minWidth: 350, maxWidth: 500 }}>
        <h2 className="text-center mb-4">Claims Data</h2>
        <Button type="button" className="btn btn-info mb-3" onClick={() => refetch()}>
          Refresh Claims
        </Button>
        {isLoading || isFetching ? (
          <div>Loading claims...</div>
        ) : error ? (
          <div className="alert alert-danger">{error.message}</div>
        ) : (
          <pre className="bg-light p-2 border rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <div className="mt-2 text-muted" style={{ fontSize: '0.9em' }}>
          Cache time: 10 min, Stale time: 2 min
        </div>
      </div>
    </div>
  );
};

export default ClaimsScreen;
