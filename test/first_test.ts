import { PromiseOnce } from "../dist/promise-tools";

class ClassWithPromise {
	public CallCounter = 0;

	@PromiseOnce
	MetodoPromise(): Promise<boolean> {
		this.CallCounter++;
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(true);
			}, 5000);
		});
	}

}

describe("Hello World Server", () => {
    var a: boolean;
    it("and so is a spec", () => {
        a = true;
        expect(a).toBe(true);
    });
});