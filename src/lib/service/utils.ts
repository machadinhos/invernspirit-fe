import type { RequestHostContext } from '$lib/service/client';

/* eslint-disable @typescript-eslint/no-explicit-any */
type RemoveFirstArg<T> = T extends (first: any, ...rest: infer R) => infer Return ? (...args: R) => Return : T;

type DeepRemoveFirstArg<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? RemoveFirstArg<T[K]>
    : T[K] extends object
      ? DeepRemoveFirstArg<T[K]>
      : never;
};

export function createClientProxy<T extends object>(routes: T, context: RequestHostContext): DeepRemoveFirstArg<T> {
  const cache = new WeakMap<object, object>();

  function isObjectLike(val: unknown): val is object {
    return typeof val === 'object' && val !== null;
  }

  function makeProxy(target: object): object {
    const cached = cache.get(target);
    if (cached) return cached;

    const handler: ProxyHandler<object> = {
      get(t, prop, receiver) {
        const value = Reflect.get(t, prop, receiver);
        if (typeof value === 'function') return value.bind(null, context);

        return isObjectLike(value) ? makeProxy(value) : value;
      },
    };

    const proxy = new Proxy(target, handler);
    cache.set(target, proxy);
    return proxy;
  }

  return makeProxy(routes) as DeepRemoveFirstArg<T>;
}
