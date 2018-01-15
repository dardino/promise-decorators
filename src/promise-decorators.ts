/**
 * This method decorator for Asynchronous methods allow multiple calls to the same method without
 * executing the content function more than one time. 
 * Each call after first, and until the Promise wasn't resolved succesfully, returns the previous instance of promise.
 * When the function resolves or rejects the Promise then clear the current instance
 */
export function PromiseOnce(target: any, pName: PropertyKey, descriptor: PropertyDescriptor): void {
	let pNamePromise: string = `_(${pName})Promise`;
	if (descriptor == null) {
		let d = Object.getOwnPropertyDescriptor(target, pName);
		if (d == null) return;
		else descriptor = d;
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

function serializeKeys(obj: any, methodName: PropertyKey, args: any[]): string {
	try {
		return `${methodName}_${JSON.stringify(args)}`;
	} catch (err) {
		throw new Error("Unable to serialize arguments");
	}
}

type ICacheRepoItem = {
	value: any | undefined,
	promise: Promise<any> | undefined
};
type ICacheObj = {
	$$cache: ICacheRepo
};
type ICacheRepo = {
	[key: string]: ICacheRepoItem;
};
type IObjectWithCache = ICacheObj | Function;

function promiseCache(cacheKey: string | null = null): MethodDecorator {
	return (target: any, propertyKey: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor => {
		let methodName: PropertyKey = propertyKey;
		let pdesc: PropertyDescriptor = descriptor || Object.getOwnPropertyDescriptor(target, propertyKey);
		let old_method: Function = pdesc.value;
		pdesc.value = async function (...args: any[]): Promise<any> {
			let _self: IObjectWithCache = this as any;
			if (typeof _self === "function") {
				_self = _self.prototype as ICacheObj;
			} else {
				_self = _self.constructor.prototype as ICacheObj;
			}
			let key: string = cacheKey !== null ? cacheKey : serializeKeys(_self, methodName, args);
			if (_self.$$cache === undefined) { _self.$$cache = {}; }
			let cacheRepos: ICacheRepo = _self.$$cache;
			// se non ho un repositori per la cache nell'oggetto allora lo creo
			if (cacheRepos[key] === undefined || (cacheRepos[key].value === undefined && cacheRepos[key].promise === undefined)) {
				cacheRepos[key] = {
					value: undefined,
					promise: undefined
				};
				cacheRepos[key].promise = old_method.apply(this, args);
				if (!(cacheRepos[key].promise instanceof Promise)) {
					throw new Error("PromiseCache decorator can only be used in async methods (methods that returns Promise)");
				}
			}
			// ora lo recupero per usarlo
			let cacheRepo: ICacheRepoItem = cacheRepos[key];
			if (cacheRepo.value === undefined) { // è ancora in pending una richiesta quindi mi aggancio a quella.
				cacheRepo.value = await cacheRepo.promise;
				return cacheRepo.value;
			} else {
				return cacheRepo.value;
			}
		};
		return pdesc;
	};
}

/**
 * This Method enables a simple cache for a Promise method.
 * NOTE: all parameters must be serializable by JSON.stringify
 * because the cache depends by calling parameters
 */
export function PromiseCache(): MethodDecorator;
export function PromiseCache(key: string): MethodDecorator;
export function PromiseCache<T>(target: T, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;

export function PromiseCache(p1: string | null | any = null, propertyKey?: string, descriptor?: PropertyDescriptor)
: MethodDecorator | PropertyDescriptor {
	if (p1 === null || typeof p1 === "string") {
		return promiseCache(p1);
	} else {
		return promiseCache()(p1, propertyKey as string, descriptor as PropertyDescriptor) as PropertyDescriptor;
	}
}

