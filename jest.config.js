module.exports = {
	collectCoverageFrom: ["src/**/*.ts", "!src/index.ts"],
	globals: {
		"ts-jest": {
			compiler: "typescript",
			tsconfig: "tsconfig.cjs.json",
		},
	},
	setupFilesAfterEnv: ["./jest.setup.js"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
};
