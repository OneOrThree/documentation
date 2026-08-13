#!/bin/bash
# Verify a generated clone against the ORIGINAL crawled URLs.
#
# The trap this avoids: deriving the URL list from the generated file tree only
# checks the clone against itself, so a slug that no longer matches the source
# still scores 100%. crawl.json holds the paths as the source site publishes
# them, which is the list a real deep link would use.
#
#   ./verify-clone.sh <runDir> [baseUrl]
set -u

RUN="${1:?usage: verify-clone.sh <runDir> [baseUrl]}"
BASE="${2:-http://localhost:3000}"

PATHS=$(node -e "
  const c = require('$RUN/crawl.json');
  console.log(Object.keys(c.depthByPath || {}).join('\n'));
") || { echo "cannot read $RUN/crawl.json"; exit 1; }

TOTAL=0 OK=0
FAILED=""
while IFS= read -r p; do
  [ -z "$p" ] && continue
  TOTAL=$((TOTAL + 1))
  CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 30 --path-as-is "$BASE$p")
  if [ "$CODE" = "200" ]; then
    OK=$((OK + 1))
  else
    FAILED="$FAILED\n  $CODE  $p"
  fi
done <<< "$PATHS"

[ -n "$FAILED" ] && printf "실패:%b\n" "$FAILED"
echo "=== $OK/$TOTAL → 200 (원본 크롤 URL 기준) ==="
[ "$OK" = "$TOTAL" ]
