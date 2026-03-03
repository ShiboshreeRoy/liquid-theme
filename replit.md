# Lequied - Shopify Theme

## Overview
Lequied by Shiboshree Roy. A production-grade, Online Store 2.0 compliant Shopify theme inspired by the iOS 17 Pro Max interface. Licensed under MIT. Features a premium dark mode design with glassmorphism effects, Dynamic Island navigation, and Bento Grid layouts.

## Directory Structure
```
layout/          - theme.liquid (Master layout with frosted glass header)
templates/       - JSON templates (index, product, collection, cart)
sections/        - Liquid sections (announcement-bar, bento-hero, featured-collection, main-product, main-cart, main-collection-banner, main-collection-product-grid, footer)
snippets/        - Reusable components (product-card, icon-pack)
config/          - settings_schema.json (Merchant customization)
locales/         - en.default.json (Translation strings)
assets/          - application.js, tailwind-output.css
index.js         - Preview server (renders theme preview at port 5000)
```

## Tech Stack
- **Templating**: Liquid (Shopify)
- **Styling**: Tailwind CSS (pre-compiled dark mode output)
- **Interactivity**: Vanilla JavaScript ES6+ (no jQuery)
- **Data**: JSON templates for Online Store 2.0 compliance
- **Preview**: Node.js HTTP server

## Key Features
- Dynamic Island header navigation (expands on scroll)
- Bento Grid homepage layout (Apple-style modular grid)
- AJAX Cart Drawer with glassmorphism background
- SF Pro font stack for native iOS feel
- Lazy loading images, deferred scripts
- WCAG 2.2 accessibility (skip links, focus states, aria labels, reduced motion support)
- App Block support on product pages (`@app` block type)
- Merchant-editable color scheme (Titanium Silver, Deep Black, iOS system colors)

## Running
The preview server runs on port 5000:
- `/` - Live theme preview with sample data
- `/files` - File explorer view
- `/file/{path}` - View individual file source
