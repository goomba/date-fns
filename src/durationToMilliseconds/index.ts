import { durationConfig } from "../durationConfig";
import { DurationWithIndex } from "../types";

export function durationToMilliseconds(duration: DurationWithIndex): number {
	return Object.keys(durationConfig).reduce(
		(milliseconds, durationConfigProperty) => {
			const { key, ms } = durationConfig[durationConfigProperty];
			return milliseconds + duration[key] * ms;
		},
		0
	);
}
