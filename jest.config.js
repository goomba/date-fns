module.exports = {
	collectCoverageFrom: [
		"**/*.(ts|tsx)",
		"!src/index.ts",
		"!**/__fixtures__/**",
	],
	globals: {
		"ts-jest": {
			tsConfig: "tsconfig.cjs.json",
			compiler: "typescript",
		},
	},
	roots: ["<rootDir>/src"],
	setupFilesAfterEnv: ["./jest.setup.js"],
	testMatch: ["**/*.test.(ts|tsx)"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
};
