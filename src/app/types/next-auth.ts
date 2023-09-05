import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    whitelisted: boolean;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}
