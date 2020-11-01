# date-fns 📅

This library builds on the fantastic [date-fns](https://github.com/date-fns/date-fns) and adds some enhanced features for formatting dates and durations.

## Getting Started

### Installation

```
npm install @goomba/date-fns
# or
yarn add @goomba/date-fns
```

### Usage

```
import { formatDuration } from '@goomba/date-fns'

formatDuration({ days: 3 }, "d 'days ago");
//=> "3 days ago"
```

## Functions

### formatDuration

As `date-fns/format` allows convenient formatting of a Date, `formatDuration` allows the same for Durations. Nearly any format is supported because **you** define it!

```
const formattedDuration = formatDuration(duration, "h 'hours,' m 'minutes,' s 'seconds'");
```

#### How does it work?

The underlying data this function operates on is a <a href="https://date-fns.org/v2.16.1/docs/Duration" target="_blank">date-fns Duration object</a>. Each property is mapped to a specific token that will be replaced in the given format string.

##### Tokens

| Property | Token |
| -------- | ----- |
| Years    | y     |
| Months   | M     |
| Days     | d     |
| Hours    | h     |
| Minutes  | m     |
| Seconds  | s     |

#### Leading Zeros

Just like `date-fns/format`, repeating a token will add a leading zero (only) when applicable.

```
h => 7
hh => 07

m => 26
mm => 26
```

#### Dynamic Calculation

Another sweet feature is the ability to format only a portion of a duration and let the function determine what the amount should be.

**Example**

```
const duration = {
	hours: 1,
	minutes: 30,
	seconds: 0
};

formatDuration(duration, "h 'hour,' m 'minutes,' s 'seconds'");
//=> "1 hour, 30 minutes, 0 seconds"

formatDuration(duration, "m 'minutes,' s 'seconds'");
//=> "90 minutes, 0 seconds"

formatDuration(duration, "s 'seconds'");
//=> "5400 seconds"
```

**Note**
At this time, the larger parts of unused Duration will be added to the _next_ largest token specified.

- Smaller parts are left out. In other words, similar to rounding down. Open an issue if you are interested in this feature.
- Currently dynamic calculation can not be disabled. Open an issue if you are interested in this feature.

#### Syntax

```
formatDuration(duration, format);
```

#### Arguments

| Name     | Type     | Description            |
| -------- | -------- | ---------------------- |
| duration | Duration | the duration to format |
| format   | string   | the string of tokens   |

#### Returns

| Type   | Type                          |
| ------ | ----------------------------- |
| String | the formatted duration string |
