import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

process.env.NUXT_TELEMETRY_DISABLED ??= '1';
process.env.NUXT_IGNORE_LOCK ??= '1';

const appRoot = fileURLToPath(new URL('../', import.meta.url));
process.chdir(appRoot);

const builtinRequire = createRequire(import.meta.url);
process.getBuiltinModule = (name) => {
  try {
    return builtinRequire(name);
  } catch {
    return undefined;
  }
};

const [, , ...argv] = process.argv;
process.argv = ['node', 'nuxi', ...argv];

await import('../../../node_modules/nuxi/bin/nuxi.mjs');
