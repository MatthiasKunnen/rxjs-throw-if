import {OperatorFunction, pipe} from 'rxjs'
import {map} from 'rxjs/operators'

export function throwIf<T>(
    predicate: (value: T) => boolean,
    error?: (valueCausingError: T) => any,
): OperatorFunction<T, T>;
export function throwIf<T>(
    predicate: (value: T) => boolean,
    error?: any,
): OperatorFunction<T, T>;
export function throwIf<T>(
    predicate: (value: T) => boolean,
    errorOrFn?: any,
): OperatorFunction<T, T> {
    return pipe(
        map<T, T>(value => {
            const predicateMet = predicate(value);

            if (predicateMet) {
                throw typeof errorOrFn === 'function'
                    ? errorOrFn(value)
                    : errorOrFn
            } else {
                return value;
            }
        })
    )
}
