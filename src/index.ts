import { intervalToDuration } from "date-fns";

const MILLISECOND = 1;
const SECOND = MILLISECOND * 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = WEEK * 4;
const YEAR = MONTH * 12;

/**
 * This RegExp consists of three parts separated by `|`:
 * - [yMwdhms] matches any available duration token
 * - ([yMwdhms])\1* matches any sequences of the same letter
 * - '' matches two quote characters in a row
 * - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
 * 	except a single quote symbol, which ends the sequence.
 * 	Two quote characters do not end the sequence.
 * 	If there is no matching single quote
 * 	then the sequence will continue until the end of the string.
 * - . matches any single character unmatched by previous parts of the RegExps
 * Reference: https://github.com/date-fns/date-fns/blob/master/src/format/index.js#L16-L27
 */
const durationTokensRegExp = /([yMwdhms])\1*|''|'(''|[^'])+('|$)|./g;
const escapedStringRegExp = /^'([^]*?)'?$/;
const doubleQuoteRegExp = /''/g;
const unescapedLatinCharacterRegExp = /[a-zA-Z]/;

export function format(): string {
	return "hi";
}

type GetTimestampProps = {
	date: string;
	baseDate: string;
	format: string;
};

export function getTimestamp({
	date,
	baseDate,
	format,
}: GetTimestampProps): string {
	const start = new Date(date);
	const end = new Date(baseDate);
	const duration = intervalToDuration({ start, end });
	return formatDuration(duration as DurationType, format);
}

type DurationConfig = {
	[index: string]: {
		key: string;
		ms: number;
		order: number;
	};
};

const durationConfig: DurationConfig = {
	y: {
		// converter: makeConverter('y');
		key: "years",
		ms: YEAR,
		order: 0,
	},
	M: {
		key: "months",
		ms: MONTH,
		order: 1,
	},
	d: {
		key: "days",
		ms: DAY,
		order: 2,
	},
	h: {
		key: "hours",
		ms: HOUR,
		order: 3,
	},
	m: {
		key: "minutes",
		ms: MINUTE,
		order: 4,
	},
	s: {
		key: "seconds",
		ms: SECOND,
		order: 5,
	},
};

export function formatDuration(duration: DurationType, format: string): any {
	// eslint-disable-line
	console.log(duration);
	const milliseconds = durationToMilliseconds(duration);

	const tokenMatches = format.match(durationTokensRegExp);
	console.log(tokenMatches);

	if (!tokenMatches) {
		console.error("NO TOKEN MATCHES");
		return null;
	}

	const durationQuantityMap = tokenMatches
		.filter((substring) => durationConfig[substring[0]])
		.sort((a, b) => durationConfig[a[0]].order - durationConfig[b[0]].order);
	// .reduce(
	// 	(quantityMap, token) => {
	// 		return {
	// 			...quantityMap,
	// 			...durationConversionMap[token](quantityMap.milliseconds),
	// 		};
	// 	},
	// 	{ milliseconds }
	// );

	return durationQuantityMap;
}

type DurationType = {
	[index: string]: number;
	years: number;
	months: number;
	weeks: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

export function durationToMilliseconds(duration: DurationType): number {
	return Object.keys(durationConfig).reduce(
		(milliseconds, durationConfigProperty) => {
			const { key, ms } = durationConfig[durationConfigProperty];
			return milliseconds + duration[key] * ms;
		},
		0
	);
}
