import { ConfirmationsController } from './confirmations.controller';

describe('ConfirmationsController', () => {
  let controller: ConfirmationsController;

  beforeEach(() => {
    controller = new ConfirmationsController(null);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
