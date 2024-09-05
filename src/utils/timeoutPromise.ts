interface TimeoutError extends Error {
  name: 'TimeoutError';
}

export function timeoutPromise<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Timeout') as TimeoutError), ms);
  });
  return Promise.race([promise, timeout]);
}