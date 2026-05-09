import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  const authStore = useAuthStore()

  const isProtected = to.path.startsWith('/booking') || to.path === '/my-bookings'

  if (isProtected && status.value !== 'authenticated') {
    authStore.openSignIn(to.fullPath)
    return abortNavigation()
  }
})
