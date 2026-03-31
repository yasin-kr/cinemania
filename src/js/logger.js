const IS_DEV = import.meta.env.DEV;

export function reportError(...args) {
  if (IS_DEV) {
    console.error(...args);
  }
}
