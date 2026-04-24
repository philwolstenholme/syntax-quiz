export function toBase64Url(data: string): string {
  return btoa(data).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function fromBase64Url(encoded: string): string {
  let b64 = encoded.replaceAll("-", "+").replaceAll("_", "/");
  while (b64.length % 4) b64 += "=";
  return atob(b64);
}
