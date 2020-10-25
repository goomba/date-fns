import { intervalToDuration } from "date-fns";
// import { es } from "date-fns/locale";

type SupportedTokens = "y" | "M" | "w" | "d" | "h" | "m" | "s";

enum MS_IN {
	MILLISECOND = 1,
	SECOND = MS_IN.MILLISECOND * 1000,
	MINUTE = MS_IN.SECOND * 60,
	HOUR = MS_IN.MINUTE * 60,
	DAY = MS_IN.HOUR * 24,
	WEEK = MS_IN.DAY * 7,
	MONTH = MS_IN.WEEK * 4,
	YEAR = MONTH * 12,
}

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
}: GetTimestampProps): null | string {
	const start = new Date(date);
	const end = new Date(baseDate);
	const duration = intervalToDuration({ start, end });
	return formatDuration(duration as DurationType, format);
}

type DurationConfig = {
	[index: string]: {
		converter: Converter;
		key: string;
		ms: number;
		order: number;
	};
};

const durationConfig: DurationConfig = {
	y: {
		converter: makeConverter("y"),
		key: "years",
		ms: MS_IN.YEAR,
		order: 0,
	},
	M: {
		converter: makeConverter("M"),
		key: "months",
		ms: MS_IN.MONTH,
		order: 1,
	},
	d: {
		converter: makeConverter("d"),
		key: "days",
		ms: MS_IN.DAY,
		order: 2,
	},
	h: {
		converter: makeConverter("h"),
		key: "hours",
		ms: MS_IN.HOUR,
		order: 3,
	},
	m: {
		converter: makeConverter("m"),
		key: "minutes",
		ms: MS_IN.MINUTE,
		order: 4,
	},
	s: {
		converter: makeConverter("s"),
		key: "seconds",
		ms: MS_IN.SECOND,
		order: 5,
	},
};

type DurationQuantityMap = {
	[key: string]: number | undefined;
	y?: number;
	M?: number;
	w?: number;
	d?: number;
	h?: number;
	m?: number;
	s?: number;
	milliseconds: number;
};

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

export function formatDuration(
	duration: DurationType,
	format: string
): null | string {
	const milliseconds = durationToMilliseconds(duration);
	const tokenMatches = format.match(durationTokensRegExp);

	if (!tokenMatches) {
		console.error("NO TOKEN MATCHES");
		return null;
	}

	/**
	 * 1. Filter down to _just_ the duration tokens
	 * 2. Order them from largest to smallest (e.g., hours > minutes > seconds)
	 * 3. Reduce to durationQuantityMap
	 *   - For the ordered tokens, use the total ms from durationToMilliseconds
	 *     and dynamically calculate duration of each part "present" in the format
	 */
	const durationQuantityMap = tokenMatches
		.filter((substring) => durationConfig[substring[0]])
		.sort((a, b) => durationConfig[a[0]].order - durationConfig[b[0]].order)
		.reduce(
			(quantityMap: DurationQuantityMap, substring: string) => ({
				...quantityMap,
				...durationConfig[substring[0] as SupportedTokens].converter(
					quantityMap.milliseconds
				),
			}),
			{ milliseconds }
		);

	/**
	 * This block is copies most of the `format` logic: https://github.com/date-fns/date-fns/blob/master/src/format/index.js#L412
	 * But replaces tokens with their appropriate duration.
	 */
	const result = tokenMatches
		.map((substring) => {
			// Replace two single quote characters with one single quote character
			if (substring === "''") {
				return "'";
			}
			const firstCharacter = substring[0];
			if (firstCharacter === "'") {
				return cleanEscapedString(substring);
			}

			const duration = durationQuantityMap[firstCharacter];
			if (typeof duration !== "undefined") {
				return addLeadingZeros(duration, substring.length);
			}

			if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
				throw new RangeError(
					"Format string contains an unescaped latin alphabet character `" +
						firstCharacter +
						"`"
				);
			}

			return substring;
		})
		.join("");
	return result;
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

const cleanEscapedString = (input: string) => {
	const escapedStringMatch = input.match(escapedStringRegExp);
	if (escapedStringMatch) {
		return escapedStringMatch[1].replace(doubleQuoteRegExp, "'");
	}
	return input;
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

type Converter = (ms: number) => DurationQuantityMap;

function makeConverter(token: SupportedTokens): Converter {
	return function (ms: number) {
		const { ms: msPerToken } = durationConfig[token];
		return {
			[token]: Math.floor(ms / msPerToken),
			milliseconds: ms % msPerToken,
		};
	};
}

function addLeadingZeros(number: number, targetLength: number): string {
	const sign = number < 0 ? "-" : "";
	let output = Math.abs(number).toString();

	while (output.length < targetLength) {
		output = `0${output}`;
	}

	return sign + output;
}
