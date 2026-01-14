import { randomBytes } from "crypto";
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const keys = await generateKeyPair("RS256", {
  extractable: true,
});
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });
const instanceSecret = randomBytes(32).toString("hex");

process.stdout.write(
  `JWT_PRIVATE_KEY='${privateKey.trimEnd().replace(/\n/g, " ")}'\n\n`,
);
process.stdout.write(`JWKS='${jwks}'\n\n`);
process.stdout.write(`INSTANCE_SECRET='${instanceSecret}'\n\n`);
