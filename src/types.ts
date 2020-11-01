import { Duration } from "date-fns";

export type DurationWithIndex = Duration & { [key: string]: number };
