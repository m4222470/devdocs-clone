#!/usr/bin/env python3
"""
Download images from the original website and save them locally.
This script downloads all images from the Webflow template and saves them
to the local images folder for offline use.
"""

import os
import requests
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

# Image URLs to download
IMAGE_URLS = [
    # Logo
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/6532e5d1676094c3dc3e7002_logo-devdocs-x-webflow-template.png",
    
    # Page Preview Images
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652dd4dcffe94cdd6128b4ba_devdocs-x-home-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652dd4dd5b40e6da9f3a2ec7_devdocs-x-doc-single-snippets-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652dd4dc9cb0d9da95d99499_devdocs-x-changelog-single-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652de1ec21178e34c21878b5_devdocs-x-docs-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652dd4dcb239a55eb969bffa_devdocs-x-support-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652dd4dc9cb0d9da95d99495_devdocs-x-help-center-category-page-technical-documentation-webflow-template.png",
    
    # Feature icons
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f397554e76f4652160ba5d_devdocs-x-16-pages-included-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39754e4270a467f34943d_devdocs-x-22-sections-included-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f397545a16127c4772c695_devdocs-x-25-styles-and-symbols-included-technical-documentation-webflow-template.png",
    
    # Figma assets
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39755e3bd0b1033df44cb_devdocs-x-figma-included-technical-documentation-webflow-template.png",
    
    # More page previews
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39bc4ff994256e3b4b4da_devdocs-x-home-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39bd2662d1206d482a310_devdocs-x-docs-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652dd8047760d9f350d01629_devdocs-x-docs-v2-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652dd804eb3921410602fad4_devdocs-x-docs-v3-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39bf21ed4d925064158f7_devdocs-x-docs-category-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39c05a9cd626f18c38a30_devdocs-x-doc-single-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39c0fbe60f03ad9592b16_devdocs-x-doc-single-snippets-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39c1c1f945c477ac391e1_devdocs-x-support-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652ddb9219816c0785d11913_devdocs-x-support-v3-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652ddb92edda62c277167227_devdocs-x-support-v2-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39c311e8b80d1d742a5ff_devdocs-x-help-center-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39c4de3bd0b6c08dfc4c9_devdocs-x-help-center-category-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39c5dea3a3d132a73ba83_devdocs-x-help-center-single-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39c71aac9fd49cd9d0868_devdocs-x-changelog-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652dd804169423e16ad8d94e_devdocs-x-changelog-v3-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/652ddb92a39d12c64b34b21b_devdocs-x-changelog-v2-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39c7b8516f22d3511d3c5_devdocs-x-changelog-category-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39c89f9d9243b117e4e5f_devdocs-x-changelog-single-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39d1e0abc9c199818751f_devdocs-x-404-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39d1ef31d7787d0c35c38_devdocs-x-password-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39d1eea3a3d879673c44f_devdocs-x-coming-soon-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/653312123188d8eaabdba3c5_devdocs-x-instructions-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39fa09361d3adc3ede1ad_devdocs-x-custom-icon-set-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f39fa0a68f732981779390_devdocs-x-social-media-assets-page-technical-documentation-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63f64413455bf3487ac65bc2_devdocs-x-email-signature-page-technical-documentation-webflow-template.png",
    
    # Additional images
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63ebf4fd4662e256d00d2f3d_icon-getting-started-devdocs-x-webflow-template.svg",
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63ec319a1c47ebd3da8af3c1_help-center-devdocs-x-webflow-template.png",
    
    # Browser icon
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/63ed34f7a228ee6adefd2a1c_browser-icon-devdocs-x-webflow-template.png",
    
    # Help center section images
    "https://cdn.prod.website-files.com/63ebc489a92f1a9713ea4aed/63ec2c3bf0ed214761473990_desktop-app-devdocs-x-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a9713ea4aed/63ec2c37a92a9c34587be7fa_mobile-app-devdocs-x-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a9713ea4aed/63ec2c31e7fe5034df8a02f0_web-app-devdocs-x-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a9713ea4aed/63ec2c259579eaf0bf139010_payments-and-billing-devdocs-x-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a9713ea4aed/63ec2c2c87e69fa88bf76625_payments-and-billing-devdocs-x-webflow-template.png",
    "https://cdn.prod.website-files.com/63ebc489a92f1a9713ea4aed/63ec2c259579eaf0bf139010_troubleshooting-devdocs-x-webflow-template.png",
    
    # Webflow branding (to be removed/replaced)
    "https://cdn.prod.website-files.com/608e162a9175d0346094038b/67463b7d46e9fffa59a5ab2b_webflow-logo.png",
    "https://d3e54v103j8qbb.cloudfront.net/img/webflow-badge-icon-d2.89e12c322e.svg",
    "https://d3e54v103j8qbb.cloudfront.net/img/webflow-badge-text-d2.c82cec3b78.svg",
    
    # BRIX Templates branding (to be removed)
    "https://cdn.prod.website-files.com/63ebc489a92f1a4920ea4abf/674f54cdea2094069b41811c_customize-your-webflow-template-brix-templates.png",
]

def download_image(url, save_dir):
    """Download a single image and save it locally."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Extract filename from URL
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        
        # Create safe filename
        safe_filename = filename.replace('%20', '-').replace(' ', '-')
        
        # Save the file
        filepath = os.path.join(save_dir, safe_filename)
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"Downloaded: {safe_filename}")
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def main():
    # Create images directory
    save_dir = "/workspace/devdocs-clone/images"
    os.makedirs(save_dir, exist_ok=True)
    
    print(f"Downloading {len(IMAGE_URLS)} images to {save_dir}...")
    
    # Download images in parallel
    success_count = 0
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(download_image, url, save_dir): url for url in IMAGE_URLS}
        for future in as_completed(futures):
            if future.result():
                success_count += 1
    
    print(f"\nDownload complete! {success_count}/{len(IMAGE_URLS)} images downloaded.")
    
    # List downloaded files
    downloaded_files = os.listdir(save_dir)
    print(f"\nDownloaded {len(downloaded_files)} files:")
    for f in downloaded_files:
        print(f"  - {f}")

if __name__ == "__main__":
    main()