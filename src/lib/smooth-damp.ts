/**
 * Critically damped smoothing — Unity's SmoothDamp, ported from oil-motion's
 * `interactive-motion.ts`. Returns the next position and the velocity that
 * carries into the following frame.
 *
 * A CSS transition cannot express this. Its duration is fixed regardless of
 * distance, and every new target restarts the curve from zero — so an input
 * that keeps moving keeps the value pinned to the fast opening of the easing
 * curve. Integrating a velocity instead gives the motion mass: it leans into a
 * move, trails a fast one, and coasts to rest when the input stops. It never
 * overshoots.
 *
 * Two callers, two uses: the command deck damps a continuous parallax offset,
 * and the cat damps a facing value that is only *then* quantised into a pose —
 * which is what stops it flickering between sprites at a threshold.
 */
export function smoothDamp(
  current: number,
  target: number,
  velocity: number,
  smoothTime: number,
  maxSpeed: number,
  deltaTime: number,
): [number, number] {
  const safeTime = Math.max(0.0001, smoothTime);
  const omega = 2 / safeTime;
  const x = omega * deltaTime;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const maxChange = maxSpeed * safeTime;
  const change = Math.min(maxChange, Math.max(-maxChange, current - target));
  const limitedTarget = current - change;
  const temp = (velocity + omega * change) * deltaTime;
  let nextVelocity = (velocity - omega * temp) * decay;
  let nextPosition = limitedTarget + (change + temp) * decay;

  // Snap once the integrator crosses the target, so it settles exactly.
  if (target - current > 0 === nextPosition > target) {
    nextPosition = target;
    nextVelocity = 0;
  }
  return [nextPosition, nextVelocity];
}
