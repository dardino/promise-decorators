# promise-decorators
This library contains a set of useful ES6 Promise Decorators


## installation

```bash
npm install --save promise-decorators
```

## available decorators

### PromiseOnce
This method decorator for Asynchronous methods allow multiple calls to the same method without
executing the content function more than one time.

Each call after the first, and until the Promise wasn't resolved succesfully, returns the previous instance of promise.

When the Promise resolves or rejects then clear the instance.

#### Example
```typescript
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

