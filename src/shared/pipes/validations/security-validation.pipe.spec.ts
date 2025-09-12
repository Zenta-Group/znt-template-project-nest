import { SecurityValidationPipe } from './security-validation.pipe';
import { BadRequestException } from '@nestjs/common';

describe('SecurityValidationPipe', () => {
  let pipe: SecurityValidationPipe;
  beforeEach(() => {
    pipe = new SecurityValidationPipe();
  });

  it('debería retornar el valor si es seguro (string)', () => {
    expect(pipe.transform('seguro', { type: 'body' })).toBe('seguro');
  });

  it('debería retornar el objeto si es seguro', () => {
    const obj = { a: 'ok', b: { c: 'seguro' } };
    expect(pipe.transform(obj, { type: 'body' })).toEqual(obj);
  });

  it('debería lanzar error por SQL Injection', () => {
    expect(() => pipe.transform('DROP TABLE users;', { type: 'body' })).toThrow(
      BadRequestException,
    );
  });

  it('debería lanzar error por XSS', () => {
    expect(() =>
      pipe.transform('<script>alert(1)</script>', { type: 'body' }),
    ).toThrow(BadRequestException);
  });

  it('debería lanzar error por SQL Injection en objeto anidado', () => {
    const obj = { a: 'ok', b: { c: 'DROP TABLE users;' } };
    expect(() => pipe.transform(obj, { type: 'body' })).toThrow(
      BadRequestException,
    );
  });

  it('debería lanzar error por XSS en objeto anidado', () => {
    const obj = { a: 'ok', b: { c: '<script>alert(1)</script>' } };
    expect(() => pipe.transform(obj, { type: 'body' })).toThrow(
      BadRequestException,
    );
  });
});
