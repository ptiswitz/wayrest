import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    fullName?: unknown
    email?: unknown
    password?: unknown
  }>(event)

  const fullName = body?.fullName
  const email = body?.email
  const password = body?.password

  if (!fullName || !email || !password) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  // validatePassword is auto-imported from server/utils/validatePassword.ts
  const validation = validatePassword(String(password))
  if (!validation.valid) {
    throw createError({ statusCode: 400, message: validation.errors[0] })
  }

  const config = useRuntimeConfig(event)
  const supabase = createClient(config.supabaseUrl as string, config.supabaseKey as string)

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', String(email))
    .maybeSingle()

  if (existing) {
    throw createError({ statusCode: 409, message: 'Email already taken' })
  }

  const passwordHash = await bcrypt.hash(String(password), 12)
  const id = crypto.randomUUID()

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      id,
      full_name: String(fullName),
      email: String(email),
      password_hash: passwordHash,
    })
    .select('id, email, full_name')
    .single()

  if (error || !user) {
    throw createError({ statusCode: 500, message: 'Failed to create user' })
  }

  setResponseStatus(event, 201)
  return {
    user: {
      id: user.id as string,
      email: user.email as string,
      fullName: user.full_name as string | null,
    },
  }
})
