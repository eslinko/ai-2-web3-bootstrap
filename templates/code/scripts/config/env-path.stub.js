/**
 * Canonical env file for deploy scripts (pattern from эталона scripts/lib/env-path.js).
 * Путь НЕ жёстко привязан к Amanita.
 */
const path = require("path");

/** @returns {string} */
function getScriptsEnvPath(repoRoot = process.cwd()) {
  return path.join(repoRoot, "scripts", ".env");
}

module.exports = { getScriptsEnvPath };
