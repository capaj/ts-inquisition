import { runGlobAndModifyTsFiles } from '../ts-inquisition';
const args = process.argv.slice(2);
console.log('args', args);
const folder = args[0];

runGlobAndModifyTsFiles(folder);
