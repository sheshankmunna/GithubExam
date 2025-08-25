import { render, screen } from '@testing-library/react';
import PerformanceMonitor from './PerformanceMonitor';

describe('PerformanceMonitor', () => {
  it('displays performance metrics', () => {
    render(<PerformanceMonitor apiLatency={123} claimCount={5} />);
    expect(screen.getByText(/Performance Monitor/i)).toBeInTheDocument();
    expect(screen.getByText(/API Latency: 123 ms/i)).toBeInTheDocument();
    expect(screen.getByText(/Claim Items Rendered: 5/i)).toBeInTheDocument();
  });
});
