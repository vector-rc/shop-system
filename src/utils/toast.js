const buildToast = (msg, type, toastContainer, body, duration) => {
  const classToast = ('t' + Date.now() + Math.random()).replace('.', '')
  const classBtn = ('b' + Date.now() + Math.random()).replace('.', '')
  const toastContent = ` <button class="${classBtn} delete"></button>${msg}`
  const toast = document.createElement('div')
  toast.classList.add(classToast, 'notification', 'is-' + type, 'toast', 'm-1')
  toast.innerHTML = toastContent
  toastContainer.appendChild(toast)
  body.appendChild(toastContainer)
  const btnClose = document.querySelector('.' + classBtn)
  btnClose.onclick = () => {
    toastContainer.removeChild(toast)
  }
  if (duration === -1) return
  setTimeout(() => {
    toast.style.opacity = 0
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast)
      }
    }, 1100)
  }, duration - 500)
}

const Toast = () => {
  const body = document.querySelector('#app')

  let toastContainer = document.querySelector('.toastContainer')
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.classList.add('toastContainer')
  }
  return {
    danger: (msg, duration = -1) => {
      buildToast(msg, 'danger', toastContainer, body, duration)
    },
    warning: (msg, duration = -1) => {
      buildToast(msg, 'warning', toastContainer, body, duration)
    },
    success: (msg, duration = -1) => {
      buildToast(msg, 'success', toastContainer, body, duration)
    },
    info: (msg, duration = -1) => {
      buildToast(msg, 'info', toastContainer, body, duration)
    }

  }
}

export const toast = Toast()

// const showToast = (msg:string) => {
//   const body:HTMLElement = document.querySelector('body') as HTMLElement
//   const style = `
//   position: absolute;
//     top: 0;
//     right: 0;
//     z-index: 99;
//     margin: 1rem;
//   `
//   const toast:string = `div style="${style}" class="notification is-danger mt-5" v-if="showMsg">
//   <button class="delete"></button>
//   ${msg}
// </div>`

//   body.innerHTML = toast
// }

// module.exports = { showToast }
