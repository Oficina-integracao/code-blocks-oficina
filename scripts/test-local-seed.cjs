const { spawnSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const seedResult = spawnSync(
  "docker",
  [
    "exec",
    "-i",
    "supabase_db_code-blocks-oficina",
    "psql",
    "-U",
    "postgres",
    "-d",
    "postgres",
    "-v",
    "ON_ERROR_STOP=1",
    "-f",
    "-",
    "--single-transaction",
  ],
  {
    input: readFileSync(path.join(root, "supabase/seed.sql")),
    stdio: ["pipe", "inherit", "inherit"],
  },
);

checkResult(seedResult);

const testResult =
  process.platform === "win32"
    ? spawnSync(
        "cmd.exe",
        [
          "/d",
          "/s",
          "/c",
          "npx.cmd --yes supabase@2.120.0 test db --local supabase/tests/database/seed.test.sql",
        ],
        { cwd: root, stdio: "inherit" },
      )
    : spawnSync(
        "npx",
        [
          "--yes",
          "supabase@2.120.0",
          "test",
          "db",
          "--local",
          "supabase/tests/database/seed.test.sql",
        ],
        { cwd: root, stdio: "inherit" },
      );
checkResult(testResult);

function checkResult(result) {
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
