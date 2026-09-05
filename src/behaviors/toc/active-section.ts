export function activeSectionIndex(
  positions: readonly number[],
  threshold: number,
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
): number {
  if (positions.length === 0) return -1;
  // A short last section may never reach the sticky-header threshold.
  if (scrollY > 0 && scrollY + viewportHeight >= documentHeight - 1) return positions.length - 1;
  let current = 0;
  positions.forEach((top, index) => {
    if (top <= threshold) current = index;
  });
  return current;
}
