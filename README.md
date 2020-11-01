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
const formattedDuration = formatDuration(duration, "y 'years,' M 'months,' d 'days,' h 'hours,' m 'minutes,' s 'seconds'");
```
