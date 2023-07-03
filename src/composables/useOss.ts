import { get } from '@vueuse/core'
import { setAuthorizationHeader, usePost } from './useRequest'

export async function getSignedUrl(url: string): Promise<string | undefined> {
  if (!url) return undefined
  const { data, error } = await usePost('/oss/sign-url', {
    data: { url: url },
    ...setAuthorizationHeader()
  })
  if (get(error)) {
    console.log(get(error))
  } else if (get(data)) {
    return get(data).data as string
  }
  return undefined
}
