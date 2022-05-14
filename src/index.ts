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
        private errorMessage?: string,
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
            this.subscriber.error(this.errorMessage);
        } else {
            this.subscriber.next(value);
        }
    }
}

class ThrowIfOperator<T> implements Operator<T, T> {
    constructor(
        private predicate: (value: T) => boolean,
        private errorMessage?: string,
    ) {
    }

    call(subscriber: Subscriber<T>, source: any): TeardownLogic {
        return source.subscribe(new ThrowIfSubscriber(
            subscriber,
            this.predicate,
            this.errorMessage,
        ));
    }
}

export function throwIf<T>(
    predicate: (value: T) => boolean,
    errorMessage?: string,
): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) =>
        source.lift(new ThrowIfOperator(predicate, errorMessage));
}
