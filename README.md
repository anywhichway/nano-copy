# nano-copy

Superfast, super small (1,327 bytes minimized, 647 gzipped) JavaScript object deep copy. 
Comparable to fast-copy in speed across multiple test runs.

## Usage

```
npm install nano-copy
```

```
const nanoCopy = require("nano-copy");
```

or 

```
<script src="./browser/nano-copy.min.js" type="application/javascript"></script>
```

## Clone Types Supported

### Built-in Classes

```javascript
[ArrayBuffer,BigInt,Blob,Boolean,Buffer,DataView,Date,Error,Int8Array,Int16Array,Int32Array,Map,Number,RegExp,Set,String,Uint8Array,Uint16Array,Uint32Array]
```

`Blob`, `Buffer` and `DataView` are platform dependent and are included or excluded accordingly.

### Custom constructors assuming:

1) There is a static `from` method on the class constructor that creates a deep copy.

Or

2) `Object.create(Object.getPrototypeOf(source))` plus interating over all entries in the `source` and assigning their copies to the newly created object is correct.

## Direct Copy

Types returned by `typeof` plus,

```javascript
[Boolean,Error,Number,Promise,String,Symbol,WeakMap,WeakSet]
```

## Not Currently Supported

1) Non-standard keys on Arrays

2) Non-enumerable properties

## API

```
const copy = nanoCopy(source);
```

## Benchmarks

Note, ALL JavaScript benchmarks in a browser or Node.js or Deno should be taken with a grain of salt when packages are within 10 ro 15% of each other
due to browser, operating system, and garbage collection driven impacts.

### simple object.

| Name             | Ops / sec |
| ---------------- | --------- |
| nano-copy        | 3,022,398 |
| fast-copy        | 2,442,471 |
| lodash.cloneDeep | 1,028,148 |
| clone            | 996,120   |
| fast-clone       | 650,103   |
| deepclone        | 576,936   |
| ramda            | 562,043   |

### complex object.

| Name             | Ops / sec |
| ---------------- | --------- |
| nano-copy        | 77,088    |
| ramda            | 68,791    |
| deepclone        | 66,892    |
| fast-copy        | 66,825    |
| fast-clone       | 44,917    |
| clone            | 33,022    |
| lodash.cloneDeep | 24,610    |


### circular object


| Name             | Ops / sec |
| ---------------- | --------- |
| nano-copy        | 1,464,237 |
| fast-copy        | 955,628   |
| deepclone        | 620,598   |
| ramda            | 598,227   |
| lodash.cloneDeep | 480,912   |
| clone            | 471,526   |
| fast-clone       | 0         |



### averages

| Name             | Ops / sec |
| ---------------- | --------- |
| nano-copy        | 1,607.397 |
| fast-copy        | 1,231.544 |
| lodash.cloneDeep | 562.028   |
| clone            | 445.612   |
| deepclone        | 389.008   |
| ramda            | 382.105   |
| fast-clone       | 323.623   |


## Release History (Reverse Chronological Order)

2020-12-10 v0.0.4b Documentation fixes.

2020-12-10 v0.0.3b Fixed node export. Added benchee benchmarks.

2020-12-10 v0.0.2b Replaced Object.entries(data) with for(const key in data). Faster and gets inherited properties.

2020-12-09 v0.0.1b Initial public release (BETA)
