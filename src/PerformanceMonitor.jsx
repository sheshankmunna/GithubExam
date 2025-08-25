import React, { useEffect, useState } from 'react';

const PerformanceMonitor = ({ apiLatency, claimCount }) => {
  const [pageLoadTime, setPageLoadTime] = useState(null);

  useEffect(() => {
    // Measure page load time from navigation start to now
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = Date.now() - timing.navigationStart;
      setPageLoadTime(loadTime);
    } else {
      setPageLoadTime('N/A');
    }
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, background: '#222', color: '#fff', padding: '12px 18px', borderRadius: 8, zIndex: 9999, fontSize: '0.95em', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      <div><strong>Performance Monitor</strong></div>
      <div>Page Load Time: {pageLoadTime} ms</div>
      <div>API Latency: {apiLatency != null ? `${apiLatency} ms` : 'N/A'}</div>
      <div>Claim Items Rendered: {claimCount}</div>
    </div>
  );
};

export default PerformanceMonitor;
