# Concept2 Log Stats

## Why?
I set a goal for 2020 to row 2 million meters.  Concept2 has a fantastic process for capturing all rowing stats (and ski/bike/etc) but the rowing season goes starts at like the beginning of May, so all "seasonal" stats are geared toward that.

I wanted to know 2 this:
1. Where am I currently at for the year?
2. Where SHOULD I be at for the year?

## Env Vars
It's useful to just set these and forget about them
C2_USERNAME
C2_PASSWORD
GOAL_FROM_TIME - Time to analyze log data from
GOAL_TO_TIME - Time to analyze log data until
GOAL_DISTANCE - Your goal for distance during the supplied timeframe

## To get running
Install all dependencies
```
yarn
```

Pull latest data from your Concept2 Log Book (do this anytime you need to refresh the data).
This stores all of the CSV files in the data directory.
```
C2_USERNAME=yourUsername C2_PASSWORD=yourPassword yarn pull
```

Determine where you're at for the current calendar year by providing a goal (defaults to 1M) and date range
```
GOAL_FROM_TIME="2020-01-01 00:00:00" GOAL_TO_TIME="2021-01-01 00:00:00" GOAL_DISTANCE=2000000 yarn stats
```

## HTTP Server
All of this functionality can be run continuously from a HTTP server so it can be left running and checked on demand.

To start the HTTP server, provide all the necessary ENV vars listed above and run
```
yarn start
```
Server is accessed at http://localhost:8080 by default

`/` - Returns basic stats if data is already pulled
`/refresh` - pulls latest data from C2 and then displays stats

## Docker Support
Build the docker image
```
docker build . -t concept2-log-stats
```

Run the image
```
docker run -d -p 8080:8080 -e "C2_USERNAME=" -e "C2_PASSWORD=!" -e "GOAL_DISTANCE=2000000" concept2-log-stats
```