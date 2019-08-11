const uriToBlob = uri => {
  const byteString = window.atob(uri.split(',')[1])
  const mimeString = uri
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  const buffer = new ArrayBuffer(byteString.length)
  const intArray = new Uint8Array(buffer)
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i)
  }
  return new Blob([buffer], { type: mimeString })
}

const download = (name, data, options) => {
  const saveLink = document.createElement('a')
  let blob

  saveLink.download = name
  saveLink.style.display = 'none'
  document.body.appendChild(saveLink)
  try {
    if (data instanceof Blob) {
      blob = data
    } else if (Array.isArray(data)) {
      blob = new Blob(data, { type: 'application/json' })
    } else if (data.startsWith('data:')) {
      blob = uriToBlob(data)
    } else {
      blob = new Blob([data], { type: 'text/plain' })
    }

    const url = URL.createObjectURL(blob)
    saveLink.href = url
    saveLink.onclick = () => requestAnimationFrame(() => URL.revokeObjectURL(url))
  } catch (e) {
    console.error(e)
    console.warn('Error while getting object URL. Falling back to string URL.')
    saveLink.href = data
  }
  saveLink.click()
  document.body.removeChild(saveLink)
}

export default download
