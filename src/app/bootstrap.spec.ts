/**
 * Bootstrap smoke test.
 *
 * The project has zero `*.spec.ts` files today. Angular's Karma test target
 * fails to compile when `tsconfig.spec.json`'s `include` glob matches no
 * files (`TS18003: No inputs were found in config file`). This single,
 * trivial test is a bootstrap shim: it lets the test runner start so the
 * real specs (added in B2 and onwards) can run, and it acts as a canary
 * that the Karma + Jasmine + ChromeHeadless pipeline is wired up end-to-end.
 *
 * It will be removed once a real test exists that exercises the same
 * boundary (the doctor service spec, Batch 2).
 */
describe('bootstrap', () => {
  it('runs the Karma + Jasmine pipeline end-to-end', () => {
    expect(true).toBe(true);
  });
});
