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

const toast = {
  info: msg => toastOriginal.info(msg, config),
  success: msg => toastOriginal.success(msg, config),
  warn: msg => toastOriginal.warn(msg, config),
  error: msg => toastOriginal.error(msg, config),
}

export default toast
