import docs from '../test-snapshots/complex-radar-crash-20200613.json';

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
