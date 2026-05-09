export interface AuthUser {
  id: string
  email: string
  fullName: string | null
}

export interface SignInForm {
  email: string
  password: string
}

export interface RegisterForm {
  fullName: string
  email: string
  password: string
  passwordConfirm: string
}

export interface AuthModalState {
  isOpen: boolean
  mode: 'signin' | 'register'
  redirectTo: string | null
}
