const on: event = (element, eventName, callback, secondCallback) => {
  switch (eventName) {
    case 'click':
    default:
      element.addEventListener('click', callback)
      break;
    case 'hover':
      element.addEventListener('mouseenter', callback)
      // secondCallback && element.addEventListener('mouseleave', secondCallback)
      break;
  }
}

const off: event = (element, eventName, callback, secondCallback) => {
  switch (eventName) {
    case 'click':
    default:
      element.removeEventListener('onclick', callback)
      break;
    case 'hover':
      element.removeEventListener('mouseenter', callback)
      // secondCallback && element.removeEventListener('mouseleave', secondCallback)

      break;
  }

}


export { on, off };