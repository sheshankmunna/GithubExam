import { useEffect, useRef, useState } from 'react';

export function usePerformanceMetrics({ apiLatency, claimCount }) {
  const [pageLoadTime, setPageLoadTime] = useState(null);
  const apiLatencyRef = useRef(apiLatency);
  const claimCountRef = useRef(claimCount);

  useEffect(() => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = Date.now() - timing.navigationStart;
      setPageLoadTime(loadTime);
    } else {
      setPageLoadTime('N/A');
    }
  }, []);

  useEffect(() => {
    apiLatencyRef.current = apiLatency;
  }, [apiLatency]);

  useEffect(() => {
    claimCountRef.current = claimCount;
  }, [claimCount]);

  return {
    pageLoadTime,
    apiLatency: apiLatencyRef.current,
    claimCount: claimCountRef.current
  };
}
