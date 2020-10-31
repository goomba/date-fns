import { DurationQuantityMap } from "./formatDuration";

export type SupportedTokens = "y" | "M" | "w" | "d" | "h" | "m" | "s";

type DurationConfig = {
	[index: string]: {
		converter: Converter;
		key: string;
		ms: number;
		order: number;
	};
};

/**
 * TODO: currently these are inaccessible to users because this file is not exposed.
 * Well, they could probably import the file itself but that is lame.
 */
export const MILLISECOND = 1;
export const SECOND = MILLISECOND * 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = WEEK * 4;
export const YEAR = MONTH * 12;

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

export const durationConfig: DurationConfig = {
	y: {
		converter: makeConverter("y"),
		key: "years",
		ms: YEAR,
		order: 0,
	},
	M: {
		converter: makeConverter("M"),
		key: "months",
		ms: MONTH,
		order: 1,
	},
	d: {
		converter: makeConverter("d"),
		key: "days",
		ms: DAY,
		order: 2,
	},
	h: {
		converter: makeConverter("h"),
		key: "hours",
		ms: HOUR,
		order: 3,
	},
	m: {
		converter: makeConverter("m"),
		key: "minutes",
		ms: MINUTE,
		order: 4,
	},
	s: {
		converter: makeConverter("s"),
		key: "seconds",
		ms: SECOND,
		order: 5,
	},
};
