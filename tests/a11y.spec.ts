import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

test.use({ trace: "off" });

const pages = [
	["home page", "/"],
	["about page", "/about"],
	["login page", "/login"],
] as const;

const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function gotoStablePage(page: Page, path: string) {
	await page.goto(path, { waitUntil: "load" });

	await expect.poll(() => new URL(page.url()).pathname).toBe(path);

	await expect(page.locator("body")).toBeVisible();
}

function isNavigationDuringAxeError(error: unknown) {
	return (
		error instanceof Error &&
		/Execution context was destroyed|navigation/i.test(error.message)
	);
}

async function analyzeA11y(page: Page) {
	await page.waitForLoadState("load");
	await expect(page.locator("body")).toBeVisible();

	try {
		return await new AxeBuilder({ page }).withTags(axeTags).analyze();
	} catch (error) {
		if (!isNavigationDuringAxeError(error)) {
			throw error;
		}

		await page.waitForLoadState("load");
		await expect(page.locator("body")).toBeVisible();

		return await new AxeBuilder({ page }).withTags(axeTags).analyze();
	}
}

async function expectNoA11yViolations(page: Page) {
	const { violations } = await analyzeA11y(page);

	expect(violations).toEqual([]);
}

async function checkMobileMenuA11y(page: Page) {
	const button = page.getByRole("button", { name: "Toggle navigation" });

	if (!(await button.isVisible())) return;

	await button.click();

	await expect(
		page.getByRole("navigation", { name: "Mobile navigation" }),
	).toBeVisible();

	await expectNoA11yViolations(page);
}

test.describe("accessibility", () => {
	for (const [name, path] of pages) {
		test(`${name} has no detectable axe violations`, async ({ page }) => {
			await gotoStablePage(page, path);

			await test.step("initial page", () => expectNoA11yViolations(page));
			await test.step("mobile menu", () => checkMobileMenuA11y(page));
		});
	}
});
