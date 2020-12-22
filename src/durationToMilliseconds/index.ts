import { durationConfig } from "../durationConfig";
import { DurationWithIndex } from "../types";

export function durationToMilliseconds(duration: DurationWithIndex): number {
	return Object.keys(durationConfig).reduce(
		(milliseconds, durationConfigProperty) => {
			const { key, ms } = durationConfig[durationConfigProperty];
			return duration[key] ? milliseconds + duration[key] * ms : milliseconds;
		},
		0
	);
}
