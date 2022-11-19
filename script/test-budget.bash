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

mkdir -p ./.temp
npx esbuild \
  --bundle --minify --format=esm --target=es2020 \
  --external:http --external:node* \
   --external:esbuild \
  --outdir=dist/size-test \
  src/index.js
MINIFIED_BYTE_COUNT=$(cat dist/size-test/index.js | wc -c)
MINIFIED_BYTE_COUNT_LIMIT=3000
if [ "${MINIFIED_BYTE_COUNT}" -lt "${MINIFIED_BYTE_COUNT_LIMIT}" ]
then
  echo "✅ ${MINIFIED_BYTE_COUNT} characters of minified source code (less than ${MINIFIED_BYTE_COUNT_LIMIT})."
  true
else
  echo "❌ ${MINIFIED_BYTE_COUNT} characters of minified source code (not less than ${MINIFIED_BYTE_COUNT_LIMIT})!"
  false
fi

rm -rf dist/size-test/index.js.gz
gzip dist/size-test/index.js
GZIPPED_BYTE_COUNT=$(cat dist/size-test/index.js.gz | wc -c)
GZIPPED_BYTE_COUNT_LIMIT=1500
if [ "${GZIPPED_BYTE_COUNT}" -lt "${GZIPPED_BYTE_COUNT_LIMIT}" ]
then
  echo "✅ ${GZIPPED_BYTE_COUNT} characters of gzipped source code (less than ${GZIPPED_BYTE_COUNT_LIMIT})."
  true
else
  echo "❌ ${GZIPPED_BYTE_COUNT} characters of gzipped source code (not less than ${GZIPPED_BYTE_COUNT_LIMIT})!"
  false
fi
