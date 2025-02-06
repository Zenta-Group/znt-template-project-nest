import { LoginRs } from '../dtos/login-rs';

export interface IAuthService<Payload> {
  signIn(payload: Payload): Promise<LoginRs>;
}
