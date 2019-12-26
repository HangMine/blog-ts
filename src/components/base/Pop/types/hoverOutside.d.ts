type hoverOutside = (elements: HTMLElement[], callback: (e: Event) => void) => () => void

type hoverParent = (startaDom: HTMLElement, targetDom: HTMLElement[]) => boolean