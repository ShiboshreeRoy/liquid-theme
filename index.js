const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.liquid': 'text/plain'
};

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function renderLiquidPreview() {
  const themeLayout = readFile(path.join(__dirname, 'layout', 'theme.liquid')) || '';
  const heroSection = readFile(path.join(__dirname, 'sections', 'bento-hero.liquid')) || '';
  const announcementSection = readFile(path.join(__dirname, 'sections', 'announcement-bar.liquid')) || '';
  const featuredSection = readFile(path.join(__dirname, 'sections', 'featured-collection.liquid')) || '';
  const footerSection = readFile(path.join(__dirname, 'sections', 'footer.liquid')) || '';
  const cssContent = readFile(path.join(__dirname, 'assets', 'tailwind-output.css')) || '';
  const jsContent = readFile(path.join(__dirname, 'assets', 'application.js')) || '';
  const iconPack = readFile(path.join(__dirname, 'snippets', 'icon-pack.liquid')) || '';

  return `<!doctype html>
<html class="no-js" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#000000">
  <title>Lequied Theme - Preview</title>
  <style>
    :root {
      --color-primary: #0A84FF;
      --color-secondary: #5E5CE6;
      --color-background: #000000;
      --color-surface: #1C1C1E;
      --color-text: #F5F5F7;
      --color-text-muted: #86868B;
      --color-accent: #BF5AF2;
      --color-border: #38383A;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif; background-color: #000; color: #F5F5F7; line-height: 1.6; overflow-x: hidden; min-height: 100vh; }
    .sf-pro { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif; }
    .frosted-glass { background: rgba(28, 28, 30, 0.72); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); }
    .glass-surface { background: rgba(44, 44, 46, 0.5); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .dynamic-island { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); will-change: transform, width, height, border-radius; }
    .dynamic-island.expanded { width: 100% !important; max-width: 600px; border-radius: 22px; }
    .haptic-hover { transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s ease; }
    .haptic-hover:hover { transform: scale(1.02) translateY(-2px); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3); }
    .haptic-hover:active { transform: scale(0.98); }
    .cart-drawer-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); z-index: 998; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; }
    .cart-drawer-overlay.active { opacity: 1; visibility: visible; }
    .cart-drawer { position: fixed; top: 0; right: 0; width: 100%; max-width: 420px; height: 100%; z-index: 999; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1); background: rgba(28, 28, 30, 0.85); backdrop-filter: saturate(180%) blur(40px); border-left: 1px solid rgba(255, 255, 255, 0.08); }
    .cart-drawer.active { transform: translateX(0); }
    .skip-link { position: absolute; top: -100%; left: 50%; transform: translateX(-50%); z-index: 9999; padding: 12px 24px; background: var(--color-accent); color: #fff; border-radius: 12px; text-decoration: none; font-weight: 600; }
    .skip-link:focus { top: 12px; }
    img { max-width: 100%; height: auto; display: block; }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }
    ${cssContent}
  </style>
</head>
<body class="sf-pro">
  <a class="skip-link" href="#main-content">Skip to content</a>

  <header class="sticky top-0 z-50 w-full" role="banner">
    <div class="frosted-glass border-b border-white/[0.08]">
      <div class="relative overflow-hidden bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20" role="region" aria-label="Announcement">
        <div class="max-w-7xl mx-auto px-4 py-2.5">
          <div class="flex items-center justify-center gap-2">
            <a href="#" class="text-xs sm:text-sm font-medium text-white/90 hover:text-white transition-colors text-center">
              Free shipping on orders over $100 <span class="inline-block ml-1 text-white/60" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-[72px]">
          <button class="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors" aria-label="Menu" aria-expanded="false" data-mobile-menu-toggle>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>

          <div class="flex items-center">
            <a href="/" class="text-xl font-semibold tracking-tight text-white hover:text-white/90 transition-colors">Lequied</a>
          </div>

          <nav class="hidden md:flex items-center" role="navigation" aria-label="Main navigation">
            <div class="dynamic-island flex items-center gap-1 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08]" id="dynamic-island-nav">
              <a href="#" class="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-full hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/30" aria-current="page">Home</a>
              <a href="#" class="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/30">Collections</a>
              <a href="#" class="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/30">Products</a>
              <a href="#" class="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/30">About</a>
            </div>
          </nav>

          <div class="flex items-center gap-2">
            <a href="#" class="flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </a>
            <a href="#" class="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </a>
            <button class="relative flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors" aria-label="Cart (0)" data-cart-toggle>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <nav class="md:hidden overflow-hidden transition-all duration-300 ease-in-out max-h-0" role="navigation" aria-label="Mobile navigation" data-mobile-menu>
        <div class="px-4 pb-4 space-y-1 border-t border-white/[0.06]">
          <a href="#" class="block px-4 py-3 text-base font-medium text-white bg-white/10 rounded-xl transition-all" aria-current="page">Home</a>
          <a href="#" class="block px-4 py-3 text-base font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all">Collections</a>
          <a href="#" class="block px-4 py-3 text-base font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all">Products</a>
          <a href="#" class="block px-4 py-3 text-base font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all">About</a>
        </div>
      </nav>
    </div>
  </header>

  <main id="main-content" role="main" tabindex="-1">

    <section class="relative py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-label="Designed for the extraordinary.">
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" style="background:rgba(59,130,246,0.1);width:600px;height:600px;border-radius:9999px;filter:blur(120px)"></div>
        <div class="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" style="background:rgba(168,85,247,0.1);width:500px;height:500px;border-radius:9999px;filter:blur(120px)"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px]" style="background:rgba(99,102,241,0.05);width:800px;height:800px;border-radius:9999px;filter:blur(150px);transform:translate(-50%,-50%)"></div>
      </div>

      <div class="relative max-w-7xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-[minmax(140px,1fr)] md:auto-rows-[minmax(180px,1fr)]">

          <div class="col-span-2 row-span-2 glass-surface rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between haptic-hover group">
            <div>
              <span class="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-500/10 rounded-full mb-4 sm:mb-6">New Collection</span>
              <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-3 sm:mb-4" style="font-size:clamp(1.875rem,4vw,3.75rem)">Designed for the extraordinary.</h1>
              <p class="text-base sm:text-lg text-white/60 max-w-lg leading-relaxed">Premium products crafted with precision and purpose.</p>
            </div>
            <div class="flex flex-wrap gap-3 mt-6 sm:mt-8">
              <a href="#" class="inline-flex items-center px-6 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50">
                Shop Now
                <svg class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="#" class="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-full text-sm font-semibold hover:bg-white/20 transition-all border border-white/[0.12]">Learn More</a>
            </div>
          </div>

          <div class="col-span-1 glass-surface rounded-3xl p-5 sm:p-6 flex flex-col justify-between haptic-hover overflow-hidden relative group">
            <div class="relative z-10">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mb-3" style="background:linear-gradient(to bottom right,#fb923c,#ec4899)" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
              </div>
              <h3 class="text-sm font-semibold text-white mb-1">Premium Quality</h3>
              <p class="text-xs text-white/50 leading-relaxed">Crafted with the finest materials</p>
            </div>
          </div>

          <div class="col-span-1 glass-surface rounded-3xl p-5 sm:p-6 flex flex-col justify-between haptic-hover overflow-hidden relative group">
            <div class="relative z-10">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-3" style="background:linear-gradient(to bottom right,#4ade80,#059669)" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 class="text-sm font-semibold text-white mb-1">Free Shipping</h3>
              <p class="text-xs text-white/50 leading-relaxed">Complimentary on all orders</p>
            </div>
          </div>

          <div class="col-span-1 glass-surface rounded-3xl p-5 sm:p-6 flex flex-col justify-between haptic-hover overflow-hidden relative group">
            <div class="relative z-10">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mb-3" style="background:linear-gradient(to bottom right,#60a5fa,#4f46e5)" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
              </div>
              <h3 class="text-sm font-semibold text-white mb-1">Secure Checkout</h3>
              <p class="text-xs text-white/50 leading-relaxed">Encrypted & protected payments</p>
            </div>
          </div>

          <div class="col-span-1 glass-surface rounded-3xl p-5 sm:p-6 flex flex-col justify-between haptic-hover overflow-hidden relative group">
            <div class="relative z-10">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center mb-3" style="background:linear-gradient(to bottom right,#c084fc,#7c3aed)" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg>
              </div>
              <h3 class="text-sm font-semibold text-white mb-1">24/7 Support</h3>
              <p class="text-xs text-white/50 leading-relaxed">Always here to help you</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8" aria-label="Featured">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <p class="text-sm font-medium text-white/40 uppercase tracking-wider mb-2">Curated for you</p>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white" style="font-size:clamp(1.5rem,3vw,2.25rem)">Featured</h2>
          </div>
          <a href="#" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          ${[
            { name: 'Titanium Pro Case', price: '$79.00', color: 'from-slate-700 to-slate-900' },
            { name: 'Ceramic Shield+', price: '$49.00', compare: '$59.00', color: 'from-zinc-700 to-zinc-900' },
            { name: 'MagSafe Charger', price: '$39.00', color: 'from-neutral-700 to-neutral-900' },
            { name: 'Ultra Leather Band', price: '$99.00', color: 'from-stone-700 to-stone-900' },
            { name: 'AirPods Max Case', price: '$59.00', color: 'from-gray-700 to-gray-900' },
            { name: 'Privacy Screen', price: '$34.00', compare: '$44.00', color: 'from-zinc-600 to-zinc-800' },
            { name: 'Wireless Hub', price: '$129.00', color: 'from-slate-600 to-slate-800' },
            { name: 'Cable Kit Pro', price: '$24.00', color: 'from-neutral-600 to-neutral-800' }
          ].map((product, i) => `
            <article class="glass-surface rounded-3xl overflow-hidden haptic-hover group" aria-label="${product.name}">
              <a href="#" class="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-inset rounded-3xl">
                <div class="aspect-square overflow-hidden relative" style="background:linear-gradient(to bottom right, rgba(255,255,255,0.03), rgba(255,255,255,0.01))">
                  <div class="w-full h-full flex items-center justify-center">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" class="text-white/10"><rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </div>
                  ${product.compare ? '<span class="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white rounded-full">Sale</span>' : ''}
                </div>
                <div class="p-4">
                  <p class="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-1">Lequied</p>
                  <h3 class="text-sm font-semibold text-white truncate mb-1.5 group-hover:text-white/90 transition-colors">${product.name}</h3>
                  <div class="flex items-baseline gap-2">
                    <span class="text-sm font-semibold text-white">${product.price}</span>
                    ${product.compare ? `<span class="text-xs text-white/30 line-through">${product.compare}</span>` : ''}
                  </div>
                </div>
              </a>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

  </main>

  <footer class="border-t border-white/[0.06]" role="contentinfo">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 sm:py-16">
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">Shop</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">All Products</a></li>
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">New Arrivals</a></li>
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">Best Sellers</a></li>
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">Sale</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">Help</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">Shipping</a></li>
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">Returns</a></li>
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">Company</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">About</a></li>
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" class="text-sm text-white/50 hover:text-white transition-colors">Press</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">Stay Updated</h3>
          <p class="text-sm text-white/50 mb-4">Subscribe for updates and exclusive offers.</p>
          <form class="flex gap-2">
            <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors" style="background:rgba(255,255,255,0.05);color:#fff">
            <button type="submit" class="px-5 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors">Subscribe</button>
          </form>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/[0.06]">
        <p class="text-xs text-white/30">&copy; 2026 Lequied by Shiboshree Roy. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <div class="cart-drawer-overlay" data-cart-overlay aria-hidden="true"></div>
  <aside class="cart-drawer" data-cart-drawer role="dialog" aria-label="Your Cart" aria-modal="true">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-6 border-b border-white/[0.08]">
        <h2 class="text-lg font-semibold text-white">Your Cart</h2>
        <button class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors" data-cart-close aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-6" data-cart-items>
        <div class="flex flex-col items-center justify-center h-full text-center" data-cart-empty>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-white/30 mb-4" style="color:rgba(255,255,255,0.3)">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path>
          </svg>
          <p class="text-white/50 text-sm">Your cart is empty</p>
          <a href="#" class="mt-4 px-6 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">Continue Shopping</a>
        </div>
      </div>
    </div>
  </aside>

  ${iconPack}

  <script>${jsContent}</script>
</body>
</html>`;
}

function renderFileExplorer() {
  const structure = {
    'layout/': ['theme.liquid'],
    'templates/': ['index.json', 'product.json', 'collection.json', 'cart.json'],
    'sections/': ['announcement-bar.liquid', 'bento-hero.liquid', 'featured-collection.liquid', 'main-product.liquid', 'footer.liquid'],
    'snippets/': ['product-card.liquid', 'icon-pack.liquid'],
    'config/': ['settings_schema.json'],
    'locales/': ['en.default.json'],
    'assets/': ['application.js', 'tailwind-output.css']
  };

  let treeHtml = '';
  for (const [dir, files] of Object.entries(structure)) {
    treeHtml += `<div style="margin-bottom:12px"><div style="color:#60a5fa;font-weight:600;font-size:14px;margin-bottom:4px">📁 ${dir}</div>`;
    files.forEach(f => {
      const ext = path.extname(f);
      const icon = ext === '.liquid' ? '💧' : ext === '.json' ? '📋' : ext === '.js' ? '⚡' : ext === '.css' ? '🎨' : '📄';
      treeHtml += `<a href="/file/${dir}${f}" style="display:block;padding:6px 12px 6px 24px;color:rgba(255,255,255,0.7);text-decoration:none;font-size:13px;border-radius:8px;transition:background 0.15s" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='transparent'">${icon} ${f}</a>`;
    });
    treeHtml += '</div>';
  }

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Theme Files - Lequied</title>
  <style>body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif;background:#000;color:#F5F5F7;margin:0;padding:40px}
  .container{max-width:600px;margin:0 auto}h1{font-size:28px;font-weight:700;margin-bottom:8px}
  .subtitle{color:rgba(255,255,255,0.5);font-size:14px;margin-bottom:32px}
  .nav{display:flex;gap:12px;margin-bottom:32px}
  .nav a{padding:8px 16px;border-radius:20px;font-size:13px;font-weight:600;text-decoration:none;transition:all 0.15s}
  .nav a.active{background:#fff;color:#000}.nav a:not(.active){background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.08)}
  .nav a:not(.active):hover{background:rgba(255,255,255,0.1);color:#fff}
  </style></head><body><div class="container">
  <h1>Lequied Theme</h1>
  <p class="subtitle">Online Store 2.0 Compliant Shopify Theme</p>
  <div class="nav"><a href="/">Preview</a><a href="/files" class="active">Files</a></div>
  ${treeHtml}
  </div></body></html>`;
}

function renderFileView(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const content = readFile(fullPath);
  if (!content) return null;

  const escaped = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${filePath} - Lequied</title>
  <style>body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif;background:#000;color:#F5F5F7;margin:0;padding:40px}
  .container{max-width:900px;margin:0 auto}
  .breadcrumb{font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:16px}
  .breadcrumb a{color:#60a5fa;text-decoration:none}.breadcrumb a:hover{text-decoration:underline}
  h1{font-size:20px;font-weight:700;margin-bottom:24px}
  pre{background:rgba(44,44,46,0.5);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;overflow-x:auto;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.8);font-family:'SF Mono',Menlo,Monaco,monospace}
  </style></head><body><div class="container">
  <div class="breadcrumb"><a href="/files">Files</a> / ${filePath}</div>
  <h1>${path.basename(filePath)}</h1>
  <pre><code>${escaped}</code></pre>
  </div></body></html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/' || url.pathname === '/preview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderLiquidPreview());
    return;
  }

  if (url.pathname === '/files') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderFileExplorer());
    return;
  }

  if (url.pathname.startsWith('/file/')) {
    const filePath = url.pathname.replace('/file/', '');
    const html = renderFileView(filePath);
    if (html) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    const filePath = path.join(__dirname, url.pathname);
    const content = readFile(filePath);
    if (content) {
      const ext = path.extname(url.pathname);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Lequied Theme preview running at http://0.0.0.0:${PORT}`);
});