import { intervalToDuration } from "date-fns";
import { DurationWithIndex } from "../types";
import { formatDuration } from ".";

describe("formatDuration", () => {
	describe("seconds", () => {
		test("`s` should be replaced in the format with the amount of seconds", () => {
			const date = "2020-07-26T00:00:00Z";
			const baseDate = "2020-07-26T00:00:26Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(formatDuration(duration as DurationWithIndex, "s 'seconds'")).toBe(
				"26 seconds"
			);
			expect(
				formatDuration(duration as DurationWithIndex, "s 'seconds ago'")
			).toBe("26 seconds ago");
			expect(
				formatDuration(
					duration as DurationWithIndex,
					"m 'minutes,' s 'seconds ago'"
				)
			).toBe("0 minutes, 26 seconds ago");
		});
	});

	describe("minutes", () => {
		test("`m` should be replaced in the format with the amount of minutes", () => {
			const date = "2020-07-26T00:00:00Z";
			const baseDate = "2020-07-26T00:07:26Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(formatDuration(duration as DurationWithIndex, "m 'minutes'")).toBe(
				"7 minutes"
			);
			expect(formatDuration(duration as DurationWithIndex, "m 'min ago'")).toBe(
				"7 min ago"
			);
			expect(
				formatDuration(
					duration as DurationWithIndex,
					"m 'minutes,' s 'seconds ago'"
				)
			).toBe("7 minutes, 26 seconds ago");
		});
	});

	describe("hours", () => {
		test("`h` should be replaced in the format with the amount of hours", () => {
			const date = "2020-07-26T00:00:00Z";
			const baseDate = "2020-07-26T01:07:26Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(formatDuration(duration as DurationWithIndex, "h 'hour'")).toBe(
				"1 hour"
			);
			expect(formatDuration(duration as DurationWithIndex, "h 'hr ago'")).toBe(
				"1 hr ago"
			);
			expect(
				formatDuration(
					duration as DurationWithIndex,
					"h 'hour(s)' m 'minutes' s 'seconds'"
				)
			).toBe("1 hour(s) 7 minutes 26 seconds");
		});
	});

	describe("days", () => {
		test("`d` should be replaced in the format with the amount of days", () => {
			const date = "2020-07-26T00:00:00Z";
			const baseDate = "2020-07-29T13:33:02Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(formatDuration(duration as DurationWithIndex, "d 'days'")).toBe(
				"3 days"
			);
			expect(
				formatDuration(duration as DurationWithIndex, "d 'days ago'")
			).toBe("3 days ago");
			expect(
				formatDuration(
					duration as DurationWithIndex,
					"d 'days' h 'hour(s)' m 'minutes' ss 'seconds'"
				)
			).toBe("3 days 13 hour(s) 33 minutes 02 seconds");
		});
	});

	describe("months", () => {
		test("`M` should be replaced in the format with the amount of months", () => {
			const date = "2020-07-26T00:00:00Z";
			const baseDate = "2020-12-16T09:45:55Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(formatDuration(duration as DurationWithIndex, "M 'months'")).toBe(
				"4 months"
			);
			expect(
				formatDuration(duration as DurationWithIndex, "M 'months ago'")
			).toBe("4 months ago");
			expect(
				formatDuration(
					duration as DurationWithIndex,
					"M 'months' d 'days' h 'hour(s)' m 'minutes' s 'seconds'"
				)
			).toBe("4 months 20 days 8 hour(s) 45 minutes 55 seconds");
		});
	});

	describe("years", () => {
		test("`y` should be replaced in the format with the amount of years", () => {
			const date = "2001-07-26T00:00:00Z";
			const baseDate = "2020-12-16T09:45:55Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(formatDuration(duration as DurationWithIndex, "y 'years'")).toBe(
				"19 years"
			);
			expect(
				formatDuration(duration as DurationWithIndex, "y 'years ago'")
			).toBe("19 years ago");
			expect(
				formatDuration(
					duration as DurationWithIndex,
					"y 'years' M 'months' d 'days' h 'hour(s)' m 'minutes' s 'seconds'"
				)
			).toBe("19 years 4 months 20 days 8 hour(s) 45 minutes 55 seconds");
		});
	});

	// Features applying to all tokens
	describe("leading zeros", () => {
		test("repeating the same token (e.g., `mmm` or `ss`) will add leading zeros when the number of tokens exceeds the number of digits in the duration amount", () => {
			const date = "2020-07-26T00:00:00Z";
			const baseDate = "2020-07-26T06:05:03Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(
				formatDuration(
					duration as DurationWithIndex,
					"hh 'hours' mmm 'minutes' ss 'seconds'"
				)
			).toBe("06 hours 005 minutes 03 seconds");
		});

		test("repeating the same token will not add leading zeros when the number of digits in the duration amount is equal or greater than the number of tokens ", () => {
			const date = "2020-07-26T00:00:00Z";
			const baseDate = "2020-07-26T14:20:11Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(
				formatDuration(
					duration as DurationWithIndex,
					"hh 'hours' mm 'minutes' ss 'seconds'"
				)
			).toBe("14 hours 20 minutes 11 seconds");
		});
	});

	describe("dynamic calculation", () => {
		test("the duration amounts will be calculated based on the tokens used - more minutes because hours not used", () => {
			const date = "2020-07-26T00:00:00Z";
			const baseDate = "2020-07-26T01:30:00Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(formatDuration(duration as DurationWithIndex, "m 'minutes'")).toBe(
				"90 minutes"
			);
		});

		test("the duration amounts will be calculated based on the tokens used - same duration split between hours and minutes", () => {
			const date = "2020-07-26T00:00:00Z";
			const baseDate = "2020-07-26T01:30:00Z";
			const options = {
				start: new Date(date),
				end: new Date(baseDate),
			};
			const duration = intervalToDuration(options);
			expect(
				formatDuration(duration as DurationWithIndex, "h 'hour' m 'minutes'")
			).toBe("1 hour 30 minutes");
		});
	});

	describe("invalid usage", () => {
		test("no parameters throws error", () => {
			// @ts-expect-error no parameters
			expect(() => formatDuration()).toThrowError(
				new TypeError("Parameter `duration` is required.")
			);
		});

		test("no format parameter throws error", () => {
			// @ts-expect-error no format parameter
			expect(() => formatDuration({ hours: 3 })).toThrowError(
				new TypeError("Parameter `format` is required.")
			);
		});

		test("malformed format throws error", () => {
			expect(() => formatDuration({ minutes: 10 }, "h hours")).toThrowError(
				new RangeError(
					"Format string contains an unescaped latin alphabet character `o`."
				)
			);
		});
	});
});
