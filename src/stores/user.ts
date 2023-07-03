import { ref } from 'vue'
import { defineStore } from 'pinia'
import { get, set } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'
import { setAuthorizationHeader, useGet } from '@/composables/useRequest'

export const useUserStore = defineStore('user', () => {
  const isLogined = ref(false)
  const user = ref({
    uuid: '',
    username: '',
    telnum: ''
  })
  function logout() {
    useCookies().remove(import.meta.env.VITE_COOKIE_NAME)
    set(isLogined, false)
    set(user, {
      uuid: '',
      username: '',
      telnum: ''
    })
  }
  async function login(token: string) {
    useCookies().remove(import.meta.env.VITE_COOKIE_NAME)
    useCookies().set(import.meta.env.VITE_COOKIE_NAME, token)
    await syncLogin()
  }
  async function syncLogin() {
    const token = useCookies().get(import.meta.env.VITE_COOKIE_NAME)
    if (!token) logout()
    const { data, error } = await useGet(
      '/authentication/sync-authentication',
      setAuthorizationHeader()
    )
    if (get(error)) {
      logout()
    } else if (get(data)) {
      set(isLogined, true)
      set(user, {
        ...get(data).data
      })
    }
  }
  return { isLogined, user, login, syncLogin }
})
