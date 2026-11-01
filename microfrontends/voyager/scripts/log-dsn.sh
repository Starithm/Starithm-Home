#!/bin/bash
# Logs what NASA's DSN Now feed says about Voyager 1 (VGR1), one row per run, so we can read its
# real downlink rate off a live pass. Plain bash + curl so cron can run it with no PATH setup.
#   columns: checked_utc  status  station  dish  down_active  data_rate_bps  power_dbm  band
# status: tracking (a dish has a VGR1 signal) | none | error
set -u
LOG="${VOYAGER_DSN_LOG:-$HOME/Documents/Starithm/reports/voyager-dsn-log.tsv}"
now=$(/bin/date -u +%Y-%m-%dT%H:%M:%SZ)
[ -f "$LOG" ] || printf 'checked_utc\tstatus\tstation\tdish\tdown_active\tdata_rate_bps\tpower_dbm\tband\n' > "$LOG"

# DSN_XML_FILE reads a saved feed instead of fetching (for testing the parser)
if [ -n "${DSN_XML_FILE:-}" ]; then
  xml=$(/bin/cat "$DSN_XML_FILE")
else
  xml=$(/usr/bin/curl -fsS --max-time 20 "https://eyes.nasa.gov/dsn/data/dsn.xml?r=$(/bin/date +%s)") || {
    printf '%s\terror\t\t\t\t\t\t\n' "$now" >> "$LOG"; exit 0; }
fi

rows=$(printf '%s\n' "$xml" | /usr/bin/awk -v now="$now" '
  function attr(line, name,   m) {
    if (match(line, name "=\"[^\"]*\"")) { m = substr(line, RSTART, RLENGTH); sub(/^[^"]*"/, "", m); sub(/"$/, "", m); return m }
    return ""
  }
  /<station / { station = attr($0, "friendlyName") }
  /<dish /    { dish = attr($0, "name") }
  /<downSignal / && /spacecraft="VGR1"/ {
    printf "%s\ttracking\t%s\t%s\t%s\t%s\t%s\t%s\n", now, station, dish, attr($0, "active"), attr($0, "dataRate"), attr($0, "power"), attr($0, "band")
  }')

if [ -n "$rows" ]; then printf '%s\n' "$rows" >> "$LOG"; else printf '%s\tnone\t\t\t\t\t\t\n' "$now" >> "$LOG"; fi
