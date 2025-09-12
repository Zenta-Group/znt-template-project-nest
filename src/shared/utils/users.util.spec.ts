import { UsersUtil } from './users.util';

describe('UsersUtil', () => {
  it('should hash password', async () => {
    const hash = await UsersUtil.hashPassword('1234');
    expect(hash).toBeDefined();
    expect(hash).not.toBe('1234');
  });

  it('should replace if not empty', () => {
    expect(UsersUtil.replaceIfNotEmpty('a', 'b')).toBe('b');
    expect(UsersUtil.replaceIfNotEmpty('a', undefined)).toBe('a');
  });

  it('should find matching roles', () => {
    const roles = UsersUtil.findMatchingRoles('admin');
    expect(Array.isArray(roles)).toBe(true);
  });
});
