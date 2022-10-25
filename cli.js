#! /usr/bin/env node

// load dependencies
import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

// Format and use input from args
  const args = minimist(process.argv.slice(2));

  // set up latitude, longitude, and timezone
  let latitude = args.n || args.s * -1;
  let longitude = args.e || args.w * -1;

  let timezone = args.z;
  if (timezone == null) {
    const timezone = moment.tz.guess();
  }

  // request and receive info from Open-Mateo based on input from args
  const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);
  const data = await response.json();

// Handle all possible switches

  // -j should echo the JSON that your app ingested and exit 0
  if(args.j) {
    console.log(data);
    process.exit(0);
  }

  // -d handles days argument
  const days = args.d
  if (days == 0) {
    console.log("today.")
  } else if (days > 1) {
    console.log("in " + days + " days.")
  } else {
    console.log("tomorrow.")
  }

  // -h command line asked for help
  if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE

        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.`)
      }

// Leave when we're done
process.exit(0);
