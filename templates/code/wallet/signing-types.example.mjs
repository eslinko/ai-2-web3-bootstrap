/**
 * Пример контрактов signing client (не runtime).
 * Реальная типизация — в вашем стеке (TypeScript / Zod / OpenAPI client).
 */

/**
 * @typedef {Object} ArweaveSignRequest
 * @property {string} kind - например "sign_arweave"
 * @property {unknown} payload - материал от ноды для подписи Data Item
 */

/**
 * @typedef {Object} EvmSignRequest
 * @property {string} kind - например "sign_contract"
 * @property {unknown} payload - сырой tx или поля для сборки
 */

/**
 * @typedef {Object} SigningClientConfig
 * @property {string} userId - POC single-user id на ноде
 * @property {boolean} [enableArweave]
 * @property {boolean} [enableEvm]
 */

export {};
