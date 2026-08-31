/**
 * A casual, client-side-only gate for this pre-launch TEST site — not real
 * access control. This site is a static export with no server, so there is
 * nowhere to check a password that isn't also shipped to the browser:
 * anyone can still read the underlying page data via view-source, a direct
 * fetch/curl, or by running `sessionStorage.setItem(UNLOCK_STORAGE_KEY, "1")`
 * in devtools. This only keeps a TEST site out of casual browsing and
 * search engines — never use this pattern for anything sensitive.
 *
 * To change the password: compute a new SHA-256 hex digest —
 * `printf '%s' 'new-password' | shasum -a 256` — and replace the constant
 * below. Hashing only keeps the plaintext out of the built JS bundle; it
 * does not make this secure.
 */
export const UNLOCK_STORAGE_KEY = "marin-strategic-plan:unlocked";

// sha256("strategicplan2026")
export const PASSWORD_SHA256 =
  "c4f4203db0f8ddf55226a4c0d19708854f5a8c9dbc988c685393734942e8ac08";

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkPassword(input: string): Promise<boolean> {
  return (await sha256Hex(input)) === PASSWORD_SHA256;
}

// A tiny external store over sessionStorage, read via useSyncExternalStore:
// sessionStorage isn't available during the static-export server render, and
// writing to it from the same tab that reads it fires no `storage` event, so
// a plain useState+useEffect read can't safely initialize from it or react
// to markUnlocked() below without an extra render pass.
const listeners = new Set<() => void>();

export function isUnlocked(): boolean {
  return sessionStorage.getItem(UNLOCK_STORAGE_KEY) === "1";
}

export function isUnlockedServer(): boolean {
  return false;
}

export function subscribeUnlocked(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function markUnlocked(): void {
  sessionStorage.setItem(UNLOCK_STORAGE_KEY, "1");
  listeners.forEach((listener) => listener());
}
