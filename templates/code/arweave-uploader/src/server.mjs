/**
 * Минимальный crystallization-сервис (паттерн эталона: arweave-uploader/dist/server.js).
 * Полный pipeline: verify token → validate data item → bundle → callback — добавлять по таскам.
 */
import Fastify from "fastify";

const port = Number(process.env.PORT ?? 3000);

const app = Fastify({ logger: true });

app.get("/health", async () => ({
  ok: true,
  service: "arweave-uploader",
  version: "0.0.0-starter",
}));

// Hook: POST /v1/crystalize — тело { upload_id, upload_token, signed_data_item, payload_size }
app.post("/v1/crystalize", async (request, reply) => {
  reply.code(501).send({
    code: "not_implemented",
    message: "Starter only — реализуйте по контракту эталона (verifyUploadToken, validateDataItem, bundle, postCallback)",
  });
});

async function boot() {
  await app.listen({ host: "0.0.0.0", port });
  console.log(`[arweave-uploader] listening on ${port}`);
}

boot().catch((err) => {
  console.error(err);
  process.exit(1);
});
