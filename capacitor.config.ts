import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'tech.aiur.easestore',
  appName: 'Ease Store',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
  // plugins: {
  //   "CapacitorHttp": {
  //     "enabled": true,
  //   },
  //   "CapacitorCookies": {
  //     "enabled": true
  //   }
  // }
}

export default config
