/** Encode a JS value to a URL-safe base64 string that works with non-Latin1 content (Chinese, etc). */
export function encodeShareData<T>(data: T): string {
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json)));
}

/** Decode a URL-safe base64 string back to a JS value. */
export function decodeShareData<T>(encoded: string): T {
  const json = decodeURIComponent(escape(atob(encoded)));
  return JSON.parse(json) as T;
}
