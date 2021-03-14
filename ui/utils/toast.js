import { toast as toastOriginal } from 'react-toastify'

const config = {
  position: 'top-right',
  autoClose: 10000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
}

export const toast = {
  info: msg => toastOriginal.info(msg, config),
  success: msg => toastOriginal.success(msg, config),
  warn: msg => toastOriginal.warn(msg, config),
  error: msg => toastOriginal.error(msg, config),
}

export const errorHandler = e => {
  if (e.response !== undefined) {
    const error = `(${e.response.status}) ${e.response.config.method.toUpperCase()} ${
      e.response.config.url
    }: ${e.response.data}`

    console.error(error)
    toast.error(error)
  } else {
    toast.error('Empty response from server')
  }
}
