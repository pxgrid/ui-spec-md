#!/usr/bin/env node

const convertAbsPathBasedCwd = require('../lib/utils/convert-abs-path-based-cwd')

const argv = require('yargs')
  .commandDir('commands')
  .coerce(['mdDir', 'destDir', 'rootDir', 'themeDir'], convertAbsPathBasedCwd).argv
