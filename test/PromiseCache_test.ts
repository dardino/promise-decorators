import { PromiseCache } from "../dist/promise-decorators";

let values: Array<Array<boolean>> = [
    [true, true, true],
    [false, false, false],
    [true, false, true],
];

class ClassCache {
    // constructor() {
    //    this.GetItems1Counter = 0;
    // }

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

describe("PromiseCache Tests", () => {
    it("Test PromiseCache standard", async (done) => {
        let cc: ClassCache = new ClassCache();
        await cc.GetItems1(0);
        expect(cc.GetItems1Counter).toEqual(1);
        await cc.GetItems1(0);
        expect(cc.GetItems1Counter).toEqual(1);
        await cc.GetItems1(1);
        expect(cc.GetItems1Counter).toEqual(2);
        done();
    });

    it("Test PromiseCache static", async (done) => {
        let cc: ClassCache = new ClassCache();
        let a1: Array<boolean> = await ClassCache.GetItems2(0);
        expect(ClassCache.GetItems2Counter).toEqual(1);
        let a2: Array<boolean> = await ClassCache.GetItems2(1);
        expect(ClassCache.GetItems2Counter).toEqual(2);
        let a3: Array<boolean> = await ClassCache.GetItems2(1);
        expect(ClassCache.GetItems2Counter).toEqual(2);
        done();
    });

    it("Test PromiseCache shared", async (done) => {
        let cc: ClassCache = new ClassCache();
        let a1: Array<boolean> = await ClassCache.GetItemsSharedStatic(0);
        expect(ClassCache.SharedCount).toEqual(1);
        let a2: Array<boolean> = await ClassCache.GetItemsSharedStatic(1);
        expect(ClassCache.SharedCount).toEqual(1);
        let a3: Array<boolean> = await ClassCache.GetItemsSharedStatic(2);
        expect(ClassCache.SharedCount).toEqual(1);
        let s1: Array<boolean> = await cc.GetItemsShared(0);
        expect(ClassCache.SharedCount).toEqual(1);
        let s2: Array<boolean> = await cc.GetItemsShared(1);
        expect(ClassCache.SharedCount).toEqual(1);
        let s3: Array<boolean> = await cc.GetItemsShared(2);
        expect(ClassCache.SharedCount).toEqual(1);
        done();
    });
});
