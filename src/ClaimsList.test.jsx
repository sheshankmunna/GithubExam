import { render, screen } from '@testing-library/react';
import ClaimsList from './ClaimsList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('ClaimsList', () => {
  it('renders claims list and skeleton loaders', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ClaimsList policyId="P1" />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Claims List/i)).toBeInTheDocument();
    // Skeleton loaders should be present initially
    // (presentation role is not set, so check for animated pulse class)
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
