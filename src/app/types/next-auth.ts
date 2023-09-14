import { DefaultSession } from 'next-auth';

// extend9ng av user type til nextauth så jeg kan ha min egen data i uten problemer
declare module 'next-auth' {
  interface User {
    id: string;
    whitelisted: boolean;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}
