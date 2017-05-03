/**
 * This method decorator for Asynchronous methods allow multiple calls to the same method without
 * executing the content function more than one time.
 * Each call after first, and until the Promise wasn't resolved succesfully, returns the previous instance of promise.
 * When the function resolves or rejects the Promise then clear the current instance
 */
export declare function PromiseOnce(target: any, pName: string, descriptor: PropertyDescriptor): void;
