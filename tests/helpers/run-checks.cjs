async function runChecks(suiteName, checks) {
  let hasFailure = false;

  for (const [checkName, check] of checks) {
    try {
      await check();
      console.log(`PASS ${suiteName}: ${checkName}`);
    } catch (error) {
      hasFailure = true;
      console.error(`FAIL ${suiteName}: ${checkName}`);
      console.error(error && error.stack ? error.stack : error);
    }
  }

  if (hasFailure) {
    process.exitCode = 1;
    return;
  }

  console.log(`All ${suiteName} checks passed.`);
}

module.exports = {
  runChecks,
};