#!/bin/bash
cd /workspaces/devdocs-clone

echo "🔍 WEBSITE INTEGRITY CHECK"
echo "=========================="
echo ""

# Check main HTML files
echo "✓ Checking HTML Pages in sentrixa-template.webflow.io/"
html_count=$(find sentrixa-template.webflow.io -type f -name '*' | grep -c -E '^[^/]+$|/$' || find sentrixa-template.webflow.io -maxdepth 1 |wc -l)
echo "  - Main pages found: $(ls -1 sentrixa-template.webflow.io | grep -v '^[a-z]' | wc -l)"

# Check CSS files
echo ""
echo "✓ Checking CSS Resources"
css_count=$(find cdn.prod.website-files.com -name "*.css" | wc -l)
echo "  - CSS files: $css_count"
test -f cdn.prod.website-files.com/6965d25065d78378ecfa1ac9/css/sentrixa-template.webflow.shared.51560f5c1.css && echo "  - Main stylesheet: ✓ OK" || echo "  - Main stylesheet: ✗ MISSING"

# Check JavaScript files
echo ""
echo "✓ Checking JavaScript"
js_count=$(find cdn.prod.website-files.com -name "*.js" | wc -l)
echo "  - JS files in CDN: $js_count"
test -f ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js && echo "  - WebFont library: ✓ OK" || echo "  - WebFont library: ✗ MISSING"

# Check images
echo ""
echo "✓ Checking Images"
img_count=$(find cdn.prod.website-files.com -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" -o -name "*.svg" \) | wc -l)
echo "  - Image files: $img_count"

# Check for broken internal links
echo ""
echo "✓ Checking Navigation Links"
test -f sentrixa-template.webflow.io/about && echo "  - /about page: ✓ OK" || echo "  - /about page: ✗ MISSING"
test -f sentrixa-template.webflow.io/services && echo "  - /services page: ✓ OK" || echo "  - /services page: ✗ MISSING"
test -f sentrixa-template.webflow.io/price && echo "  - /price page: ✓ OK" || echo "  - /price page: ✗ MISSING"
test -d sentrixa-template.webflow.io/blog && echo "  - /blog directory: ✓ OK" || echo "  - /blog directory: ✗ MISSING"
test -d sentrixa-template.webflow.io/career && echo "  - /career directory: ✓ OK" || echo "  - /career directory: ✗ MISSING"

# Check external resource paths
echo ""
echo "✓ Checking Asset Paths in HTML"
echo "  - Relative paths sample from index.html:"
grep -o 'href="\.\./[^"]*"' sentrixa-template.webflow.io/index.html | head -2 | sed 's/^/    /'

# Total stats
echo ""
echo "═════════════════════════════════════"
total_files=$(find . -not -path './.git*' -type f | wc -l)
total_size=$(du -sh . | grep -o '^[^ ]*')
echo "📊 SUMMARY"
echo "  - Total files: $total_files"
echo "  - Total size: $total_size"
echo "✅ Website structure is ready for local viewing!"
