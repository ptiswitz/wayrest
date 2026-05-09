// SPEC-GAP: @auth/nuxt does not exist on npm; using @sidebase/nuxt-auth which wraps NextAuth v4.
// API is compatible with the spec's described Credentials + JWT behavior.
import { createRequire } from 'module'
import { type AuthOptions } from 'next-auth'

// next-auth v4 ships CJS; Node.js ESM interop wraps module.exports as the default,
// so a plain `import` gives the module object rather than the function.
// createRequire is the Node.js-official way to load CJS from ESM and returns module.exports directly.
const CredentialsProvider = createRequire(import.meta.url)('next-auth/providers/credentials').default
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const supabase = createClient(
          process.env.SUPABASE_URL ?? '',
          process.env.SUPABASE_KEY ?? '',
        )

        const { data: user } = await supabase
          .from('users')
          .select('id, email, full_name, password_hash')
          .eq('email', credentials.email)
          .single()

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.password_hash as string)
        if (!valid) return null

        return {
          id: user.id as string,
          email: user.email as string,
          name: user.full_name as string | null,
          fullName: user.full_name as string | null,
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 86400 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.fullName = (user as { fullName?: string | null }).fullName ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      session.user.fullName = (token.fullName as string | null) ?? null
      return session
    },
  },
}

export default authOptions
