import { durationConfig } from "./durationConfig";
import { Duration } from "./types";

export function durationToMilliseconds(duration: Duration): number {
	return Object.keys(durationConfig).reduce(
		(milliseconds, durationConfigProperty) => {
			const { key, ms } = durationConfig[durationConfigProperty];
			return milliseconds + duration[key] * ms;
		},
		0
	);
}
