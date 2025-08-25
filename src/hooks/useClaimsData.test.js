import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClaimsData } from './useClaimsData';

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    data: [{ id: 1, policyId: 'P1', createdDate: '2025-08-26', status: 'Open' }],
    pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 }
  })
});

describe('useClaimsData', () => {
  it('fetches claims data and exposes apiLatency', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result, waitFor } = renderHook(() => useClaimsData('P1'), { wrapper });
    await waitFor(() => result.current.data !== undefined);
    expect(result.current.data.pages[0].data[0].id).toBe(1);
    expect(typeof result.current.apiLatency).toBe('number');
  });
});
