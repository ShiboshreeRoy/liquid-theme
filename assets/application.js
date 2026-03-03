(function () {
  'use strict';

  const SELECTORS = {
    cartToggle: '[data-cart-toggle]',
    cartDrawer: '[data-cart-drawer]',
    cartOverlay: '[data-cart-overlay]',
    cartClose: '[data-cart-close]',
    cartItems: '[data-cart-items]',
    cartEmpty: '[data-cart-empty]',
    cartFooter: '[data-cart-footer]',
    cartTotal: '[data-cart-total]',
    mobileMenuToggle: '[data-mobile-menu-toggle]',
    mobileMenu: '[data-mobile-menu]',
    dynamicIslandNav: '#dynamic-island-nav',
    productForm: '[data-product-form]',
    addToCart: '[data-add-to-cart]',
    variantId: '[data-variant-id]',
    formQuantity: '[data-form-quantity]',
    quantityInput: '[data-quantity-input]',
    quantityMinus: '[data-quantity-minus]',
    quantityPlus: '[data-quantity-plus]',
    optionSelector: '[data-option-selector]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productComparePrice: '[data-product-compare-price]'
  };

  class CartDrawer {
    constructor() {
      this.drawer = document.querySelector(SELECTORS.cartDrawer);
      this.overlay = document.querySelector(SELECTORS.cartOverlay);
      this.focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

      if (!this.drawer || !this.overlay) return;

      this.bindEvents();
    }

    bindEvents() {
      document.querySelectorAll(SELECTORS.cartToggle).forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.updateCart();
          this.open();
        });
      });

      document.querySelectorAll(SELECTORS.cartClose).forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });

      this.overlay.addEventListener('click', () => this.close());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
        if (e.key === 'Tab' && this.isOpen()) {
          this.handleTabTrap(e);
        }
      });
    }

    open() {
      this.drawer.classList.add('active');
      this.overlay.classList.add('active');
      this.overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      this.previousFocus = document.activeElement;

      const mainContent = document.getElementById('main-content');
      const header = document.querySelector('header[role="banner"]');
      if (mainContent) mainContent.setAttribute('inert', '');
      if (header) header.setAttribute('inert', '');

      const closeBtn = this.drawer.querySelector(SELECTORS.cartClose);
      if (closeBtn) {
        requestAnimationFrame(() => closeBtn.focus());
      }
    }

    close() {
      this.drawer.classList.remove('active');
      this.overlay.classList.remove('active');
      this.overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      const mainContent = document.getElementById('main-content');
      const header = document.querySelector('header[role="banner"]');
      if (mainContent) mainContent.removeAttribute('inert');
      if (header) header.removeAttribute('inert');

      if (this.previousFocus) {
        this.previousFocus.focus();
      }
    }

    isOpen() {
      return this.drawer.classList.contains('active');
    }

    handleTabTrap(e) {
      const focusable = Array.from(this.drawer.querySelectorAll(this.focusableSelector));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    async updateCart() {
      try {
        const response = await fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
        const cart = await response.json();
        this.renderCart(cart);
      } catch (error) {
        console.error('Failed to update cart:', error);
      }
    }

    renderCart(cart) {
      const itemsContainer = document.querySelector(SELECTORS.cartItems);
      const emptyState = document.querySelector(SELECTORS.cartEmpty);
      const footer = document.querySelector(SELECTORS.cartFooter);
      const total = document.querySelector(SELECTORS.cartTotal);

      if (!itemsContainer) return;

      const existingItems = itemsContainer.querySelectorAll('[data-cart-item]');
      existingItems.forEach(el => el.remove());

      if (cart.item_count === 0) {
        if (emptyState) emptyState.style.display = '';
        if (footer) footer.style.display = 'none';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';
      if (footer) footer.style.display = '';
      if (total) total.textContent = this.formatMoney(cart.total_price, cart.currency);

      const cartCountEls = document.querySelectorAll('[data-cart-count]');
      cartCountEls.forEach(el => { el.textContent = cart.item_count; });

      let html = '';
      cart.items.forEach(item => {
        html += `
          <div class="flex gap-4 mb-4 pb-4 border-b border-white/[0.06]" data-cart-item="${item.key}">
            <div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5">
              ${item.image ? `<img src="${item.image}" alt="${this.escapeHtml(item.title)}" class="w-full h-full object-cover" loading="lazy">` : ''}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-white truncate">${this.escapeHtml(item.product_title)}</h3>
              ${item.variant_title ? `<p class="text-xs text-white/50 mt-0.5">${this.escapeHtml(item.variant_title)}</p>` : ''}
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm font-medium text-white">${this.formatMoney(item.final_line_price, cart.currency)}</span>
                <div class="flex items-center gap-2">
                  <button class="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30" 
                    onclick="window.__cartDrawer.changeQuantity('${item.key}', ${item.quantity - 1})" 
                    aria-label="Decrease quantity for ${this.escapeHtml(item.product_title)}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                  <span class="text-xs font-medium text-white/80 w-5 text-center" aria-live="polite">${item.quantity}</span>
                  <button class="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30" 
                    onclick="window.__cartDrawer.changeQuantity('${item.key}', ${item.quantity + 1})" 
                    aria-label="Increase quantity for ${this.escapeHtml(item.product_title)}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      itemsContainer.insertAdjacentHTML('afterbegin', html);
    }

    async changeQuantity(key, quantity) {
      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ id: key, quantity: Math.max(0, quantity) })
        });
        const cart = await response.json();
        this.renderCart(cart);
      } catch (error) {
        console.error('Failed to change quantity:', error);
      }
    }

    formatMoney(cents, currency) {
      const amount = (cents / 100).toFixed(2);
      if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
        return Shopify.formatMoney(cents);
      }
      const sym = { USD: '$', EUR: '\u20AC', GBP: '\u00A3', CAD: 'CA$', AUD: 'A$' };
      const prefix = (currency && sym[currency]) ? sym[currency] : '$';
      return prefix + amount;
    }

    escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  class MobileMenu {
    constructor() {
      this.toggle = document.querySelector(SELECTORS.mobileMenuToggle);
      this.menu = document.querySelector(SELECTORS.mobileMenu);

      if (!this.toggle || !this.menu) return;

      this.toggle.addEventListener('click', () => this.toggleMenu());
    }

    toggleMenu() {
      const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
      this.toggle.setAttribute('aria-expanded', !isExpanded);

      if (isExpanded) {
        this.menu.style.maxHeight = '0';
      } else {
        this.menu.style.maxHeight = this.menu.scrollHeight + 'px';
      }
    }
  }

  class DynamicIsland {
    constructor() {
      this.nav = document.querySelector(SELECTORS.dynamicIslandNav);
      if (!this.nav) return;

      this.lastScrollY = 0;
      this.ticking = false;

      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }

    onScroll() {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }

    update() {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        this.nav.classList.add('expanded');
      } else {
        this.nav.classList.remove('expanded');
      }
      this.lastScrollY = scrollY;
    }
  }

  class ProductForm {
    constructor() {
      this.forms = document.querySelectorAll(SELECTORS.productForm);
      if (!this.forms.length) return;

      this.loadProductData();
      this.forms.forEach(form => this.initForm(form));
      this.initQuantitySelectors();
      this.initVariantSelectors();
    }

    loadProductData() {
      const jsonEl = document.querySelector(SELECTORS.productJson);
      if (jsonEl) {
        try {
          this.product = JSON.parse(jsonEl.textContent);
        } catch (e) {
          console.error('Failed to parse product JSON:', e);
        }
      }
    }

    initVariantSelectors() {
      if (!this.product) return;

      document.querySelectorAll(SELECTORS.optionSelector).forEach(radio => {
        radio.addEventListener('change', () => this.onOptionChange());
      });
    }

    onOptionChange() {
      if (!this.product || !this.product.variants) return;

      const selectedOptions = [];
      this.product.options.forEach((optionName, index) => {
        const checked = document.querySelector(`input[name="${optionName}"]:checked`);
        if (checked) selectedOptions[index] = checked.value;
      });

      const matchedVariant = this.product.variants.find(variant => {
        return variant.options.every((opt, i) => opt === selectedOptions[i]);
      });

      if (matchedVariant) {
        const variantInput = document.querySelector(SELECTORS.variantId);
        if (variantInput) variantInput.value = matchedVariant.id;

        const priceEl = document.querySelector(SELECTORS.productPrice);
        if (priceEl) priceEl.textContent = this.formatMoney(matchedVariant.price);

        const compareEl = document.querySelector(SELECTORS.productComparePrice);
        if (compareEl) {
          if (matchedVariant.compare_at_price && matchedVariant.compare_at_price > matchedVariant.price) {
            compareEl.textContent = this.formatMoney(matchedVariant.compare_at_price);
            compareEl.style.display = '';
          } else {
            compareEl.style.display = 'none';
          }
        }

        const addBtn = document.querySelector(SELECTORS.addToCart);
        if (addBtn) {
          addBtn.disabled = !matchedVariant.available;
          addBtn.textContent = matchedVariant.available ? 'Add to Cart' : 'Sold Out';
        }

        const url = new URL(window.location);
        url.searchParams.set('variant', matchedVariant.id);
        window.history.replaceState({}, '', url);
      }
    }

    formatMoney(cents) {
      if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
        return Shopify.formatMoney(cents);
      }
      return '$' + (cents / 100).toFixed(2);
    }

    initForm(form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector(SELECTORS.addToCart);
        if (!submitBtn || submitBtn.disabled) return;

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';

        try {
          const variantId = form.querySelector(SELECTORS.variantId)?.value;
          const quantity = form.querySelector(SELECTORS.formQuantity)?.value || 1;

          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ id: parseInt(variantId, 10), quantity: parseInt(quantity, 10) })
          });

          if (!response.ok) throw new Error('Failed to add to cart');

          submitBtn.textContent = 'Added!';

          if (window.__cartDrawer) {
            await window.__cartDrawer.updateCart();
            window.__cartDrawer.open();
          }

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 1500);
        } catch (error) {
          console.error('Add to cart error:', error);
          submitBtn.textContent = 'Error';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 2000);
        }
      });
    }

    initQuantitySelectors() {
      document.querySelectorAll(SELECTORS.quantityMinus).forEach(btn => {
        btn.addEventListener('click', () => {
          const input = btn.closest('.inline-flex, .flex')?.querySelector(SELECTORS.quantityInput);
          if (input) {
            const val = Math.max(1, parseInt(input.value, 10) - 1);
            input.value = val;
            this.updateFormQuantity(input, val);
          }
        });
      });

      document.querySelectorAll(SELECTORS.quantityPlus).forEach(btn => {
        btn.addEventListener('click', () => {
          const input = btn.closest('.inline-flex, .flex')?.querySelector(SELECTORS.quantityInput);
          if (input) {
            const val = parseInt(input.value, 10) + 1;
            input.value = val;
            this.updateFormQuantity(input, val);
          }
        });
      });

      document.querySelectorAll(SELECTORS.quantityInput).forEach(input => {
        input.addEventListener('change', () => {
          const val = Math.max(1, parseInt(input.value, 10) || 1);
          input.value = val;
          this.updateFormQuantity(input, val);
        });
      });
    }

    updateFormQuantity(input, val) {
      const form = input.closest('section')?.querySelector(SELECTORS.productForm);
      const hiddenQty = form?.querySelector(SELECTORS.formQuantity);
      if (hiddenQty) hiddenQty.value = val;
    }
  }

  class LazyLoader {
    constructor() {
      if ('loading' in HTMLImageElement.prototype) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            this.observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });

      document.querySelectorAll('img[data-src]').forEach(img => {
        this.observer.observe(img);
      });
    }
  }

  function init() {
    window.__cartDrawer = new CartDrawer();
    new MobileMenu();
    new DynamicIsland();
    new ProductForm();
    new LazyLoader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();