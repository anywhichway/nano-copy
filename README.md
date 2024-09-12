# nano-copy

Superfast, super small (1,461 bytes minimized, 709 gzipped) JavaScript object deep copy. 
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

## Direct Copy, i.e. the same instance will be in the copy

Types returned by `typeof` plus,

```javascript
[Boolean,Error,Number,Promise,String,Symbol,WeakMap,WeakSet]
```

## Not Currently Supported

1) Non-enumerable properties

## API

```
const copy = nanoCopy(source);
```

Or, to copy non-standard properties on Arrays and other built-in classes pass an optional argument. Note, there is a negative performance impact on long arrays.

```
const copy = nanoCopy(source,{nonStandard:true);
```

## Benchmarks

Note, ALL JavaScript benchmarks in a browser or Node.js or Deno should be taken with a grain of salt when packages are within 10 ro 15% of each other
due to browser, operating system, and garbage collection driven impacts.

### simple object.


| Name             | Ops / sec |
| ---------------- | --------- |
| nanocopy         | 6,114,025 |
| fast-copy        | 4,913,596 |
| lodash.cloneDeep | 2,497,153 |
| clone            | 1,931,488 |
| ramda            | 1,082,327 |
| fast-clone       | 939,717   |
| deepclone        | 933,128   |


### complex object.

| Name             | Ops / sec |
| ---------------- | --------- |
| nanocopy         | 140,249   |
| fast-copy        | 118,246   |
| ramda            | 112,758   |
| deepclone        | 103,544   |
| fast-clone       | 68,412    |
| clone            | 58,591    |
| lodash.cloneDeep | 42,097    |


### circular object

| Name             | Ops / sec |
| ---------------- | --------- |
| nanocopy         | 2,621,642 |
| fast-copy        | 1,719,962 |
| ramda            | 1,036,171 |
| deepclone        | 967,305   |
| clone            | 787,177   |
| lodash.cloneDeep | 755,432   |
| fast-clone       | 0         |


### averages


| Name             | Ops / sec |
| ---------------- | --------- |
| nanocopy         | 2,997.136 |
| fast-copy        | 2,221.935 |
| lodash.cloneDeep | 1,160.977 |
| clone            | 914.969   |
| ramda            | 710.087   |
| deepclone        | 585.068   |
| fast-clone       | 447.621   |


## Release History (Reverse Chronological Order)

2024-12-09 v0.1.1 Fixed issue related to objects potentially not having a constructor. Re-ran benchmarks.

2020-12-13 v0.1.0 Added support for non-standard properties on Arrays and clonable objects.

2020-12-10 v0.0.4b Documentation fixes.

2020-12-10 v0.0.3b Fixed node export. Added benchee benchmarks.

2020-12-10 v0.0.2b Replaced Object.entries(data) with for(const key in data). Faster and gets inherited properties.

2020-12-09 v0.0.1b Initial public release (BETA)
