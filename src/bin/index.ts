#!/usr/bin/env node
import { runGlobAndModifyTsFiles } from '../ts-inquisition'
const args = process.argv.slice(2)

const folder = args[0]

runGlobAndModifyTsFiles(folder)
