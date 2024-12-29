declare module "next-auth" {
  interface Session {
    user: {
      guestId: string;
      email: string;
      name?: string;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User {
    guestId?: string;
    email: string;
    name?: string;
    image?: string;
  }
}
