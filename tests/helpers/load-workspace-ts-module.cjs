const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..', '..');
const moduleCache = new Map();

const aliasMap = {
  '@commerce/shared-types': path.join(projectRoot, 'packages/shared-types/index.ts'),
};

function resolveWithExtensions(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  throw new Error(`Unable to resolve workspace module from ${basePath}`);
}

function resolveWorkspaceModule(request, parentFile) {
  if (request in aliasMap) {
    return aliasMap[request];
  }

  if (request.startsWith('.')) {
    return resolveWithExtensions(path.resolve(path.dirname(parentFile), request));
  }

  if (path.isAbsolute(request)) {
    return resolveWithExtensions(request);
  }

  return null;
}

function loadWorkspaceTsModule(modulePath) {
  const absolutePath = resolveWithExtensions(
    path.isAbsolute(modulePath)
      ? modulePath
      : path.resolve(projectRoot, modulePath),
  );

  if (moduleCache.has(absolutePath)) {
    return moduleCache.get(absolutePath).exports;
  }

  const source = fs.readFileSync(absolutePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
    },
    fileName: absolutePath,
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(absolutePath, module);

  function localRequire(request) {
    const workspaceTarget = resolveWorkspaceModule(request, absolutePath);
    if (workspaceTarget) {
      return loadWorkspaceTsModule(workspaceTarget);
    }

    return require(request);
  }

  const wrapped = `(function (exports, require, module, __filename, __dirname) {${transpiled}\n})`;
  const executor = vm.runInThisContext(wrapped, { filename: absolutePath });
  executor(module.exports, localRequire, module, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

module.exports = {
  loadWorkspaceTsModule,
  projectRoot,
};