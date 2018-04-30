[![npm version](https://img.shields.io/npm/v/rxjs-throw-if.svg?style=for-the-badge)](https://www.npmjs.com/package/rxjs-throw-if)

# ThrowIf
RxJS operator which throws an error if the given predicate is met.

Example usage
```TypeScript
import { throwIf } from 'rxjs-throw-if';
import { interval } from 'rxjs/observable/interval';

 interval(1000).pipe(
    throwIf(v => v === 5),
).subscribe(console.log, console.error);
// Prints: 0, 1, 2, 3, 4 and then errors
```

throwIf optionally takes an error message as the second argument.
