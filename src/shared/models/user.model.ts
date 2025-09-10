export interface User {
  id: string;
  name: string;
  lastname: string;
  username: string;
  documentId: string;
  email: string;
  password: string;
  status: boolean;
  role?: string;
  aditionalData?: any;
}
