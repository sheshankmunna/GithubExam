import { isEnabled } from './featureFlag';

jest.mock('../config.json', () => ({
  featureFlags: { useNewUserApi: true }
}));

describe('featureFlag', () => {
  it('returns true when enabled', () => {
    expect(isEnabled('useNewUserApi')).toBe(true);
  });
});
