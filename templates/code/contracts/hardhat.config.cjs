/**
 * Минимальный Hardhat config (паттерн эталона: корневой hardhat.config.js).
 * Секреты только из .env; не коммитить ключи.
 */
require("@nomicfoundation/hardhat-toolbox");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const key = process.env.DEPLOYER_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: { chainId: 31337 },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: key ? [`0x${String(key).replace(/^0x/, "")}`] : undefined,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
