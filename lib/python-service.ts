import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const CLI_PATH = "service/cli.py";

async function runPython<T>(args: string[]) {
  const { stdout } = await execFileAsync("python", [CLI_PATH, ...args], {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024 * 4,
  });
  return JSON.parse(stdout) as T;
}

export async function scanRepo(repoUrl: string, horizon: string) {
  return runPython(["scan", "--repo", repoUrl, "--horizon", horizon]);
}

export async function compareRepos(repoUrl: string, otherRepoUrl: string, horizon: string) {
  return runPython(["compare", "--repo", repoUrl, "--other", otherRepoUrl, "--horizon", horizon]);
}

export async function exploreRepos(horizon: string, category?: string) {
  const args = ["explore", "--horizon", horizon];
  if (category) {
    args.push("--category", category);
  }
  return runPython(args);
}
