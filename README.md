# promise-decorators
This library contains a set of useful ES6 Promise Decorators


## installation

```bash
npm install --save promise-decorators
```

## available decorators

### @PromiseOnce
This method allows multiple concurrent calls to the same asynchronous method executing the content of the call only once.

Each call after the first, and until the Promise wasn't resolved, gets the previous instance of promise

When the Promise will be resolved or rejected then that will be removed and the next call gets a new instance of promise.

#### Signature
```typescript
@PromiseOnce /* this decorator doesn't have any parameters.*/
```

#### Example
```typescript
import { PromiseOnce } from "promise-decorators";

class MyClass {
    public CallCounter = 0;

    @PromiseOnce
    async MyPromiseMethod(): Promise<boolean> {
        this.CallCounter++;
        return true;
    }
}

var x = new MyClass(); // this.CallCounter === 0; // no calls
let p1 = x.MyPromiseMethod(); // x.CallCounter === 1 (first call)
let p2 = x.MyPromiseMethod(); // x.CallCounter === 1 (2nd call)
let p3 = x.MyPromiseMethod(); // x.CallCounter === 1 (3rd call)
let p4 = x.MyPromiseMethod(); // x.CallCounter === 1 (4th call)
Promise.all([p1,p2,p3,p4]).then(values => {
    // values is Array<boolean> 
    // values.length === 4;
    // values[i] === true; // i: from 0 to 3
});
```

### @PromiseCache
This Method enables a very simple cache for a Promise methods.

**NOTE:** all parameters must be serializable by `JSON.stringify`
because the cache depends by calling parameters

#### Signature
```typescript
// Without parameters:
@PromiseCache
async MyMethod(): Promise<boolean> { return true; }
// OR:
@PromiseCache()
async MyMethod(): Promise<boolean> { return true; }
// With "key" parameter:
@PromiseCache("myCacheKey")
async MyMethod(): Promise<boolean> { return true; }
```

#### Parameters
If no parameters are passed to the `PromiseCache` function then the decorator generates an internal key serializing all the parameters

If a `key` parameter is passed to the `PromiseCache` then the cache system uses this value to store the results and no other parameters will be used or serialized.

When using a custom `key` the cache is shared between each method in the same class (static or not) that uses that key.

#### Example
```typescript
import { PromiseCache } from "../dist/promise-decorators";

let values: Array<Array<boolean>> = [
    [true, true, true],
    [false, false, false],
    [true, false, true],
];

class ClassCache {
    public GetItems1Counter: number = 0;
    @PromiseCache
    GetItems1(index: number): Promise<Array<boolean>> {
        return new Promise<Array<boolean>>((resolve, reject) => {
            this.GetItems1Counter++;
            resolve(values[index]);
        });
    }
    public static GetItems2Counter: number = 0;
    @PromiseCache
    static async GetItems2(index: number): Promise<Array<boolean>> {
        ClassCache.GetItems2Counter++;
        return values[index];
    }
    public static SharedCount: number = 0;
    @PromiseCache("shared")
    static async GetItemsSharedStatic(index: number): Promise<Array<boolean>> {
        ClassCache.SharedCount++;
        return values[index];
    }
    @PromiseCache("shared")
    async GetItemsShared(index: number): Promise<Array<boolean>> {
        ClassCache.SharedCount++;
        return values[index];
    }
}

async function tests() {
    let cc: ClassCache = new ClassCache();
    await cc.GetItems1(0);
    // cc.GetItems1Counter == 1;
    await cc.GetItems1(0);
    // cc.GetItems1Counter == 1;
    await cc.GetItems1(1);
    // cc.GetItems1Counter == 2;
    await ClassCache.GetItems2(0);
    // cc.GetItems2Counter == 1;
    await ClassCache.GetItems2(1);
    // cc.GetItems2Counter == 2;
    await ClassCache.GetItems2(1);
    // cc.GetItems2Counter == 2;
    await ClassCache.GetItemsSharedStatic(0);
    // cc.SharedCount == 1;
    await ClassCache.GetItemsSharedStatic(1);
    // cc.SharedCount == 1;
    await ClassCache.GetItemsSharedStatic(2);
    // cc.SharedCount == 1;
    await cc.GetItemsShared(0);
    // cc.SharedCount == 1;
    await cc.GetItemsShared(1);
    // cc.SharedCount == 1;
    await cc.GetItemsShared(2);
    // cc.SharedCount == 1;
}

```
