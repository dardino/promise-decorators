/**
 * This method decorator for Asynchronous methods allow multiple calls to the same method without
 * executing the content function more than one time. 
 * Each call after first, and until the Promise wasn't resolved succesfully, returns the previous instance of promise.
 * When the function resolves or rejects the Promise then clear the current instance
 */

export function PromiseOnce(target: any, pName: string, descriptor: PropertyDescriptor): void {
	let pNamePromise: string = `_(${pName})Promise`;
	if (descriptor == null) {
		descriptor = Object.getOwnPropertyDescriptor(target, pName);
	}
	let old_fn: Function = descriptor.value as Function;
	descriptor.value = function (...args: any[]): Promise<any> | any {
        let self: any = this;
		if (self[pNamePromise] == null) {
			let retval: Promise<any> | any = old_fn.apply(self, args);
			if (retval instanceof Promise) {
				self[pNamePromise] = retval;
				self[pNamePromise].then(() => { self[pNamePromise] = null; }).catch(() => { self[pNamePromise] = null; });
			} else {
				return retval;
			}
		}
		return self[pNamePromise];
	};
}
