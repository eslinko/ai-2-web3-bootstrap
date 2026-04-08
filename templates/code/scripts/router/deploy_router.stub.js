#!/usr/bin/env node
/**
 * Starter deploy router — замените handlers и registry под свой проект.
 * Не копируйте целый эталонный action table.
 */
/* eslint-disable no-console */

function usage() {
  console.error("Usage: node deploy_router.stub.js <action> [args...]");
  console.error("Actions: list | help");
  process.exit(1);
}

/** @type {Record<string, () => Promise<void>>} */
const registry = {
  list: async () => {
    console.log("Registered actions:", Object.keys(registry).filter((k) => k !== "help").join(", "));
  },
  help: async () => {
    console.log("Add handlers to registry. Wire config from ../config.");
  },
};

async function main() {
  const [, , action = "help"] = process.argv;
  const fn = registry[action];
  if (!fn) {
    console.error("Unknown action:", action);
    usage();
  }
  await fn();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
