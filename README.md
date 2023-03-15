invoke-fraction
===============

Partition invocations across a set of functions based on defined fractions.

### Example

```js
// Randomly invoke one of following arrow functions based on the given fraction.
// e.g. it'll invoke the first function ~10% of the time if called repeatedly.
invokeFraction([
  [0.1, () => console.log('10%')],
  [0.3, () => console.log('30%')],
  // The number here doesn't matter, provided it's >0, as it's the last partition.
  [0.6, () => console.log('60%')],
]);
```

The `invokeFraction` function also supports a `defaultHandler` parameter, which stands in for the
last item of the handlers array. Note that this is the recommended way to avoid letting the last
item in the handlers array be invoked for the remaining partition, rather than the defined fraction.

```js
invokeFraction([
  [0.1, () => console.log('10%')],
  [0.3, () => console.log('30%')],
], () => console.log('60%'));
```

The `invokeFraction` function will return the value returned by the function invoked, so you can use
this with promises and async/await.

### Publishing a new version

```
GH_TOKEN=xxx npx semantic-release --no-ci
```
