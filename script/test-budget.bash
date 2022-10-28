#!/usr/bin/env bash

set -euo pipefail

# Rough budgets.
# It's safe to raise these limits, this is just here so we don't get too large by accident!
SOURCE_LINE_COUNT=$(cat src/* | wc -l)
SOURCE_LINE_COUNT_LIMIT=200
if [ "${SOURCE_LINE_COUNT}" -lt ${SOURCE_LINE_COUNT_LIMIT} ]
then
  echo "✅ ${SOURCE_LINE_COUNT} lines of source code (less than ${SOURCE_LINE_COUNT_LIMIT})."
  true
else
  echo "❌ ${SOURCE_LINE_COUNT} lines of source code (not less than ${SOURCE_LINE_COUNT_LIMIT})!"
  false
fi
SOURCE_CHARACTER_COUNT=$(cat src/* | wc -c)
SOURCE_CHARACTER_COUNT_LIMIT=6000
if [ "${SOURCE_CHARACTER_COUNT}" -lt "${SOURCE_CHARACTER_COUNT_LIMIT}" ]
then
  echo "✅ ${SOURCE_CHARACTER_COUNT} characters of source code (less than ${SOURCE_CHARACTER_COUNT_LIMIT})."
  true
else
  echo "❌ ${SOURCE_CHARACTER_COUNT} characters of source code (not less than ${SOURCE_CHARACTER_COUNT_LIMIT})!"
  false
fi
