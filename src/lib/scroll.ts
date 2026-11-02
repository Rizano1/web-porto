/**
 * Shared scroll geometry for the parallax page.
 *
 * The hero layers are composed on a 16:9 "scene" that covers the viewport
 * (see --scene-h / --scene-top in globals.css), so the composition keeps its
 * shape at any resolution. The page content starts CONTENT_START_OFFSET % of
 * the scene height below the scene top (right where layer 5 ends) and moves up
 * at CONTENT_SCROLL_SPEED of the window scroll. Every component that maps
 * between "position inside the content" and "window scrollY" must use these.
 */

export const SCENE_ASPECT = 16 / 9;

/** Where the black content section begins (% of scene height, from the scene top). */
export const CONTENT_START_OFFSET = 150;

/** Speed at which the content scrolls relative to the window (0.5 = matches layer 5). */
export const CONTENT_SCROLL_SPEED = 0.5;

/** Window scroll distance (px) during which ContactSection stays pinned. */
export const CONTACT_PIN_SCROLL_PX = 2400;

/** CSS `top` of the content layer — mirrors contentStartPx() below. */
export const CONTENT_TOP_CSS = `calc(var(--scene-top) + var(--scene-h) * ${CONTENT_START_OFFSET / 100})`;

/** JS mirror of --scene-h / --scene-top in globals.css. */
export function getScene(vw = window.innerWidth, vh = window.innerHeight) {
  const height = vw > vh ? Math.max(vh, vw / SCENE_ASPECT) : vh;
  return { top: (vh - height) / 2, height };
}

/** Distance (px) from the viewport top to the start of the content layer, before scrolling. */
export function contentStartPx(): number {
  const scene = getScene();
  return scene.top + (scene.height * CONTENT_START_OFFSET) / 100;
}

/** Window scrollY at which an element at `offsetTop` inside the content reaches the top of the viewport. */
export function contentOffsetToScrollY(offsetTop: number): number {
  return (contentStartPx() + offsetTop) / CONTENT_SCROLL_SPEED;
}
