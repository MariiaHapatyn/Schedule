import { ScheduleFrontendPage } from "./app.po";

describe("schedule-frontend App", () => {
	let page: ScheduleFrontendPage;

	beforeEach(() => {
		page = new ScheduleFrontendPage();
	});

	it("should display message saying app works", () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual("app works!" as any);
	});
});
