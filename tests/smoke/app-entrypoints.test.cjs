const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { projectRoot } = require('../helpers/load-workspace-ts-module.cjs');
const { runChecks } = require('../helpers/run-checks.cjs');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), 'utf8'));
}

function assertFile(relativePath) {
  assert.equal(
    fs.existsSync(path.join(projectRoot, relativePath)),
    true,
    `Expected file to exist: ${relativePath}`,
  );
}

runChecks('smoke', [
  ['workspace apps expose standalone scripts for local ownership', () => {
    const scriptExpectations = [
      ['apps/shell/package.json', ['dev', 'build', 'start', 'typecheck']],
      ['apps/products/package.json', ['dev', 'build', 'start', 'typecheck']],
      ['apps/cart/package.json', ['dev', 'build', 'start', 'typecheck']],
      ['apps/profile/package.json', ['dev', 'build', 'preview', 'typecheck']],
    ];

    for (const [relativePath, requiredScripts] of scriptExpectations) {
      const pkg = readJson(relativePath);

      for (const scriptName of requiredScripts) {
        assert.equal(typeof pkg.scripts?.[scriptName], 'string', `${relativePath} is missing script ${scriptName}`);
      }
    }
  }],
  ['shell owns host routes and deep-link entrypoints for every remote', () => {
    const requiredShellRoutes = [
      'apps/shell/app/products/page.tsx',
      'apps/shell/app/products/[...slug]/page.tsx',
      'apps/shell/app/cart/page.tsx',
      'apps/shell/app/cart/[...slug]/page.tsx',
      'apps/shell/app/profile/page.tsx',
      'apps/shell/app/profile/[...slug]/page.tsx',
      'apps/shell/components/remote-route-page.tsx',
      'apps/shell/components/remote-surface.tsx',
    ];

    for (const relativePath of requiredShellRoutes) {
      assertFile(relativePath);
    }
  }],
  ['each remote keeps a standalone entrypoint and shared packages expose public contracts', () => {
    const requiredFiles = [
      'apps/products/app/page.tsx',
      'apps/cart/app/page.tsx',
      'apps/profile/pages/index.vue',
      'apps/profile/pages/security.vue',
      'packages/shared-types/index.ts',
      'packages/shared-ui/index.ts',
      'packages/shared-ui/styles.css',
    ];

    for (const relativePath of requiredFiles) {
      assertFile(relativePath);
    }

    const sharedTypesPackage = readJson('packages/shared-types/package.json');
    const sharedUiPackage = readJson('packages/shared-ui/package.json');

    assert.equal(sharedTypesPackage.main, 'index.ts');
    assert.equal(sharedTypesPackage.types, 'index.ts');
    assert.equal(sharedUiPackage.main, 'index.ts');
    assert.equal(sharedUiPackage.style, 'styles.css');
  }],
]);