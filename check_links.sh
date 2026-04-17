#!/bin/bash
echo "=== Checking broken links in HTML files ==="
for file in *.html; do
  echo "File: $file"
  # Check for broken ../cdn/ajax references
  grep -o 'href="\.\./[^"]*"' "$file" | head -3
done

echo "=== Checking if CSS files exist ==="
test -f ../cdn.prod.website-files.com/6965d25065d78378ecfa1ac9/css/sentrixa-template.webflow.shared.51560f5c1.css && echo "✓ CSS file exists" || echo "✗ CSS file missing"

echo "=== Checking first few image references ==="
grep -h 'src="\.\./cdn' about 2>/dev/null | head -3
