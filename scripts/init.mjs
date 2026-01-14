import { execSync } from "child_process";

const { JWT_PRIVATE_KEY, JWKS } = process.env;

if (!JWT_PRIVATE_KEY) {
  console.error("Error: JWT_PRIVATE_KEY environment variable is not set");
  process.exit(1);
}

if (!JWKS) {
  console.error("Error: JWKS environment variable is not set");
  process.exit(1);
}

const commands = [
  "npx convex deploy",
  `npx convex env set -- JWT_PRIVATE_KEY "${JWT_PRIVATE_KEY}"`,
  `npx convex env set JWKS "${JWKS}"`,
  "npx convex run seed:run",
];

for (const cmd of commands) {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

console.log("Initialization complete!");
