import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

interface GateResult {
  name: string;
  command: string;
  passed: boolean;
  stdout: string;
  stderr: string;
}

const gates = [
  { name: "Type Gate", command: "pnpm typecheck" },
  { name: "Behavior Gate", command: "pnpm test" },
  { name: "A11y Gate", command: "pnpm test -- harness/specs/a11y.spec.ts" },
  { name: "Doc Gate", command: "pnpm --filter @drift-design/docs run build" },
  { name: "Meta Gate", command: "pnpm meta:check" },
  { name: "I18n Gate", command: "pnpm i18n:check" },
  { name: "Theme Gate", command: "pnpm theme:check" }
];

function runCommand(command: string): GateResult {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const output = spawnSync(command, {
    cwd: resolve(currentDir, "../../../../"),
    shell: true,
    encoding: "utf8"
  });

  return {
    name: gates.find((gate) => gate.command === command)?.name ?? command,
    command,
    passed: output.status === 0,
    stdout: output.stdout ?? "",
    stderr: output.stderr ?? ""
  };
}

const results = gates.map((gate) => runCommand(gate.command));
const passed = results.every((result) => result.passed);

const report = {
  generatedAt: new Date().toISOString(),
  passed,
  gates: results.map(({ name, command, passed: gatePassed }) => ({
    name,
    command,
    passed: gatePassed
  }))
};

const currentDir = dirname(fileURLToPath(import.meta.url));
const reportDir = resolve(currentDir, "../report");
mkdirSync(reportDir, { recursive: true });
writeFileSync(resolve(reportDir, "harness-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

results.forEach((result) => {
  if (!result.passed) {
    console.error(`\n[${result.name}] failed: ${result.command}\n${result.stderr}`);
  }
});

if (!passed) {
  process.exit(1);
}

console.log("Harness passed. Report generated at harness/report/harness-report.json");
