import { HTTPConfig } from './type'

export const isAbsoluteUrl = (url: string) => {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

export const combineUrls = (baseUrl: string, relativeUrl: string) => {
  return relativeUrl
    ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '')
    : baseUrl
}

export const buildFullPath = (
  baseUrl: string | undefined,
  requestUrl: string
) => {
  if (baseUrl && !isAbsoluteUrl(requestUrl)) {
    return combineUrls(baseUrl, requestUrl)
  }
  return requestUrl
}

export const mergeHTTPConfig = <C extends HTTPConfig>(
  config1: C,
  config2: C
): C => {
  return {
    ...config1,
    ...config2,
    header: {
      ...config1.header,
      ...config2.header
    },
    errorCode: {
      ...config1.errorCode,
      ...config2.errorCode
    },
    errorMessage: {
      ...config1.errorMessage,
      ...config2.errorMessage
    }
  }
}
