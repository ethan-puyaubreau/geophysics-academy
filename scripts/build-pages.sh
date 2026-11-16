#!/usr/bin/env bash
# Build a standalone site in _site/ for GitHub Pages.
# index.html is authored as a page body (title, styles, markup, scripts), so
# wrap it in a full HTML document: everything before the first <header> goes
# into <head>, the rest into <body>.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf _site && mkdir -p _site
cp -r app.js content _site/
touch _site/.nojekyll
split=$(grep -n -m1 '^<header' index.html | cut -d: -f1)
{
  echo '<!doctype html>'
  echo '<html lang="en">'
  echo '<head>'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  head -n $((split - 1)) index.html
  echo '</head>'
  echo '<body>'
  tail -n +"$split" index.html
  echo '</body>'
  echo '</html>'
} > _site/index.html
echo "Built _site/ ($(find _site -type f | wc -l) files)"
