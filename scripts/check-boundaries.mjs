import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();
const appsRoot = path.join(workspaceRoot, 'apps');
const appNames = ['shell', 'products', 'cart', 'profile'];
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.vue']);
const skippedDirs = new Set(['node_modules', '.next', '.nuxt', '.output', 'dist']);
const importPattern = /(?:import|export)\s+(?:[^'"`]*?\s+from\s+)?['"]([^'"`]+)['"]|import\(\s*['"]([^'"`]+)['"]\s*\)/g;

function walk(currentPath, files = []) {
  for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skippedDirs.has(entry.name)) {
        continue;
      }

      walk(path.join(currentPath, entry.name), files);
      continue;
    }

    if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(path.join(currentPath, entry.name));
    }
  }

  return files;
}

function getOwnerApp(filePath) {
  const relative = path.relative(appsRoot, filePath);
  const [ownerApp] = relative.split(path.sep);
  return appNames.includes(ownerApp) ? ownerApp : null;
}

function resolveImport(filePath, specifier) {
  if (specifier.startsWith('.')) {
    return path.resolve(path.dirname(filePath), specifier);
  }

  if (specifier.startsWith('/')) {
    return path.resolve(workspaceRoot, `.${specifier}`);
  }

  return null;
}

function detectImportedApp(resolvedPath) {
  const normalized = path.normalize(resolvedPath);

  for (const appName of appNames) {
    const appRoot = path.join(appsRoot, appName) + path.sep;

    if (normalized.startsWith(appRoot)) {
      return appName;
    }
  }

  return null;
}

const violations = [];
const files = walk(appsRoot);

for (const filePath of files) {
  const ownerApp = getOwnerApp(filePath);

  if (!ownerApp) {
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const match of content.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2];

    if (!specifier) {
      continue;
    }

    const resolvedImport = resolveImport(filePath, specifier);

    if (!resolvedImport) {
      continue;
    }

    const importedApp = detectImportedApp(resolvedImport);

    if (!importedApp || importedApp === ownerApp) {
      continue;
    }

    violations.push({
      filePath,
      ownerApp,
      importedApp,
      specifier,
    });
  }
}

if (violations.length > 0) {
  console.error('Boundary check failed. Direct app-to-app imports are not allowed.');

  for (const violation of violations) {
    console.error(`- ${path.relative(workspaceRoot, violation.filePath)} (${violation.ownerApp} -> ${violation.importedApp}) imports ${violation.specifier}`);
  }

  process.exit(1);
}

console.log('Boundary check passed. No app imports code directly from another app.');