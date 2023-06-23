/// <reference types="vite/client" />

/**
  * @description ImportMetaEnv
 */
interface ImportMetaEnv {
  // NOTE: VITE_* variables will be exposed in the client/broswer
  /**
   * @description API Base URL for production
   */
  API_BASE_URL: string
  /**
   * @description API Base URL for development
   */
  API_BASE_URL_DEV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
