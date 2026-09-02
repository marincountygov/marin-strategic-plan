import type { BaseEntity } from "@/lib/content/schema";

/**
 * Per-collection draft persistence for the admin editor — sessionStorage
 * would lose work on tab close, so this uses localStorage deliberately.
 * There is no server here (static export), so this is the only place an
 * in-progress edit lives until it's exported and committed by a human. See
 * CollectionEditor.tsx for how a draft relates to the published data.
 */
const PREFIX = "marin-admin-draft:";

// A tiny pub/sub so components can read the draft via useSyncExternalStore
// (SSR-safe, and avoids the setState-in-effect pattern this codebase
// already ruled out once for SiteLock — see src/lib/site-lock.ts for the
// same reasoning) instead of a useState+useEffect pair.
const listeners = new Set<() => void>();

export function subscribeDraftChanges(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyDraftChanged(): void {
  listeners.forEach((listener) => listener());
}

export function loadDraft(file: string): BaseEntity[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + file);
    return raw ? (JSON.parse(raw) as BaseEntity[]) : null;
  } catch {
    return null;
  }
}

export function saveDraft(file: string, nodes: BaseEntity[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + file, JSON.stringify(nodes));
  } catch {
    // Draft persistence is a convenience, not a critical path — a quota
    // error or a private-browsing block just means edits stop autosaving.
  }
  notifyDraftChanged();
}

export function clearDraft(file: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PREFIX + file);
  } catch {
    // See saveDraft — non-critical.
  }
  notifyDraftChanged();
}
