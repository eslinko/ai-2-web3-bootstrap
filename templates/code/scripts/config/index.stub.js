/**
 * Minimal config bootstrap: dotenv optional (install dotenv in target project if needed).
 */
const path = require("path");
const { getScriptsEnvPath } = require("./env-path.stub");

function loadEnv() {
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    require("dotenv").config({ path: getScriptsEnvPath() });
  } catch {
    /* dotenv optional at scaffold stage */
  }
}

loadEnv();

module.exports = {
  repoRoot: process.cwd(),
  rpcUrl: process.env.RPC_URL || "http://127.0.0.1:8545",
};
