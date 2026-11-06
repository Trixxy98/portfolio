// Shared so the loading screen can preload exactly the model the hero renders.
export const SMALL_SCREEN_QUERY = '(max-width: 767px)'

export function carModelUrl(isSmallScreen) {
  return isSmallScreen ? '/models/f1-2026-concept-mobile.glb' : '/models/f1-2026-concept.glb'
}
