import { PromiseOnce } from "../dist/promise-tools";

class ClassWithPromise {
	public CallCounter = 0;
	public NotOnceCounter = 0;

	@PromiseOnce
	async WithPromiseOnce(): Promise<boolean> {
		this.CallCounter++;
		return true;
	}

	async NotOnce(): Promise<boolean> {
		this.NotOnceCounter++;
		return false;
	}
}

describe("PromiseOnce", () => {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;

	let cp: ClassWithPromise = new ClassWithPromise();
	let p1: Promise<boolean> = cp.NotOnce();
	let p2: Promise<boolean> = cp.NotOnce();
	let p3: Promise<boolean> = cp.NotOnce();
	let p4: Promise<boolean> = cp.NotOnce();
	it("NotOnce all promises resolved", (done) => {
		Promise.all([p1, p2, p3, p4]).then(list => {
			expect(list.length).toBe(4);
			expect(list.every(f => f === false)).toBe(true);
			done();
		});
	});

	it("NotOnce counter test", () => {
		let x: number = cp.NotOnceCounter;
		expect(x).toBe(4);
	});

	let pp1: Promise<boolean> = cp.WithPromiseOnce();
	let pp2: Promise<boolean> = cp.WithPromiseOnce();
	let pp3: Promise<boolean> = cp.WithPromiseOnce();
	let pp4: Promise<boolean> = cp.WithPromiseOnce();

	it("WithPromiseOnce all promises resolved", (done) => {
		Promise.all([pp1, pp2, pp3, pp4]).then(list => {
			expect(list.length).toBe(4);
			expect(list.every(f => f === true)).toBe(true);
			cp.WithPromiseOnce();
			let x: number = cp.CallCounter;
			expect(x).toBe(2);
			done();
		});
	});

	it("WithPromiseOnce counter test", () => {
		let x: number = cp.CallCounter;
		expect(x).toBe(2);
	});

});

