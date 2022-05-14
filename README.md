[![npm version](https://img.shields.io/npm/v/rxjs-throw-if.svg?style=for-the-badge)](https://www.npmjs.com/package/rxjs-throw-if)

# ThrowIf
RxJS operator which throws an error if the given predicate is met.

**Example with simple error**
```TypeScript
import { throwIf } from 'rxjs-throw-if';
import { interval } from 'rxjs/observable/interval';

 interval(1000).pipe(
    throwIf(v => v === 5, 'Index should not exceed 4'),
).subscribe(console.log, console.error);
// Prints: 0, 1, 2, 3, 4 and then errors
```

**Example of error based on last value**
```TypeScript
 interval(1000).pipe(
    throwIf(v => v === 5, errorValue => `Index should not exceed 4, got ${errorValue}`),
).subscribe(console.log, console.error);
// Prints: 0, 1, 2, 3, 4 and then errors with 'Index should not exceed 4, got 5'
```

The second argument of `throwIf` is optional and allows you to pass any value which will be thrown when the predicate is met. If the argument is a function, that function will be executed with the value that caused the predicate to be met and its result will be thrown.

If the predicate function throws, that error will be rethrown.
