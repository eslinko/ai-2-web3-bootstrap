/**
 * Minimal phase-based validator template.
 * @param {{ phase: string, payload?: Record<string, unknown> }} ctx
 * @returns {{ ok: boolean, errors: string[] }}
 */
function validatePhase(ctx) {
  const errors = [];
  if (!ctx.phase) errors.push("phase is required");
  // Add checks per phase, e.g. env, file existence, schema
  return { ok: errors.length === 0, errors };
}

module.exports = { validatePhase };
