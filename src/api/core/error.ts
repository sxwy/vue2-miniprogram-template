import { HTTPRequestConfig, HTTPResponse } from './type'

export class HTTPError extends Error {
  constructor(
    public code: string,
    public message: string,
    public config?: HTTPRequestConfig,
    public response?: HTTPResponse
  ) {
    super(message)
    this.code = code
    this.message = message
    this.config = config
    this.response = response
  }
}

export const createError = (
  code: string,
  message: string,
  config?: HTTPRequestConfig,
  response?: HTTPResponse
) => {
  return new HTTPError(code, message, config, response)
}

export const isSessionExpiredError = (error: any) => {
  const code = String(error?.code)
  return code === '401'
}

export const isAuthorityError = (error: any) => {
  const code = String(error?.code)
  return code === '403'
}
