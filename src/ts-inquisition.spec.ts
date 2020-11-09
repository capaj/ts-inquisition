import test from 'ava';
import fsExtra from 'fs-extra';
import path from 'path';
import { runGlobAndModifyTsFiles } from './ts-inquisition';

test('runGlobAndModifyTsFiles', async (t) => {
  const currentRunPath = 'tests/current-run';
  await fsExtra.copy('tests/fixture-1', currentRunPath);

  await runGlobAndModifyTsFiles(`${currentRunPath}/**`);
  t.snapshot(
    fsExtra.readFileSync(
      path.join(currentRunPath, '/with-few-errors.tsx'),
      'utf8'
    )
  );
  await fsExtra.remove(currentRunPath); // cleanup
});
