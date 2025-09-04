// vite.aliases.ts (repo root)
import path from "path";
import { fileURLToPath } from "url";

const repoRoot = path.resolve(fileURLToPath(new URL(".", import.meta.url)));
const microfrontendsDir = path.join(repoRoot, "microfrontends");


export const crossAliases = {
  // shared cross-package aliases point to repo-absolute paths
  "@shared": path.join(repoRoot, "shared"),
  "@microfrontends": microfrontendsDir,
};

export function buildMfeAliases(names: string[]): Record<string, string> {
  return names.reduce<Record<string, string>>((acc, name) => {
    acc[`@${name}`] = path.join(microfrontendsDir, name, "src");
    return acc;
  }, {});
}

// helper for a project-local '@'
// export const localSrc = (dir: string) => ({ `@${dir}`: path.join(dir, "src") });