const { expect, test } = require('@jest/globals');

test('trivial util', () => {
  const toTitle = s => s[0].toUpperCase() + s.slice(1);
  expect(toTitle('octocat')).toBe('Octocat');
});
