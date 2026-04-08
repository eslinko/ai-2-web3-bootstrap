/**
 * Stub: Arweave / crystallization signing path.
 * Заменить реализацией, совместимой с uploader и режимом ARWEAVE_SIGN_MODE.
 *
 * @param {object} _request — см. signing-types.example.mjs
 * @returns {Promise<{ signed: unknown }>}
 */
export async function signArweavePayloadStub(_request) {
  throw new Error(
    "signArweavePayloadStub: replace with real signing (see docs/wallet/SIGNING_MODEL.md)"
  );
}
