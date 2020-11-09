import test from 'ava';

import { runGlobAndModifyTsFiles } from './ts-inquisition';

test('runGlobAndModifyTsFiles', async (t) => {
  runGlobAndModifyTsFiles('');
  t.snapshot('');
});
