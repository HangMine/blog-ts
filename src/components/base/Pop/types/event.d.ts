type event = (element: HTMLElement, eventName: string, callback: (e: Event) => void, secondCallback?: (e: Event) => void) => void

type eventLister = (element: HTMLElement, eventName: string, options: {
  on: (e: Event) => void,
  off: (e: Event) => void,
}) => void