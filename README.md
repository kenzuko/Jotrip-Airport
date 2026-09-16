# JoTrip Airport Live

Standalone public frontend for Phu Quoc International Airport (PQC) operations.

## Public domain

`https://airport.openphuquoc.com`

The repository includes a root `CNAME` file for `airport.openphuquoc.com`.

## Product rule

Open the page and understand the airport in about three seconds.

## Architecture

This repository contains the standalone Airport Live frontend only.

Primary live transport:

- JoTrip Airport Live Cloudflare Worker

Fallback / archive data remains in `kenzuko/Jotrip-Lab`:

- `data-sunairport/data/sunairport/latest.json`
- `data-sunairport/data/sunairport/health.json`
- daily raw/history snapshots used by History

This separation keeps Airport deployment independent from Weather and the other JoTrip Lab products while preserving the existing data engine.

## Main UI

- Live PQC overview
- Arrivals / Departures / All flights
- Accent-insensitive flight search
- Delay and estimated-time display when available
- Yesterday / Today / Tomorrow board
- Operations Watch
- Next Arrivals
- Analytics
- Historical lookup and OTP15 airline statistics
- Data Health and fallback state

## Deployment

Static site files are served from the repository root on the `main` branch.

Custom domain: `airport.openphuquoc.com`

DNS should use:

- Host: `airport`
- Type: `CNAME`
- Target: `kenzuko.github.io`

Do not use URL Redirect or URL Frame for the public Airport domain.
