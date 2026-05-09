import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      fullName: string | null
    } & DefaultSession['user']
  }

  interface User {
    fullName?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    fullName?: string | null
  }
}
