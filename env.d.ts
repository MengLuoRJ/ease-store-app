/// <reference types="vite/client" />

/**
 * @description ImportMetaEnv
 */
interface ImportMetaEnv {
  // NOTE: VITE_* variables will be exposed in the client/broswer
  /**
   * @description API Base URL for production
   */
  VITE_API_BASE_URL: string
  /**
   * @description API Base URL for development
   */
  VITE_API_BASE_URL_DEV: string
  /**
   * @description Name of the cookie to store the JWT token
   */
  VITE_COOKIE_NAME: string
  /**
   * @description Payment methods options, stored as a stringified JSON
   * @example `"['cash','wechat-1','alipay-1']"`
   * @warn This is a temporary solution, should be replaced by a proper API
   */
  VITE_PAYMENT_METHODS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * @description __APP_INFO__
 */
declare const __APP_INFO__: {
  name: string
  version: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}
