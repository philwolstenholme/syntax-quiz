import { fromBase64url, toBase64url } from '@exodus/bytes/base64.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export function toBase64Url(data: string): string {
  return toBase64url(encoder.encode(data))
}

export function fromBase64Url(encoded: string): string {
  return decoder.decode(fromBase64url(encoded))
}
