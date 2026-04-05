import { cp, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

export async function ensureTargetDirectory(targetDir: string): Promise<void> {
  try {
    const targetStat = await stat(targetDir);
    if (!targetStat.isDirectory()) {
      throw new Error(`目标路径存在但不是目录: ${targetDir}`);
    }

    const files = await readdir(targetDir);
    if (files.length > 0) {
      throw new Error(`目标目录非空: ${targetDir}`);
    }
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await mkdir(targetDir, { recursive: true });
      return;
    }
    throw error;
  }
}

export async function copyTemplate(templateDir: string, targetDir: string): Promise<void> {
  await cp(templateDir, targetDir, { recursive: true });
}

export async function replaceProjectName(targetDir: string, projectName: string): Promise<void> {
  const packageJsonPath = resolve(targetDir, "package.json");
  const content = await readFile(packageJsonPath, "utf8");
  const rendered = content.replaceAll("__PROJECT_NAME__", projectName);
  await writeFile(packageJsonPath, rendered, "utf8");
}

export function resolveTemplateDir(packageRootDir: string, templateName: string): string {
  return join(packageRootDir, "templates", templateName);
}
