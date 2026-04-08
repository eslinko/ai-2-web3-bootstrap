/**
 * Роутер деплоя по DEPLOY_ACTION (паттерн эталона: scripts/deploy_full.js).
 * dotenv из корня контрактного пакета — как в эталоне: path к repo root при монорепо.
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { ethers } = require("hardhat");

async function main() {
  const action = process.env.DEPLOY_ACTION || "0";
  console.log("[deploy_router] DEPLOY_ACTION=", action);
  // Hook: switch (action) { case "1": await deployRegistry(); break; }
  const signers = await ethers.getSigners();
  console.log("[deploy_router] deployer:", signers[0]?.address ?? "(no accounts)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
