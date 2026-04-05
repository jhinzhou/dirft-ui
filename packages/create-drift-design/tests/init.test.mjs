import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

function runNode(commandPath, args, cwd) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(process.execPath, [commandPath, ...args], {
      cwd,
      stdio: "pipe"
    });

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", rejectPromise);
    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise(undefined);
        return;
      }
      rejectPromise(new Error(stderr || `CLI exited with code ${String(code)}`));
    });
  });
}

test("should scaffold project with fixed dependency versions", async () => {
  const tmpRoot = await mkdtemp(join(tmpdir(), "create-drift-design-test-"));
  const cliEntry = resolve(process.cwd(), "dist/index.js");

  await runNode(cliEntry, ["demo-app", "--yes", "--pm", "pnpm", "--no-install"], tmpRoot);

  const packageJsonPath = join(tmpRoot, "demo-app", "package.json");
  const mainTsPath = join(tmpRoot, "demo-app", "src", "main.ts");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
  const mainTs = await readFile(mainTsPath, "utf8");

  assert.equal(packageJson.name, "demo-app");
  assert.equal(packageJson.dependencies["drift-design"], "1.0.1");
  assert.match(mainTs, /drift-design\/styles\.css/);
});
