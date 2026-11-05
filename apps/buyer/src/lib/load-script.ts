/**
 * Loads a third-party script once, however many components ask for it, and
 * resolves when it is ready. A script that failed to load is removed so a later
 * attempt can retry instead of waiting on a tag that will never fire.
 */
const pending = new Map<string, Promise<void>>();

export function loadScript(id: string, src: string): Promise<void> {
  const existing = pending.get(id);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('no document'));
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      pending.delete(id);
      reject(new Error(`Could not load ${src}`));
    };
    document.head.appendChild(script);
  });

  pending.set(id, promise);
  return promise;
}
