type clickOutside = (
  element: HTMLElement,
  callback: (e: Event) => void
) => () => void;

type parent = (startaDom: HTMLElement, targetDom: HTMLElement) => boolean;
