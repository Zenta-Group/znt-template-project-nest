export type Person = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: boolean;
  additionalData?: any;
};
