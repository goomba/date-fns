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

```
const formattedDuration = formatDuration(duration, "h 'hours,' m 'minutes,' s 'seconds'");
```

Much like `date-fns/format` allows convenient formatting of a Date, `formatDuration` allows the same for Durations. Any format is supported because **you** define it!

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

**Note:** Just like `date-fns/format`, repeating a token will add a leading zero (only) when applicable.

```
h => 7
hh => 07

m => 26
mm => 26
```
