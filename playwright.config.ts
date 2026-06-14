import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	reporter: "list",
	timeout: 30_000,
	expect: {
		timeout: 5_000,
	},
	use: {
		baseURL: "http://127.0.0.1:3000",
		trace: "retain-on-failure",
	},
	webServer: {
		command: "./node_modules/.bin/vite dev --port 3000 --host 127.0.0.1",
		url: "http://127.0.0.1:3000",
		reuseExistingServer: true,
		timeout: 120_000,
	},
	projects: [
		{
			name: "desktop-chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "mobile-chromium",
			use: { ...devices["Pixel 5"] },
		},
	],
});
