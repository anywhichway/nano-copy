# nano-copy

Superfast, super small (1,327 bytes minimized, 647 gzipped) JavaScript object deep copy. Comparable to fast-copy in speed across multiple runs in browser.

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

## Release History (Reverse Chronological Order)

2020-12-10 v0.0.2b Replaced Object.entries(data) with for(const key in data). Faster and gets inherited properties.

2020-12-09 v0.0.1b Initial public release (BETA)
