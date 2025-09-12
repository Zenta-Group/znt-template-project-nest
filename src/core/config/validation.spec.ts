import { validate } from './validation';

describe('validate', () => {
  it('should return default values for missing optional config', () => {
    const config = { SECRETKEY_AUTH: 'key' };
    const result = validate(config);
    expect(result.PORT).toBe(3000);
    expect(result.SECRETKEY_AUTH).toBe('key');
    expect(result.TOKEN_EXPIRATION).toBe('1h');
  });

  it('should throw if required config is missing', () => {
    expect(() => validate({})).toThrow(/SECRETKEY_AUTH/);
  });

  it('should allow unknown keys', () => {
    const config = { SECRETKEY_AUTH: 'key', EXTRA: 'value' };
    const result = validate(config);
    expect(result.EXTRA).toBe('value');
  });

  it('should validate types', () => {
    const config = { SECRETKEY_AUTH: 'key', PORT: 'not-a-number' };
    expect(() => validate(config)).toThrow(/must be a number/);
  });
});
