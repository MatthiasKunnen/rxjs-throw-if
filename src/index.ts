import {
    MonoTypeOperatorFunction,
    Observable,
    Operator,
    Subscriber,
    TeardownLogic
} from 'rxjs';

class ThrowIfSubscriber<T> extends Subscriber<T> {

    constructor(
        private subscriber: Subscriber<T>,
        private predicate: (value: T) => boolean,
        private errorToThrow?: any | ((valueCausingError: T) => any),
    ) {
        super(subscriber);
    }

    protected _next(value: T) {
        let result: any;
        try {
            result = this.predicate(value);
        } catch (err) {
            this.subscriber.error(err);
            return;
        }

        if (result) {
            const error = typeof this.errorToThrow === 'function'
                ? this.errorToThrow(value)
                : this.errorToThrow
            this.subscriber.error(error);
        } else {
            this.subscriber.next(value);
        }
    }
}

class ThrowIfOperator<T> implements Operator<T, T> {
    constructor(
        private predicate: (value: T) => boolean,
        private errorToThrow?: any,
    ) {
    }

    call(subscriber: Subscriber<T>, source: any): TeardownLogic {
        return source.subscribe(new ThrowIfSubscriber(
            subscriber,
            this.predicate,
            this.errorToThrow,
        ));
    }
}

export function throwIf<T>(
    predicate: (value: T) => boolean,
    error?: (valueCausingError: T) => any,
): MonoTypeOperatorFunction<T>;
export function throwIf<T>(
    predicate: (value: T) => boolean,
    error?: any,
): MonoTypeOperatorFunction<T>;
export function throwIf<T>(
    predicate: (value: T) => boolean,
    error?: any,
): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) =>
        source.lift(new ThrowIfOperator(predicate, error));
}
