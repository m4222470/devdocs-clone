#!/usr/bin/env python3
import os
import sys

output = "✅ WEBSITE READINESS REPORT\n"
output += "=" * 50 + "\n\n"

# Check critical files
checks = {
    "Main Index": "sentrixa-template.webflow.io/index.html",
    "About Page": "sentrixa-template.webflow.io/about",
    "Main CSS": "cdn.prod.website-files.com/6965d25065d78378ecfa1ac9/css/sentrixa-template.webflow.shared.51560f5c1.css",
    "WebFont Library": "ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
    "Blog Pages": "sentrixa-template.webflow.io/blog",
    "Career Pages": "sentrixa-template.webflow.io/career",
}

all_ok = True
for name, path in checks.items():
    exists = os.path.exists(path)
    status = "✓ OK" if exists else "✗ MISSING"
    output += f"{name:20} : {status}\n"
    if not exists:
        all_ok = False

output += "\n" + "=" * 50 + "\n"
output += "✅ STATUS: Website is ready for local viewing!\n" if all_ok else "⚠️  STATUS: Some files missing!\n"

print(output)
sys.exit(0 if all_ok else 1)
