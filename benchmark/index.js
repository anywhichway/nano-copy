/* For this file only

MIT License

Copyright (c) 2018 Tony Quetano with modifications by AnyWhichWay Copyright (c) 2020

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

const { createSuite } = require('benchee');
const Table = require('cli-table2');

/************* data *************/

class Foo {
  constructor(value) {
    this.value = value;
  }
}

const simpleObject = {
  boolean: true,
  nil: null,
  number: 123,
  string: 'foo',
};

const complexObject = Object.assign({}, simpleObject, {
  array: ['foo', { bar: 'baz' }],
  arrayBuffer: new ArrayBuffer(8),
  buffer: new Buffer('this is a test buffer'),
  dataView: new DataView(new ArrayBuffer(16)),
  date: new Date(),
  error: new Error('boom'),
  fn() {
    return 'foo';
  },
  map: new Map().set('foo', { bar: { baz: 'quz' } }),
  nan: NaN,
  object: { foo: { bar: 'baz' } },
  promise: Promise.resolve('foo'),
  regexp: /foo/,
  set: new Set().add('foo').add({ bar: { baz: 'quz' } }),
  typedArray: new Uint8Array([12, 15]),
  undef: undefined,
  weakmap: new WeakMap([[{}, 'foo'], [{}, 'bar']]),
  weakset: new WeakSet([{}, {}]),
  [Symbol('key')]: 'value',
});

const circularObject = {
  deeply: {
    nested: {
      reference: {},
    },
  },
};

circularObject.deeply.nested.reference = circularObject;


/************* setup *************/

const getResults = results => {
  const table = new Table({
    head: ['Name', 'Ops / sec'],
  });

  results.forEach(({ name, stats }) => {
    table.push([name, stats.ops.toLocaleString()]);
  });

  return table.toString();
};

const packages = {
  clone: require('clone'),
  deepclone: require('deepclone'),
  nanocopy: require('../index.js'),
  'fast-clone': require('fast-clone'),
  'fast-copy': require('../test/fast-copy.min.js'),
  // deactivated while it cannot build on linux
  // 'fast-deepclone': require('fast-deepclone'),
  'lodash.cloneDeep': require('lodash').cloneDeep,
  ramda: require('ramda').clone,
};

const suite = createSuite({
  minTime: 1000,
  onComplete(results) {
    const combinedResults = Object.keys(results)
      .reduce((combined, group) => {
        const groupResults = results[group];

        return groupResults.map(({ name, stats }) => {
          const existingRowIndex = combined.findIndex(
            ({ name: rowName }) => name === rowName,
          );

          return ~existingRowIndex
            ? {
                ...combined[existingRowIndex],
                stats: {
                  elapsed: (combined[existingRowIndex].stats.elapsed +=
                    stats.elapsed),
                  iterations: (combined[existingRowIndex].stats.iterations +=
                    stats.iterations),
                },
              }
            : {
                name,
                stats: {
                  elapsed: stats.elapsed,
                  iterations: stats.iterations,
                },
              };
        });
      }, [])
      .map(({ name, stats }) => ({
        name,
        stats: {
          ...stats,
          ops: stats.iterations / stats.elapsed,
        },
      }))
      .sort((a, b) => {
        if (a.stats.ops > b.stats.ops) {
          return -1;
        }

        if (a.stats.ops < b.stats.ops) {
          return 1;
        }

        return 0;
      });

    console.log('');
    console.log('Benchmark results complete, overall averages:');
    console.log('');
    console.log(getResults(combinedResults));
    console.log('');
  },
  onGroupComplete({ group, results }) {
    console.log('');
    console.log(`...finished group ${group}.`);
    console.log('');
    console.log(getResults(results));
    console.log('');
  },
  onGroupStart(group) {
    console.log('');
    console.log(`Starting benchmarks for group ${group}...`);
    console.log('');
  },
  onResult({ name, stats }) {
    console.log(
      `Benchmark completed for ${name}: ${stats.ops.toLocaleString()} ops/sec`,
    );
  },
});

/************* tests *************/

for (let name in packages) {
  const copy = packages[name];

  suite.add(name, 'simple object', () => copy(simpleObject));
  suite.add(name, 'complex object', () => copy(complexObject));
  suite.add(name, 'circular object', () => copy(circularObject));
}

suite.run();