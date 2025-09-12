import { AppLogger } from './app.logger';

describe('AppLogger', () => {
  let logger: AppLogger;
  let pino: any;

  beforeEach(() => {
    pino = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    };
    logger = new AppLogger(pino);
  });

  it('should log info', () => {
    logger.log('msg');
    expect(pino.info).toHaveBeenCalled();
  });

  it('should log error', () => {
    logger.error('err');
    expect(pino.error).toHaveBeenCalled();
  });

  it('should log warn', () => {
    logger.warn('warn');
    expect(pino.warn).toHaveBeenCalled();
  });

  it('should log debug', () => {
    logger.debug('debug');
    expect(pino.debug).toHaveBeenCalled();
  });

  it('should log verbose', () => {
    logger.verbose('verbose');
    expect(pino.trace).toHaveBeenCalled();
  });
});
