import { PromiseOnce } from "../dist/promise-tools";

class ClassWithPromise {
	public CallCounter = 0;
	public CallCounter2 = 0;

	@PromiseOnce
	MetodoPromise(): Promise<boolean> {
		this.CallCounter++;
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(true);
			}, 5000);
		});
	}

	MetodoPromise2(): Promise<boolean> {
		this.CallCounter2++;
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(false);
			}, 5000);
		});
	}
}

describe("Test no PromiseOnce", () => {
    let cp: ClassWithPromise = new ClassWithPromise();
	let p1: Promise<boolean> = cp.MetodoPromise2();
	let p2: Promise<boolean> = cp.MetodoPromise2();
	let p3: Promise<boolean> = cp.MetodoPromise2();
	let p4: Promise<boolean> = cp.MetodoPromise2();
	let x: number = cp.CallCounter2;
	Promise.all([p1,p2,p3,p4]).then(list => {
		it("all promises resolved", () => {
			expect(list.length).toBe(4);
			expect(list.every(f => f === false)).toBe(true);
		});
	});
    it("PromiseOnce counter test", () => {
        expect(x).toBe(4);
    });

});
describe("Test PromiseOnce", () => {
    let cp: ClassWithPromise = new ClassWithPromise();
	let p1: Promise<boolean> = cp.MetodoPromise();
	let p2: Promise<boolean> = cp.MetodoPromise();
	let p3: Promise<boolean> = cp.MetodoPromise();
	let p4: Promise<boolean> = cp.MetodoPromise();
	let x: number = cp.CallCounter;
	Promise.all([p1,p2,p3,p4]).then(list => {
		it("all promises resolved", () => {
			expect(list.length).toBe(4);
			expect(list.every(f => f === true)).toBe(true);
		});
	});

    it("PromiseOnce counter test", () => {
        expect(x).toBe(1);
    });

});

