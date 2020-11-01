import { addLeadingZeros } from "../addLeadingZeros";
import { durationConfig, SupportedTokens } from "../durationConfig";
import { durationToMilliseconds } from "../durationToMilliseconds";
import { DurationWithIndex } from "../types";

export type DurationQuantityMap = {
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
	duration: DurationWithIndex,
	format: string
): null | string {
	/**
	 * Probably replace with implementation similar to date-fns.
	 * `requiredArgs`
	 */
	// This should also check if duration is valid, if we can
	if (!duration) {
		throw new TypeError("Parameter `duration` is required.");
	}

	if (!format) {
		throw new TypeError("Parameter `format` is required.");
	}

	const milliseconds = durationToMilliseconds(duration);
	const tokenMatches = format.match(durationTokensRegExp);

	if (!tokenMatches) {
		console.warn("No token matches found.");
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
					`Format string contains an unescaped latin alphabet character \`${firstCharacter}\`.`
				);
			}

			return substring;
		})
		.join("");
	return result;
}

function cleanEscapedString(input: string) {
	const escapedStringMatch = input.match(escapedStringRegExp);
	if (escapedStringMatch) {
		return escapedStringMatch[1].replace(doubleQuoteRegExp, "'");
	}
	return input;
}
