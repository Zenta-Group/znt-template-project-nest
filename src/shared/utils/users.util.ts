import * as bcrypt from 'bcrypt';
import { PersonRole } from 'src/core/database/adapters/typeorm/entities/person.entity';

export class UsersUtil {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static replaceIfNotEmpty<T>(value: T, replace: T): T {
    return replace ?? value;
  }

  /**
   * Finds matching roles by partial text (like)
   */
  static readonly findMatchingRoles = (query: string): PersonRole[] => {
    const roleMap: Record<string, PersonRole> = {
      ADMIN: PersonRole.ADMIN,
      USER: PersonRole.USER,
    };
    const matchingRoles: PersonRole[] = [];
    Object.entries(roleMap).forEach(([key, value]) => {
      if (key.toLowerCase().includes(query.toLowerCase())) {
        if (!matchingRoles.includes(value)) {
          matchingRoles.push(value);
        }
      }
    });
    return matchingRoles;
  };
}
