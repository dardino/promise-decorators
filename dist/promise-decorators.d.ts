/**
 * This method decorator for Asynchronous methods allow multiple calls to the same method without
 * executing the content function more than one time.
 * Each call after first, and until the Promise wasn't resolved succesfully, returns the previous instance of promise.
 * When the function resolves or rejects the Promise then clear the current instance
 */
export declare function PromiseOnce(target: any, pName: PropertyKey, descriptor: PropertyDescriptor): void;
/**
 * This Method enables a simple cache for a Promise method.
 * NOTE: all parameters must be serializable by JSON.stringify
 * because the cache depends by calling parameters
 */
export declare function PromiseCache(): MethodDecorator;
export declare function PromiseCache(key: string): MethodDecorator;
export declare function PromiseCache<T>(target: T, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
