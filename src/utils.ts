// https://stackoverflow.com/a/59787588

export function flatten(object: Record<string, any>, callback: (key: string, value: any) => void) {
  function recursion(object: any, prefix: string) {
    for (const key in object) {
      if (!Object.prototype.hasOwnProperty.call(object, key)) continue;
      if (typeof object[key] === "object" && object[key] !== null) recursion(object[key], prefix + key + ".");
      else callback(prefix + key, object[key]);
    }
  }
  recursion(object, "");
}

export function unflatten(iterator: IterableIterator<[string, any]>, mapper: (x: any) => any) {
  const result: Record<string, any> = {};
  for (const [key, value] of iterator) {
    const keys = key.split(".");
    const last = keys.pop()!;
    keys.reduce((object, key) => (object[key] ||= {}), result)[last] = mapper(value);
  }
  return result;
}

export function tryDecode(str: string) {
  try {
    return decodeURIComponent(str.replace(/%(?![\da-f]{2})/gi, "%25"));
  } catch {
    return str;
  }
}
