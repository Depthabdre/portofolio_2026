// Client navigation intent only. History and direct URLs keep their native
// scroll behavior instead of being treated as fresh section-link clicks.
let pendingAnchor: string | null = null;

export function queueHomeAnchor(href: string) {
  pendingAnchor = href.slice(href.indexOf("#") + 1);
}

export function getQueuedHomeAnchor() {
  return pendingAnchor;
}

export function finishHomeAnchor(anchor: string) {
  if (pendingAnchor === anchor) pendingAnchor = null;
}
