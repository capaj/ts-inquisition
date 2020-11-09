import json5 from 'json5';

import globby from 'globby';
import _, { uniq } from 'lodash';
import os from 'os';
import path from 'path';
import ts, { CompilerOptions } from 'typescript';
import { readFileSync, writeFileSync } from 'fs';
const tsJsonPath = path.join(process.cwd(), 'tsconfig.json');

console.log('path', tsJsonPath);
const tsconfig = json5.parse(readFileSync(tsJsonPath, 'utf8'));

const compilerOptions = _.omit(tsconfig.compilerOptions, ['moduleResolution']);
compilerOptions.noEmit = true;
compilerOptions.lib = ['lib.dom.d.ts', `${process.cwd()}/types/custom.d.ts`];

function nthIndex(str: string, pat: string, n: number) {
  var L = str.length,
    i = -1;
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i);
    if (i < 0) break;
  }
  return i;
}

const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`;

export async function runGlobAndModifyTsFiles(folder: string) {
  const globPath = path.join(process.cwd(), `${folder}/*.{ts,tsx}`);
  console.log('runGlobAndModifyTsFiles -> globPath', globPath);
  const files = await globby([globPath]);

  files && addExpectErrors(files, compilerOptions);
}

function addExpectErrors(fileNames: string[], options: CompilerOptions) {
  const program = ts.createProgram(fileNames, options);
  const allDiagnostics = ts.getPreEmitDiagnostics(program);
  const errorLinesByFiles: Record<string, number[]> = {};

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { fileName } = diagnostic.file;
      if (fileNames.indexOf(fileName) < 0) {
        return;
      }
      if (!errorLinesByFiles[fileName]) {
        errorLinesByFiles[fileName] = [];
      }

      const { line } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start as number
      );
      errorLinesByFiles[fileName].push(line);
    } else {
      console.log(
        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`
      );
    }
  });

  Object.entries(errorLinesByFiles).forEach(([file, badLines]) => {
    let fileContent = readFileSync(file, 'utf8');
    const badLinesDeduped = uniq(badLines);
    let lineShift = 0;
    badLinesDeduped.forEach((line) => {
      const indexOfTheLine = nthIndex(fileContent, os.EOL, line + lineShift);
      fileContent = insertAt(
        fileContent,
        `${os.EOL}// @ts-expect-error`,
        indexOfTheLine
      );
      lineShift += 1;
    });
    writeFileSync(file, fileContent, 'utf8');
    console.log(`${badLinesDeduped.length} error/s expected in ${file}`);
  });
}
