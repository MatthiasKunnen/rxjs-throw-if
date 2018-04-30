import { MonoTypeOperatorFunction } from 'rxjs/interfaces';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { TeardownLogic } from 'rxjs/Subscription';

class ThrowIfSubscriber<T> extends Subscriber<T> {

    constructor(
        private myDestination: Subscriber<T>,
        private predicate: (value: T) => boolean,
        private errorMessage?: string,
    ) {
        super(myDestination);
    }

    protected _next(value: T) {
        let result: any;
        try {
            result = this.predicate(value);
        } catch (err) {
            this.myDestination.error(err);
            return;
        }

        if (result) {
            this.myDestination.error(this.errorMessage);
        } else {
            this.myDestination.next(value);
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
