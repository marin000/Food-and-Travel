import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        if (credentials.username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && credentials.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
          const user = { username: credentials.username };
          return user;
        } else {
          return null;
        }
      }
    })
  ]
}

export default NextAuth(authOptions)