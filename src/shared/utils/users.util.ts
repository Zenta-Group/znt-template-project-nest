import * as bcrypt from 'bcrypt';

export class UsersUtil {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static replaceIfNotEmpty<T>(value: T, replace: T): T {
    return replace ? replace : value;
  }
}
