class ResizeObserver {
  callback: globalThis.ResizeObserverCallback;

  constructor(callback: globalThis.ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback([{ target } as globalThis.ResizeObserverEntry], this);
  }

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

class DOMMatrixReadOnly {
  m22: number;
  constructor(transform: string) {
    const scale = transform?.match(/scale\(([1-9.])\)/)?.[1];
    this.m22 = scale !== undefined ? +scale : 1;
  }
}
// @ts-ignore
global.DOMMatrixReadOnly = DOMMatrixReadOnly;

// Object.defineProperties(global.HTMLElement.prototype, {
//   offsetHeight: {
//     get() {
//       return parseFloat(this.style.height) || 1;
//     },
//   },
//   offsetWidth: {
//     get() {
//       return parseFloat(this.style.width) || 1;
//     },
//   },
// });

// (global.SVGElement as any).prototype.getBBox = () => ({
//   x: 0,
//   y: 0,
//   width: 0,
//   height: 0,
// });

export {};
