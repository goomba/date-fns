import { getTimestamp } from "./src";

const date = "2020-10-20T04:10:00Z";
const baseDate = "2020-10-19T00:08:29Z";

const result = getTimestamp({
	date,
	baseDate,
	format: "dd 'days', s 'seconds,' h 'hours'",
});

console.log("📅 \u001b[" + 32 + "m" + `${result}` + "\u001b[0m"); // eslint-disable-line
