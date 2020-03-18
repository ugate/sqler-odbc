'use strict';

process.env.UV_THREADPOOL_SIZE = 10;

const Tester = require('./lib/main');
const { Labrat } = require('@ugate/labrat');
const { expect } = require('@hapi/code');
const Lab = require('@hapi/lab');
const lab = Lab.script();
exports.lab = lab;
// ESM uncomment the following lines...
// TODO : import * as Lab from '@hapi/lab';
// TODO : import * as Tester from './lib/main.mjs';
// TODO : import { Labrat } from '@ugate/labrat';
// TODO : import { expect } from '@hapi/code';
// TODO : export * as lab from lab;

const TEST_TKO = 3000;
const TEST_LONG_TKO = 7000;
const plan = `Oracle DB Manager`;

// node test/lib/main.js someTestFunction -NODE_ENV=test

// "node_modules/.bin/lab" test/main.test.js -v
// "node_modules/.bin/lab" test/main.test.js -vi 1

lab.experiment(plan, () => {
  
  if (Tester.before) lab.before(Tester.before);
  if (Tester.after) lab.after(Tester.after);
  if (Tester.beforeEach) lab.beforeEach(Tester.beforeEach);
  if (Tester.afterEach) lab.afterEach(Tester.afterEach);

  lab.test(`${plan}: CRUD`, { timeout: TEST_TKO }, Tester.crud);
});