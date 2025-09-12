import { SecurityType } from './axios.configuration';

describe('SecurityType', () => {
  it('should have expected enum values', () => {
    expect(SecurityType.NONE).toBe('none');
    expect(SecurityType.API_KEY).toBe('api-key');
    expect(SecurityType.BEARER_TOKEN).toBe('bearer-token');
    expect(SecurityType.GOOGLE_CLOUD_RUN_AUTH).toBe('google-cloud-run-auth');
  });
});
