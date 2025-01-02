import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await client.query("SELECT * FROM users WHERE email = $1", [
          credentials.email,
        ]);
        const user = res.rows[0];

        if (user && user.password === credentials.password) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: Adapters.TypeORM.Adapter(
    {
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: true,
    },
    {
      models: {
        User: Adapters.TypeORM.Models.User,
        Account: Adapters.TypeORM.Models.Account,
        Session: Adapters.TypeORM.Models.Session,
        VerificationRequest: Adapters.TypeORM.Models.VerificationRequest,
      },
    },
  ),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  callbacks: {
    async signIn(user, account, profile) {
      return true;
    },
    async redirect(url, baseUrl) {
      return baseUrl;
    },
    async session(session, user) {
      session.user.id = user.id;
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
