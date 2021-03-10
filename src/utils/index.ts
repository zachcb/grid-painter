export function debounce(callback: Function, wait: number, immediate: boolean) {
  let timeout = 0;

  return () => {
    const context = this;
    const willExecute = immediate && !timeout;

    const later = () => {
      timeout = 0;

      if (!immediate) {
        callback.apply(context, arguments);
      }
    }

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (willExecute) {
      callback.apply(context, arguments);
    }
  }
}

export function throttle(callback: Function, limit: number) {
  let sleeping = false;

  return () => {
    if (!sleeping) {
      callback.apply(this, arguments);

      sleeping = true;

      setTimeout(function () {
        sleeping = false;
      }, limit);
    }
  }
}
