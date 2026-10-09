import test from 'node:test';
import assert from 'node:assert/strict';
import { createArticleSearch } from '../src/lib/search.ts';

const posts = [
  { title: 'Data platforms', description: 'Architecture, governance and a practical introduction to data ownership across large organizations, including Spark.' },
  { title: 'Spark streaming', description: 'Custom stateful processing with timeouts and performance considerations.' },
  { title: 'Bitcoin economics', description: 'Limited supply, halving cycles and price volatility.' },
  { title: 'Gestão de features', description: 'Consistent inputs for machine learning.' },
];
const search = createArticleSearch(posts);

test('an empty or whitespace-only query preserves the full chronological list', () => {
  assert.deepEqual(search(''), posts);
  assert.deepEqual(search('   '), posts);
});

test('search tolerates typos and ranks a title match above a description match', () => {
  assert.equal(search('sprk')[0].title, 'Spark streaming');
  assert.ok(search('SPARK').some((post) => post.title === 'Data platforms'));
});

test('search finds description-only terms, including late in a long description', () => {
  assert.deepEqual(search('volatilty'), [posts[2]]);
  assert.ok(search('ownership').includes(posts[0]));
});

test('multiple terms can match across title and description, in any order', () => {
  assert.deepEqual(search('timeouts spark'), [posts[1]]);
});

test('search ignores accents and returns no results for unrelated text', () => {
  assert.deepEqual(search('gestao'), [posts[3]]);
  assert.deepEqual(search('zzqxwvj'), []);
});
