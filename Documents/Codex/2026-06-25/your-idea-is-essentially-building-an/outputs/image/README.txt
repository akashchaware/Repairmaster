=== REPAIRINGMASTER IMAGE FOLDER ===
Location: outputs\image\ (same as index.html, styles.css, app.js)
Usage:   <img src="image/your-file.png" ...>

=== NAMING CONVENTION (recommended) ===

  logo.*                — App logo (logo.png, logo.svg)
  banner-<name>.png     — Banner images (top of login page)
  showcase-<name>.png   — Showcase/service card images
  device-<name>.png     — Device/product images
  technician-<name>.png — Technician/field operation images

=== HOW TO ADD A NEW IMAGE ===

1. Drop your image file into this folder
2. Reference it in code as: image/your-file.png
3. File types: PNG, JPG, WebP, SVG supported

=== CURRENT IMAGES ===

  logo.png                    App logo / brand
  logo.svg                    App logo (vector)
  device-repair.png           Top banner + default device fallback
  device-generic.png          Generic device image (unused)
  technician-scooty.png       Showcase: Doorstep Pickup
  workshop.png                Showcase: Expert Repair
  technician-device-1.png     Showcase: Certified Refurbished
  technician-device-2.png     (available, not currently used)

=== TIPS ===

- Images 1200-1600px wide work best for banners and showcase cards
- Optimize images (tinypng.com) before adding to keep page load fast
- Use descriptive alt text in <img> for accessibility
