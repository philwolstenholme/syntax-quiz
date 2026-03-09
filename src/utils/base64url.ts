export function toBase64Url(data: string): string {
  return btoa(data)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')
}

export function fromBase64Url(encoded: string): string {
  let base64 = encoded.replaceAll('-', '+').replaceAll('_', '/')
  while (base64.length % 4) base64 += '='
  return atob(base64)
}
