import { intervalToDuration } from "date-fns";
import { formatDuration } from "./formatDuration";
import { Duration } from "./types";

type GetTimestampProps = {
	date: string;
	baseDate: string;
	format: string;
};

export function getTimestamp({
	date,
	baseDate,
	format,
}: GetTimestampProps): null | string {
	const start = new Date(date);
	const end = new Date(baseDate);
	const duration = intervalToDuration({ start, end });
	return formatDuration(duration as Duration, format);
}
