const docs = require('../test-snapshots/complex-radar-crash-20210417.json');

export default () => ({
  empty: false,
  metadata: { fromCache: false },
  docs: docs
    .slice()
    .reverse()
    .map((d) => ({
      data: () => d,
    })),
});
