/**
 * Stub: EVM signing path (ethers или аналог).
 * Не хранить приватные ключи в исходниках — только из env/secret manager.
 *
 * @param {object} _request — см. signing-types.example.mjs
 * @returns {Promise<{ rawTransaction: string }>}
 */
export async function signEvmPayloadStub(_request) {
  throw new Error(
    "signEvmPayloadStub: replace with real signing (see docs/wallet/SIGNING_MODEL.md)"
  );
}
