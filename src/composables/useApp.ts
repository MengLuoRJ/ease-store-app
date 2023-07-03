import { App } from '@capacitor/app'
import type { PluginListenerHandle } from '@capacitor/core'

let backButtonListener: PluginListenerHandle

export function clearAppListeners() {
  App.removeAllListeners()
}

export function setAppBackHistory() {
  removeAppBackLisener()
  backButtonListener = App.addListener('backButton', () => {
    history.back()
  })
}

export function setAppBackCallbackOnce(callback: () => void, setBackHistory = true) {
  removeAppBackLisener()
  backButtonListener = App.addListener('backButton', () => {
    callback()
    removeAppBackLisener()
    if (setBackHistory) setAppBackHistory()
  })
}

export function removeAppBackLisener() {
  if (!backButtonListener) return
  backButtonListener.remove()
}
