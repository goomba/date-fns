import { intervalToDuration } from "date-fns";
import { formatDuration } from "../formatDuration";
import { Duration } from "../types";

type FormatProps = {
	date: string;
	baseDate: string;
	format: string;
};

// consider 2 args and options object
export function format({ date, baseDate, format }: FormatProps): null | string {
	const start = new Date(date);
	const end = new Date(baseDate);
	const duration = intervalToDuration({ start, end });
	return formatDuration(duration as Duration, format);
}
