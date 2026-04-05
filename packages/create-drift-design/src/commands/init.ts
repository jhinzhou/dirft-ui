import { access } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { copyTemplate, ensureTargetDirectory, replaceProjectName, resolveTemplateDir } from "../utils/fs.js";

type PackageManager = "pnpm" | "npm" | "yarn";
type TemplateName = "vue-ts";

interface InitArgs {
  projectName?: string;
  template: TemplateName;
  pm?: PackageManager;
  yes: boolean;
  install?: boolean;
  help: boolean;
}

const SUPPORTED_TEMPLATE: TemplateName = "vue-ts";
const SUPPORTED_PM: PackageManager[] = ["pnpm", "npm", "yarn"];
const NPM_PACKAGE_NAME_RE = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

export async function runInitCommand(argv: string[]): Promise<void> {
  const args = parseArgs(argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const rl = createInterface({ input, output });

  try {
    const projectName = await resolveProjectName(args, rl);
    validateProjectName(projectName);

    const template = await resolveTemplate(args, rl);
    const packageManager = await resolvePackageManager(args, rl);
    const shouldInstall = await resolveInstallOption(args, rl);

    const targetDir = resolve(process.cwd(), projectName);
    await ensureTargetDirectory(targetDir);

    const packageRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
    const templateDir = resolveTemplateDir(packageRootDir, template);
    await assertTemplateExists(templateDir);

    await copyTemplate(templateDir, targetDir);
    await replaceProjectName(targetDir, projectName);

    if (shouldInstall) {
      await installDependencies(targetDir, packageManager);
    }

    printNextSteps(projectName, packageManager, shouldInstall);
  } finally {
    rl.close();
  }
}

function parseArgs(rawArgs: string[]): InitArgs {
  const parsed: InitArgs = {
    template: SUPPORTED_TEMPLATE,
    yes: false,
    help: false
  };

  for (let i = 0; i < rawArgs.length; i += 1) {
    const current = rawArgs[i];
    if (!current) {
      continue;
    }
    if (!current.startsWith("-") && !parsed.projectName) {
      parsed.projectName = current;
      continue;
    }

    if (current === "--yes" || current === "-y") {
      parsed.yes = true;
      continue;
    }

    if (current === "--help" || current === "-h") {
      parsed.help = true;
      continue;
    }

    if (current === "--install") {
      parsed.install = true;
      continue;
    }

    if (current === "--no-install") {
      parsed.install = false;
      continue;
    }

    if (current.startsWith("--template")) {
      parsed.template = readOptionValue(rawArgs, i, current, "--template") as TemplateName;
      if (current === "--template") {
        i += 1;
      }
      continue;
    }

    if (current.startsWith("--pm")) {
      parsed.pm = readOptionValue(rawArgs, i, current, "--pm") as PackageManager;
      if (current === "--pm") {
        i += 1;
      }
      continue;
    }
  }

  return parsed;
}

function readOptionValue(rawArgs: string[], index: number, current: string, optionName: string): string {
  if (current.includes("=")) {
    const [, value] = current.split("=", 2);
    if (!value) {
      throw new Error(`${optionName} 缺少参数值`);
    }
    return value;
  }

  const next = rawArgs[index + 1];
  if (!next || next.startsWith("-")) {
    throw new Error(`${optionName} 缺少参数值`);
  }
  return next;
}

async function resolveProjectName(args: InitArgs, rl: ReturnType<typeof createInterface>): Promise<string> {
  if (args.projectName) {
    return args.projectName;
  }
  if (args.yes) {
    throw new Error("缺少项目名，请使用: create-drift-design <project-name>");
  }
  const answer = (await rl.question("项目名: ")).trim();
  if (!answer) {
    throw new Error("项目名不能为空");
  }
  return answer;
}

function validateProjectName(projectName: string): void {
  if (!NPM_PACKAGE_NAME_RE.test(projectName)) {
    throw new Error(`非法项目名: ${projectName}`);
  }
}

async function resolveTemplate(args: InitArgs, rl: ReturnType<typeof createInterface>): Promise<TemplateName> {
  if (args.template !== SUPPORTED_TEMPLATE) {
    throw new Error(`当前仅支持模板: ${SUPPORTED_TEMPLATE}`);
  }
  if (args.yes) {
    return SUPPORTED_TEMPLATE;
  }
  const answer = (await rl.question(`模板名称（默认 ${SUPPORTED_TEMPLATE}）: `)).trim();
  if (!answer) {
    return SUPPORTED_TEMPLATE;
  }
  if (answer !== SUPPORTED_TEMPLATE) {
    throw new Error(`当前仅支持模板: ${SUPPORTED_TEMPLATE}`);
  }
  return SUPPORTED_TEMPLATE;
}

async function resolvePackageManager(
  args: InitArgs,
  rl: ReturnType<typeof createInterface>
): Promise<PackageManager> {
  if (args.pm) {
    if (!SUPPORTED_PM.includes(args.pm)) {
      throw new Error(`不支持的包管理器: ${args.pm}`);
    }
    return args.pm;
  }

  const detected = detectPackageManagerFromUserAgent();
  if (args.yes) {
    return detected;
  }

  const answer = (await rl.question(`包管理器（pnpm/npm/yarn，默认 ${detected}）: `)).trim();
  if (!answer) {
    return detected;
  }
  if (!SUPPORTED_PM.includes(answer as PackageManager)) {
    throw new Error(`不支持的包管理器: ${answer}`);
  }
  return answer as PackageManager;
}

function detectPackageManagerFromUserAgent(): PackageManager {
  const userAgent = process.env.npm_config_user_agent ?? "";
  if (userAgent.startsWith("pnpm/")) {
    return "pnpm";
  }
  if (userAgent.startsWith("yarn/")) {
    return "yarn";
  }
  return "npm";
}

async function resolveInstallOption(
  args: InitArgs,
  rl: ReturnType<typeof createInterface>
): Promise<boolean> {
  if (typeof args.install === "boolean") {
    return args.install;
  }
  if (args.yes) {
    return false;
  }
  const answer = (await rl.question("是否立即安装依赖？(y/N): ")).trim().toLowerCase();
  return answer === "y" || answer === "yes";
}

async function assertTemplateExists(templateDir: string): Promise<void> {
  try {
    await access(templateDir);
  } catch {
    throw new Error(`模板目录不存在: ${templateDir}`);
  }
}

async function installDependencies(targetDir: string, pm: PackageManager): Promise<void> {
  const args = pm === "npm" ? ["install"] : ["install"];
  await new Promise<void>((resolvePromise, rejectPromise) => {
    const child = spawn(pm, args, {
      cwd: targetDir,
      stdio: "inherit",
      shell: process.platform === "win32"
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`依赖安装失败，退出码: ${String(code)}`));
      }
    });
    child.on("error", (error) => {
      rejectPromise(error);
    });
  });
}

function printNextSteps(projectName: string, pm: PackageManager, installed: boolean): void {
  const installCmd = pm === "npm" ? "npm install" : `${pm} install`;
  const devCmd = pm === "npm" ? "npm run dev" : `${pm} dev`;

  console.log("\n项目已创建成功。");
  console.log(`\n  cd ${projectName}`);
  if (!installed) {
    console.log(`  ${installCmd}`);
  }
  console.log(`  ${devCmd}\n`);
}

function printHelp(): void {
  console.log(`
create-drift-design

用法:
  create-drift-design <project-name> [options]

选项:
  -h, --help              显示帮助信息
  -y, --yes               使用默认值并跳过交互
  --template <name>       模板名称（当前仅支持 vue-ts）
  --pm <pnpm|npm|yarn>    指定包管理器
  --install               创建后自动安装依赖
  --no-install            创建后不安装依赖
`);
}
