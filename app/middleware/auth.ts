export default defineNuxtRouteMiddleware((to, from) => {
  // Проверка аутентификации
  const user = useCookie('user')
  
  if (!user.value) {
    // Сохраняем путь, куда пользователь хотел попасть
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
