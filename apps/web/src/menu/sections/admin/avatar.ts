/**
 * Profile picture storage.
 *
 * There is no endpoint to upload an avatar to — the gateway exposes only /auth/login,
 * /auth/logout and /auth/me — so the picture is held in this browser's localStorage as a
 * data URL, keyed by username so two people sharing a machine do not see each other's.
 *
 * That means it does not follow the user to another browser or device, and the panel says
 * so. When SAP-backed profiles arrive, replace the three storage functions with requests
 * and the rest of the screen is unchanged.
 */

/** Raster formats only. SVG is excluded deliberately: it is a document that can carry
 *  script, and accepting one as a "picture" invites it into places an <img> is not the
 *  only consumer. Nothing here needs vector avatars. */
export const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

/** Base64 inflates by about a third, and localStorage is ~5MB, so this leaves ample room. */
export const MAX_BYTES = 1024 * 1024

const KEY_PREFIX = 'slc.avatar.'

/** Pure, so the rules are testable: the reason the file is unacceptable, or undefined. */
export function validateAvatarFile(file: { type: string; size: number }): string | undefined {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Choose a PNG, JPEG, WebP or GIF image.'
  }
  if (file.size > MAX_BYTES) {
    const mb = (MAX_BYTES / 1024 / 1024).toFixed(0)
    return `That image is larger than ${mb}MB. Choose a smaller one.`
  }
  return undefined
}

function keyFor(username: string): string {
  return `${KEY_PREFIX}${username}`
}

/** A blocked or empty store simply means no picture; it is not an error worth surfacing. */
export function loadAvatar(username: string): string | undefined {
  try {
    return window.localStorage.getItem(keyFor(username)) ?? undefined
  } catch {
    return undefined
  }
}

/** False when the write failed — private browsing, or the quota is full. */
export function saveAvatar(username: string, dataUrl: string): boolean {
  try {
    window.localStorage.setItem(keyFor(username), dataUrl)
    return true
  } catch {
    return false
  }
}

export function clearAvatar(username: string): void {
  try {
    window.localStorage.removeItem(keyFor(username))
  } catch {
    // Nothing to do: if it cannot be removed it could not have been written either.
  }
}
