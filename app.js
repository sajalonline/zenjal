/**
 * Zenjal Boutique Indian Fashion — E-commerce Platform Script
 * Core Architecture: Single Page Application, Hash-based Router, Reactive State Engine
 * WooCommerce Simulator Suite by Antigravity AI
 */

const app = {
  // ---------------------------------------------------------------------------
  // 1. Reactive Application State
  // ---------------------------------------------------------------------------
  state: {
    cart: [],
    wishlist: [],
    products: typeof PRODUCTS !== 'undefined' ? PRODUCTS : [],
    blogPosts: typeof BLOG_POSTS !== 'undefined' ? BLOG_POSTS : [],
    filters: {
      category: 'All',
      price: 25000,
      color: 'All',
      size: 'All',
      fabric: 'All',
      searchQuery: ''
    },
    sorting: 'default', // 'default', 'price-low', 'price-high', 'rating'
    pincodeRecords: {
      '272207': { zone: 'Siddharthnagar (Boutique Hub)', time: 'Next Day Express', cod: true, cost: 'Free' }
    },
    activeRoute: '/',
    activeProductDetailId: null,
    activeBlogSlug: null,
    abandonedCartTriggered: false,
    checkoutStep: 1,
    checkoutData: {
      name: '',
      email: '',
      phone: '',
      address: '',
      pincode: '',
      paymentMethod: 'razorpay'
    }
  },

  // ---------------------------------------------------------------------------
  // 2. Core Initializer
  // ---------------------------------------------------------------------------
  init() {
    console.log("Initializing Zenjal Boutique E-commerce Engine...");
    
    // Load local storage states if existing
    this.loadState();
    
    // Bind Router Events
    window.addEventListener('hashchange', () => this.router());
    window.addEventListener('load', () => this.router());

    // Bind Abandoned Cart Recovery Events
    window.addEventListener('blur', () => this.cart.onWindowBlur());
    window.addEventListener('focus', () => this.cart.onWindowFocus());

    // Run first UI updates
    this.ui.updateCounters();
    this.ui.setupGlobalSearchEvents();
    
    // Trigger scroll highlights
    window.addEventListener('scroll', () => {
      const header = document.getElementById('app-header');
      if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }, { passive: true });
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // ---------------------------------------------------------------------------
  // 3. LocalStorage Persistence
  // ---------------------------------------------------------------------------
  saveState() {
    localStorage.setItem('zenjal_cart', JSON.stringify(this.state.cart));
    localStorage.setItem('zenjal_wishlist', JSON.stringify(this.state.wishlist));
    localStorage.setItem('zenjal_products', JSON.stringify(this.state.products));
  },

  loadState() {
    const savedCart = localStorage.getItem('zenjal_cart');
    const savedWish = localStorage.getItem('zenjal_wishlist');
    const savedProd = localStorage.getItem('zenjal_products');

    if (savedCart) this.state.cart = JSON.parse(savedCart);
    if (savedWish) this.state.wishlist = JSON.parse(savedWish);
    if (savedProd) this.state.products = JSON.parse(savedProd);
  },

  // ---------------------------------------------------------------------------
  // 4. Hash-Based SPA Router
  // ---------------------------------------------------------------------------
  router() {
    const hash = window.location.hash || '#/';
    this.state.activeRoute = hash;

    // Reset modals or drawer visibility during route changes
    this.ui.toggleCart(false);
    this.ui.toggleWishlist(false);
    this.ui.toggleSearch(false);
    this.checkout.closeCheckout();

    // Scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const container = document.getElementById('view-container');
    container.style.opacity = '0'; // smooth transition fade

    setTimeout(() => {
      // Dynamic Router mapping
      if (hash === '#/' || hash === '') {
        this.render.home(container);
        this.seo.update("Zenjal — Boutique Indian Fashion | Custom Tailoring", "Experience premium handcrafted Chanderi, Katan silk, and bespoke festive lehengas at Zenjal, Where Tradition Meets Grace.");
      } else if (hash.startsWith('#/shop')) {
        // Check for quick URL filters (e.g. #/shop?category=Sarees)
        this.routerParseFilters(hash);
        this.render.shop(container);
        this.seo.update("Shop Luxury Indian Textiles & Ethnic Wear | Zenjal", "Browse our complete catalog of boutique kurta sets, Varanasi sarees, hand block Anarkalis and wedding lehengas.");
      } else if (hash.startsWith('#/product/')) {
        const productId = hash.split('#/product/')[1];
        this.state.activeProductDetailId = productId;
        this.render.productDetail(container, productId);
      } else if (hash === '#/collections') {
        this.render.collections(container);
        this.seo.update("Bespoke Festive Collections & Lookbooks | Zenjal", "Discover our seasonal edits: Royal Varanasi Weaves, Gota Patti Classics, and pastel wedding lehengas.");
      } else if (hash === '#/customize') {
        this.render.customize(container);
        this.seo.update("Bespoke Custom Tailoring Design Studio | Zenjal", "Enter your exact measurements (Bust, Waist, Hip, Armhole) and custom-design your boutique Kurta, Saree Blouse, or Lehenga.");
      } else if (hash === '#/about') {
        this.render.about(container);
        this.seo.update("Our Artisan Story & Craft Heritage | Zenjal", "Founded by Hemlata, Zenjal is a celebration of handmade Indian textiles, local weaver families, and bespoke fits.");
      } else if (hash === '#/blog') {
        this.state.activeBlogSlug = null;
        this.render.blog(container);
        this.seo.update("Traditional Styling Lookbooks & Fashion Guides | Zenjal", "Expert styling lookbooks, sizing custom fits, and textile care advice curated by designer Hemlata.");
      } else if (hash.startsWith('#/blog/')) {
        const blogSlug = hash.split('#/blog/')[1];
        this.state.activeBlogSlug = blogSlug;
        this.render.blogArticle(container, blogSlug);
      } else if (hash === '#/contact') {
        this.render.contact(container);
        this.seo.update("Visit Our Boutique Studio & WhatsApp Consultations | Zenjal", "Contact Zenjal in Siddharthnagar, UP. Book custom styling, delivery estimates, or message on WhatsApp.");
      } else {
        // Fallback 404 page
        container.innerHTML = `
          <div class="container text-center section-padding" style="font-family: var(--font-serif);">
            <h2 class="page-title">Route Lost In Weaves</h2>
            <p style="color:var(--text-muted); margin-bottom: 2rem;">This collection hasn't been woven yet. Return to the courtyard.</p>
            <a href="#/" class="btn btn-primary">Go to Home</a>
          </div>
        `;
      }
      container.style.opacity = '1';
      this.ui.updateActiveNavLink();
    }, 250);
  },

  routerParseFilters(hash) {
    if (hash.includes('?')) {
      const queryStr = hash.split('?')[1];
      const params = new URLSearchParams(queryStr);
      if (params.has('category')) this.state.filters.category = params.get('category');
      if (params.has('tag')) this.state.filters.searchQuery = params.get('tag');
    }
  },

  // ---------------------------------------------------------------------------
  // 5. SEO Head Metas Updater
  // ---------------------------------------------------------------------------
  seo: {
    update(title, description) {
      document.title = title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
    }
  },

  // ---------------------------------------------------------------------------
  // 6. UI Drawers & Helpers Suite
  // ---------------------------------------------------------------------------
  ui: {
    toggleCart(open) {
      const backdrop = document.getElementById('cart-backdrop');
      const drawer = document.getElementById('cart-drawer');
      if (open) {
        backdrop.classList.add('active');
        drawer.classList.add('active');
        app.cart.render();
      } else {
        backdrop.classList.remove('active');
        drawer.classList.remove('active');
      }
    },

    toggleWishlist(open) {
      const backdrop = document.getElementById('wishlist-backdrop');
      const drawer = document.getElementById('wishlist-drawer');
      if (open) {
        backdrop.classList.add('active');
        drawer.classList.add('active');
        app.wishlist.render();
      } else {
        backdrop.classList.remove('active');
        drawer.classList.remove('active');
      }
    },

    toggleSearch(open) {
      const modal = document.getElementById('search-modal');
      const input = document.getElementById('search-input');
      if (open) {
        modal.classList.add('active');
        setTimeout(() => input.focus(), 150);
      } else {
        modal.classList.remove('active');
        document.getElementById('search-results-panel').innerHTML = '';
        input.value = '';
      }
    },

    toggleSizeGuide(open) {
      const modal = document.getElementById('size-guide-modal');
      if (open) modal.classList.add('active');
      else modal.classList.remove('active');
    },

    toggleMobileMenu() {
      const drawer = document.getElementById('mobile-menu-drawer');
      const backdrop = document.getElementById('mobile-menu-backdrop');
      
      const isOpen = drawer.style.right === '0px';
      if (isOpen) {
        drawer.style.right = '-450px';
        backdrop.classList.remove('active');
      } else {
        drawer.style.right = '0px';
        backdrop.classList.add('active');
      }
    },

    updateCounters() {
      const cartCount = app.state.cart.reduce((sum, item) => sum + item.quantity, 0);
      const cartBadge = document.getElementById('cart-counter');
      if (cartCount > 0) {
        cartBadge.innerText = cartCount;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }

      const wishCount = app.state.wishlist.length;
      const wishBadge = document.getElementById('wishlist-counter');
      if (wishCount > 0) {
        wishBadge.innerText = wishCount;
        wishBadge.style.display = 'flex';
      } else {
        wishBadge.style.display = 'none';
      }
    },

    updateActiveNavLink() {
      const links = document.querySelectorAll('.nav-links a');
      links.forEach(link => {
        const routeAttr = link.getAttribute('data-route');
        if (app.state.activeRoute === '#/' && routeAttr === '/') {
          link.classList.add('active');
        } else if (app.state.activeRoute.startsWith('#' + routeAttr) && routeAttr !== '/') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    },

    setupGlobalSearchEvents() {
      const input = document.getElementById('search-input');
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          this.executeSearch();
        } else {
          this.liveSearch(input.value);
        }
      });
    },

    liveSearch(query) {
      const resultsPanel = document.getElementById('search-results-panel');
      if (!query || query.trim().length < 2) {
        resultsPanel.innerHTML = '';
        return;
      }

      const matching = app.state.products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(query.toLowerCase())
      );

      if (matching.length === 0) {
        resultsPanel.innerHTML = '<p style="font-size:0.9rem; color:var(--text-muted); text-align:center;">No matching garments found...</p>';
        return;
      }

      resultsPanel.innerHTML = matching.map(p => `
        <div onclick="window.location.hash='#/product/${p.id}'; app.ui.toggleSearch(false);" style="display:flex; gap:1rem; padding: 0.5rem 0; border-bottom:1px dashed var(--border-gold); cursor:pointer; align-items:center;">
          <img src="${p.colors[0].images[0]}" alt="${p.name}" style="width:40px; height:50px; object-fit:cover; border-radius:3px;" />
          <div>
            <h4 style="font-size:0.95rem; font-family:var(--font-serif); color:var(--text-dark);">${p.name}</h4>
            <p style="font-size:0.8rem; color:var(--accent-maroon); font-weight:700;">₹${p.price.toLocaleString('en-IN')}</p>
          </div>
        </div>
      `).join('');
    },

    executeSearch() {
      const val = document.getElementById('search-input').value;
      if (val && val.trim().length > 0) {
        app.state.filters.searchQuery = val.trim();
        app.ui.toggleSearch(false);
        window.location.hash = `#/shop`;
      }
    },

    handleImageError(img, fabricType, colorHex, badge) {
      img.onerror = null; // prevent infinite loops
      img.src = this.generateTextileDataUrl(fabricType, colorHex, badge);
    },

    generateTextileDataUrl(fabric, colorHex, badge) {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      // Base Gradient
      const grad = ctx.createLinearGradient(0, 0, 600, 800);
      grad.addColorStop(0, colorHex);
      grad.addColorStop(1, this.blendColor(colorHex, '#000000', 0.25));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 800);

      // Fine Weave Lines (warp and weft)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      
      // Vertical loom threads
      for(let x=0; x<600; x+=4) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 800);
        ctx.stroke();
      }
      
      // Horizontal loom threads
      ctx.strokeStyle = 'rgba(0,0,0,0.04)';
      for(let y=0; y<800; y+=4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(600, y);
        ctx.stroke();
      }

      // Special Silk/Chanderi Sheen
      if (fabric && (fabric.includes('Silk') || fabric.includes('Chanderi') || fabric.includes('Organza'))) {
        const sheen = ctx.createLinearGradient(0, 0, 600, 0);
        sheen.addColorStop(0, 'rgba(255,255,255,0)');
        sheen.addColorStop(0.3, 'rgba(255,255,255,0.08)');
        sheen.addColorStop(0.5, 'rgba(255,255,255,0.18)');
        sheen.addColorStop(0.7, 'rgba(255,255,255,0.08)');
        sheen.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sheen;
        ctx.fillRect(0, 0, 600, 800);
      }

      // Draw traditional border ornaments or handwork
      if (badge && (badge === 'Bestseller' || badge === 'Limited Edition' || badge.includes('Festive'))) {
        // Gold border
        ctx.strokeStyle = '#C8922A';
        ctx.lineWidth = 12;
        ctx.strokeRect(20, 20, 560, 760);
        
        // Fine inner gold line
        ctx.strokeStyle = '#FAF5EC';
        ctx.lineWidth = 2;
        ctx.strokeRect(32, 32, 536, 736);

        // Draw elegant floral motifs in corners
        this.drawGoldMotif(ctx, 50, 50);
        this.drawGoldMotif(ctx, 550, 50);
        this.drawGoldMotif(ctx, 50, 750);
        this.drawGoldMotif(ctx, 550, 750);
      } else {
        // Simple organic soft frame
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 580, 780);
      }

      // Sheer Organza look (translucent diagonal waves)
      if (fabric && (fabric.includes('Organza') || fabric.includes('sheer'))) {
        ctx.fillStyle = 'rgba(250,245,238,0.15)';
        ctx.beginPath();
        ctx.moveTo(0, 300);
        ctx.bezierCurveTo(200, 200, 400, 400, 600, 300);
        ctx.lineTo(600, 800);
        ctx.lineTo(0, 800);
        ctx.closePath();
        ctx.fill();
      }

      return canvas.toDataURL('image/jpeg');
    },

    blendColor(color1, color2, weight) {
      const c1 = this.hexToRgb(color1);
      const c2 = this.hexToRgb(color2);
      const r = Math.round(c1.r * (1 - weight) + c2.r * weight);
      const g = Math.round(c1.g * (1 - weight) + c2.g * weight);
      const b = Math.round(c1.b * (1 - weight) + c2.b * weight);
      return `rgb(${r}, ${g}, ${b})`;
    },

    hexToRgb(hex) {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    },

    drawGoldMotif(ctx, cx, cy) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#C8922A';
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.ellipse(0, 10, 4, 8, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FAF5EC';
      ctx.fill();
      ctx.restore();
    }
  },

  // ---------------------------------------------------------------------------
  // 7. Shopping Cart State Integrator
  // ---------------------------------------------------------------------------
  cart: {
    add(productId, size, colorName, fabricName, quantity = 1) {
      const product = app.state.products.find(p => p.id === productId);
      if (!product) return;

      // Find selected color hex
      const colorObj = product.colors.find(c => c.name === colorName) || product.colors[0];

      // Check if duplicate variation exists
      const existing = app.state.cart.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === colorName &&
        item.fabric === fabricName
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        app.state.cart.push({
          id: productId,
          name: product.name,
          price: product.price,
          image: colorObj.images[0],
          size: size,
          color: colorName,
          fabric: fabricName,
          quantity: quantity
        });
      }

      app.saveState();
      app.ui.updateCounters();
      app.ui.toggleCart(true); // slides cart drawer open!
    },

    updateQty(index, change) {
      if (index < 0 || index >= app.state.cart.length) return;
      app.state.cart[index].quantity += change;
      
      if (app.state.cart[index].quantity <= 0) {
        app.state.cart.splice(index, 1);
      }

      app.saveState();
      app.ui.updateCounters();
      this.render();
    },

    remove(index) {
      if (index < 0 || index >= app.state.cart.length) return;
      app.state.cart.splice(index, 1);
      app.saveState();
      app.ui.updateCounters();
      this.render();
    },

    getSubtotal() {
      return app.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    render() {
      const container = document.getElementById('cart-items-container');
      const footer = document.getElementById('cart-footer-block');

      if (app.state.cart.length === 0) {
        container.innerHTML = `
          <div class="cart-empty-state">
            <span class="cart-empty-icon">🪡</span>
            <p style="font-family: var(--font-serif); font-size:1.2rem; color:var(--text-dark);">Your shopping bag is empty</p>
            <p style="font-size:0.85rem; max-width: 250px; text-align:center;">Fill it with Hemlata's gorgeous handcrafted designs.</p>
            <a href="#/shop" class="btn btn-secondary btn-sm" onclick="app.ui.toggleCart(false)" style="margin-top: 1rem; padding: 0.5rem 1.5rem;">Explore Shop</a>
          </div>
        `;
        footer.style.display = 'none';
        return;
      }

      footer.style.display = 'block';
      const subtotal = this.getSubtotal();
      // GST is inclusive in pricing (12% standard apparel tax on boutique items >1000)
      const gst = Math.round(subtotal - (subtotal / 1.12));

      document.getElementById('cart-subtotal').innerText = `₹${subtotal.toLocaleString('en-IN')}`;
      document.getElementById('cart-gst').innerText = `₹${gst.toLocaleString('en-IN')}`;

      container.innerHTML = `
        <div class="cart-items-list">
          ${app.state.cart.map((item, idx) => `
            <div class="cart-item">
              <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
              <div class="cart-item-details">
                <div>
                  <h4 class="cart-item-title">${app.escapeHtml(item.name)}</h4>
                  <div class="cart-item-meta">
                    <span>Size: <strong>${app.escapeHtml(item.size)}</strong></span> | 
                    <span>Color: <strong>${app.escapeHtml(item.color)}</strong></span><br/>
                    <span>Fabric: <strong>${app.escapeHtml(item.fabric)}</strong></span>
                  </div>
                </div>
                <div class="cart-item-price-row">
                  <div class="cart-item-qty">
                    <button class="qty-btn" onclick="app.cart.updateQty(${idx}, -1)">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="app.cart.updateQty(${idx}, 1)">+</button>
                  </div>
                  <span style="font-weight:700; color:var(--accent-maroon);">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  <button class="qty-btn" onclick="app.cart.remove(${idx})" style="border:none; margin-left:0.5rem; color:#d32f2f;" title="Remove Item">✕</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    },

    // Abandoned Cart Core Logic
    onWindowBlur() {
      // If user leaves the page, and has items in cart, schedule cart recovery banner
      if (app.state.cart.length > 0 && !app.state.abandonedCartTriggered) {
        this.abandonedTimer = setTimeout(() => {
          app.state.abandonedCartTriggered = true;
          console.log("Abandoned cart triggered! Awaiting user focus to show offer.");
        }, 15000); // 15 seconds tab blur triggers it
      }
    },

    onWindowFocus() {
      if (this.abandonedTimer) {
        clearTimeout(this.abandonedTimer);
      }
      
      // If user comes back after triggering, show the gorgeous recovery top marquee
      if (app.state.abandonedCartTriggered && app.state.cart.length > 0) {
        const banner = document.getElementById('abandoned-cart-banner');
        if (banner) {
          banner.classList.add('active');
        }
      }
    },

    closeAbandonedBanner() {
      const banner = document.getElementById('abandoned-cart-banner');
      if (banner) {
        banner.classList.remove('active');
      }
    }
  },

  // ---------------------------------------------------------------------------
  // 8. Wishlist Integrator
  // ---------------------------------------------------------------------------
  wishlist: {
    toggle(productId) {
      const index = app.state.wishlist.indexOf(productId);
      if (index > -1) {
        app.state.wishlist.splice(index, 1);
        console.log(`Removed ${productId} from wishlist.`);
      } else {
        app.state.wishlist.push(productId);
        console.log(`Added ${productId} to wishlist.`);
      }
      app.saveState();
      app.ui.updateCounters();
      
      // Trigger dynamic detail or shop likes buttons re-render
      const detailsLike = document.getElementById('details-like-btn');
      if (detailsLike) {
        const isLiked = app.state.wishlist.includes(productId);
        detailsLike.classList.toggle('liked', isLiked);
        detailsLike.innerHTML = isLiked ? '❤️ In Wishlist' : '🤍 Add to Wishlist';
      }
    },

    render() {
      const container = document.getElementById('wishlist-items-container');
      if (app.state.wishlist.length === 0) {
        container.innerHTML = `
          <div class="cart-empty-state">
            <span class="cart-empty-icon" style="color: var(--accent-blush)">❤️</span>
            <p style="font-family: var(--font-serif); font-size:1.2rem; color:var(--text-dark);">Your wishlist is empty</p>
            <p style="font-size:0.85rem; max-width:250px; text-align:center;">Star your favorite boutique collections to review them here.</p>
            <a href="#/shop" class="btn btn-secondary btn-sm" onclick="app.ui.toggleWishlist(false)" style="margin-top: 1rem; padding: 0.5rem 1.5rem;">Shop Now</a>
          </div>
        `;
        return;
      }

      const starredItems = app.state.products.filter(p => app.state.wishlist.includes(p.id));

      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          ${starredItems.map(item => `
            <div style="display:flex; gap:1rem; padding-bottom: 1.25rem; border-bottom:1px dashed var(--border-gold); align-items:center;">
              <img src="${item.colors[0].images[0]}" alt="${item.name}" style="width:60px; height:80px; object-fit:cover; border-radius:var(--radius-sm);" />
              <div style="flex:1;">
                <h4 style="font-family:var(--font-serif); font-size:1rem; color:var(--text-dark); margin-bottom:0.25rem;">${item.name}</h4>
                <p style="font-size:0.88rem; font-weight:700; color:var(--accent-maroon); margin-bottom:0.5rem;">₹${item.price.toLocaleString('en-IN')}</p>
                <div style="display:flex; gap:0.5rem;">
                  <button class="btn btn-primary" onclick="window.location.hash='#/product/${item.id}'; app.ui.toggleWishlist(false);" style="padding:0.3rem 0.8rem; font-size:0.65rem; letter-spacing:0.05em;">View</button>
                  <button class="btn btn-secondary" onclick="app.wishlist.toggle('${item.id}'); app.wishlist.render();" style="padding:0.3rem 0.8rem; font-size:0.65rem; border-color:var(--border-gold); color:var(--text-muted); letter-spacing:0.05em;">Remove</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  },

  // ---------------------------------------------------------------------------
  // 9. Pincode and Delivery Checker Engine
  // ---------------------------------------------------------------------------
  delivery: {
    check(pincode) {
      const pinStr = pincode.toString().trim();
      const resultBox = document.getElementById('pincode-result-box');
      
      if (!pinStr || pinStr.length !== 6 || isNaN(Number(pinStr))) {
        resultBox.innerHTML = `
          <div class="pincode-result pincode-fail">
            <span>❌</span>
            <span>Please enter a valid 6-digit Indian pincode.</span>
          </div>
        `;
        return;
      }

      // Check specific local zone: Siddharthnagar
      if (pinStr === '272207') {
        resultBox.innerHTML = `
          <div class="pincode-result pincode-success">
            <span>🚀</span>
            <span><strong>Boutique Delivery Hub (Siddharthnagar)!</strong> next-day hand-delivery by our local courier. Cash on Delivery (COD) is supported.</span>
          </div>
        `;
        return;
      }

      // Standard Indian Pin algorithm check
      const firstDigit = pinStr[0];
      if (['1','2','3','4','5','6','7','8'].includes(firstDigit)) {
        resultBox.innerHTML = `
          <div class="pincode-result pincode-success">
            <span>✅</span>
            <span><strong>Eligible for Delivery!</strong> Standard shipping (3–5 business days via IndiaPost/Bluedart Express). Cash on Delivery supported.</span>
          </div>
        `;
      } else {
        resultBox.innerHTML = `
          <div class="pincode-result pincode-fail">
            <span>⚠️</span>
            <span>Area is currently outside standard express delivery zones. Custom orders might incur surcharge.</span>
          </div>
        `;
      }
    }
  },

  // ---------------------------------------------------------------------------
  // 10. Multi-Step Checkout Modal & Order Processing Gateway
  // ---------------------------------------------------------------------------
  checkout: {
    openCheckout() {
      if (app.state.cart.length === 0) {
        alert("Please add some items to your cart before proceeding.");
        return;
      }
      app.ui.toggleCart(false);
      document.getElementById('checkout-modal').classList.add('active');
      app.state.checkoutStep = 1;
      this.renderStep();
    },

    closeCheckout() {
      document.getElementById('checkout-modal').classList.remove('active');
    },

    setStep(step) {
      app.state.checkoutStep = step;
      this.renderStep();
    },

    renderStep() {
      // Highlight wizard tab header
      const tabs = [1, 2, 3];
      tabs.forEach(t => {
        const element = document.getElementById(`step-tab-${t}`);
        if (t === app.state.checkoutStep) {
          element.classList.add('active');
        } else {
          element.classList.remove('active');
        }
      });

      const wizardBody = document.getElementById('checkout-wizard-body');
      const subtotal = app.cart.getSubtotal();

      if (app.state.checkoutStep === 1) {
        // Step 1: Shipping Address Form
        wizardBody.innerHTML = `
          <h3 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--accent-maroon); margin-bottom:1.5rem; text-align:center;">Shipping & Custom Adjustments</h3>
          <div class="grid-2" style="margin-bottom:1.25rem; gap:1.25rem 1rem;">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" id="co-name" class="form-input" placeholder="e.g. Aditi Sharma" value="${app.state.checkoutData.name}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Phone Contact *</label>
              <input type="tel" id="co-phone" class="form-input" placeholder="e.g. +91 98765 43210" value="${app.state.checkoutData.phone}" required />
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Email Address *</label>
              <input type="email" id="co-email" class="form-input" placeholder="e.g. aditi@gmail.com" value="${app.state.checkoutData.email}" required />
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Delivery Address *</label>
              <textarea id="co-address" class="form-input" rows="3" placeholder="Apartment, Street name, City details..." required style="resize:none;">${app.state.checkoutData.address}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Pincode (6-digit) *</label>
              <input type="text" id="co-pincode" class="form-input" placeholder="e.g. 272207" value="${app.state.checkoutData.pincode}" maxlength="6" required />
            </div>
            <div class="form-group">
              <label class="form-label">Custom Tailoring Notes (Optional)</label>
              <input type="text" id="co-notes" class="form-input" placeholder="e.g. customize sleeve length to 15 inches" />
            </div>
          </div>
          
          <div style="display:flex; justify-content:space-between; margin-top:2rem; border-top:1px solid var(--border-gold); padding-top:1.5rem;">
            <button class="btn btn-secondary" onclick="app.checkout.closeCheckout()">Cancel</button>
            <button class="btn btn-primary" onclick="app.checkout.processShippingForm()">Proceed to Payment</button>
          </div>
        `;
      } else if (app.state.checkoutStep === 2) {
        // Step 2: Payment options
        wizardBody.innerHTML = `
          <h3 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--accent-maroon); margin-bottom:1rem; text-align:center;">Select Payment Option</h3>
          <p style="font-size:0.88rem; color:var(--text-muted); text-align:center; margin-bottom:2rem;">Your order of <strong>₹${subtotal.toLocaleString('en-IN')}</strong> includes GST. Choose a gateway:</p>
          
          <div class="checkout-payment-options">
            <div class="payment-card ${app.state.checkoutData.paymentMethod === 'razorpay' ? 'active' : ''}" onclick="app.checkout.setPaymentMethod('razorpay')">
              <div class="payment-card-icon">💳</div>
              <div class="payment-card-title">Razorpay / Card</div>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem;">All cards & Netbanking supported</p>
            </div>
            <div class="payment-card ${app.state.checkoutData.paymentMethod === 'upi' ? 'active' : ''}" onclick="app.checkout.setPaymentMethod('upi')">
              <div class="payment-card-icon">📱</div>
              <div class="payment-card-title">UPI / PhonePe / GPay</div>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem;">Instant scan QR generation</p>
            </div>
            <div class="payment-card ${app.state.checkoutData.paymentMethod === 'cod' ? 'active' : ''}" onclick="app.checkout.setPaymentMethod('cod')">
              <div class="payment-card-icon">💵</div>
              <div class="payment-card-title">Cash On Delivery</div>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem;">Pay at your doorstep</p>
            </div>
          </div>

          <div id="payment-gateway-workspace" style="margin-top:2rem; background-color:var(--white); border:1px solid var(--border-gold); padding:1.5rem; border-radius:var(--radius-md);">
            <!-- Dynamic workspace of active card -->
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:2rem; border-top:1px solid var(--border-gold); padding-top:1.5rem;">
            <button class="btn btn-secondary" onclick="app.checkout.setStep(1)">Back</button>
            <button class="btn btn-primary" onclick="app.checkout.submitOrder()">Confirm & Complete Order</button>
          </div>
        `;
        this.renderPaymentWorkspace();
      } else if (app.state.checkoutStep === 3) {
        // Step 3: Success Confirmation & Invoice
        const orderNo = 'ZJ-' + Math.floor(100000 + Math.random() * 900000);
        const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        const gstVal = Math.round(subtotal - (subtotal / 1.12));

        wizardBody.innerHTML = `
          <div class="invoice-success-panel">
            <div class="success-checkmark">🌿</div>
            <h3 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--accent-maroon);">Order Placed With Grace!</h3>
            <p style="font-size:0.95rem; color:var(--text-muted); margin-top:0.5rem;">Hemlata and our artisan looms are starting on your bespoke garment.</p>
            
            <!-- Complete WooCommerce Printable Invoice Mock -->
            <div class="invoice-box" id="printable-invoice">
              <div class="invoice-header-block">
                <div>
                  <h4 style="font-family:var(--font-serif); font-size:1.4rem; color:var(--accent-maroon);">Zenjal Boutique</h4>
                  <p style="font-size:0.75rem; color:var(--text-muted);">Siddharthnagar, UP, India - 272207</p>
                </div>
                <div style="text-align:right;">
                  <h4 style="font-size:0.9rem; color:var(--text-dark);">INVOICE</h4>
                  <p style="font-size:0.8rem; font-weight:700;">No: ${orderNo}</p>
                  <p style="font-size:0.72rem; color:var(--text-muted);">${dateStr}</p>
                </div>
              </div>

              <div style="margin-bottom:1rem;">
                <p style="font-size:0.78rem; font-weight:700; color:var(--text-dark); margin-bottom:0.25rem;">Billed To:</p>
                <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">
                  <strong>${app.state.checkoutData.name}</strong><br/>
                  ${app.state.checkoutData.address}, Pincode: ${app.state.checkoutData.pincode}<br/>
                  Phone: ${app.state.checkoutData.phone} | Email: ${app.state.checkoutData.email}
                </p>
              </div>

              <table style="width:100%; font-size:0.85rem; border-collapse:collapse; margin-bottom:1rem;">
                <thead>
                  <tr style="border-bottom:1px solid var(--border-gold); font-weight:700; color:var(--accent-maroon); text-align:left;">
                    <th style="padding:0.4rem 0;">Item Description</th>
                    <th style="padding:0.4rem 0; text-align:center;">Qty</th>
                    <th style="padding:0.4rem 0; text-align:right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${app.state.cart.map(item => `
                    <tr style="border-bottom:1px dashed rgba(200, 146, 42, 0.15);">
                      <td style="padding:0.5rem 0;">
                        <strong>${item.name}</strong><br/>
                        <span style="font-size:0.75rem; color:var(--text-muted);">Size: ${item.size} | Color: ${item.color} | Fabric: ${item.fabric}</span>
                      </td>
                      <td style="padding:0.5rem 0; text-align:center;">${item.quantity}</td>
                      <td style="padding:0.5rem 0; text-align:right; font-weight:600;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="invoice-divider"></div>
              
              <div class="invoice-row">
                <span>Subtotal</span>
                <span>₹${subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div class="invoice-row" style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">
                <span>Includes 12% GST</span>
                <span>₹${gstVal.toLocaleString('en-IN')}</span>
              </div>
              <div class="invoice-row">
                <span>Shipping & Delivery Charges</span>
                <span style="color:#2e7d32; font-weight:700;">FREE</span>
              </div>
              <div class="invoice-divider"></div>
              <div class="invoice-row" style="font-weight:700; font-size:1.1rem; color:var(--accent-maroon);">
                <span>Grand Total</span>
                <span>₹${subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div style="margin-top:1.5rem; text-align:center; font-size:0.75rem; color:var(--text-muted); font-style:italic;">
                🌿 Thank you for supporting organic local artisan craft. Made with love in India. 🇮🇳
              </div>
            </div>

            <div style="display:flex; justify-content:center; gap:1rem;">
              <button class="btn btn-secondary" onclick="window.print()" style="padding:0.6rem 1.5rem;">🖨️ Print Invoice</button>
              <button class="btn btn-primary" onclick="app.checkout.clearAndFinish()" style="padding:0.6rem 2rem;">Return to boutique</button>
            </div>
          </div>
        `;
      }
    },

    processShippingForm() {
      const name = document.getElementById('co-name').value;
      const phone = document.getElementById('co-phone').value;
      const email = document.getElementById('co-email').value;
      const address = document.getElementById('co-address').value;
      const pincode = document.getElementById('co-pincode').value;

      if (!name || !phone || !email || !address || !pincode) {
        alert("Please fill in all the required (*) shipping details.");
        return;
      }
      if (pincode.length !== 6 || isNaN(Number(pincode))) {
        alert("Please enter a valid 6-digit delivery pincode.");
        return;
      }

      app.state.checkoutData.name = name;
      app.state.checkoutData.phone = phone;
      app.state.checkoutData.email = email;
      app.state.checkoutData.address = address;
      app.state.checkoutData.pincode = pincode;

      app.state.checkoutStep = 2;
      this.renderStep();
    },

    setPaymentMethod(method) {
      app.state.checkoutData.paymentMethod = method;
      this.renderStep();
    },

    renderPaymentWorkspace() {
      const workspace = document.getElementById('payment-gateway-workspace');
      const method = app.state.checkoutData.paymentMethod;

      if (method === 'razorpay') {
        workspace.innerHTML = `
          <h4 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--accent-maroon); margin-bottom:1rem;">Simulated Razorpay Secure Gateway</h4>
          <div class="grid-2" style="gap:1rem; margin-bottom:1rem;">
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label" style="font-size:0.75rem;">Card Number</label>
              <input type="text" class="form-input" placeholder="4111 2222 3333 4444" maxlength="19" required />
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Expiry Date</label>
              <input type="text" class="form-input" placeholder="MM/YY" maxlength="5" required />
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">CVV / Security Pin</label>
              <input type="password" class="form-input" placeholder="•••" maxlength="3" required />
            </div>
          </div>
          <p style="font-size:0.75rem; color:#2e7d32; display:flex; align-items:center; gap:0.25rem;">
            🛡️ PCI-DSS compliant. Secure bank checkout simulator active.
          </p>
        `;
      } else if (method === 'upi') {
        workspace.innerHTML = `
          <h4 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--accent-maroon); margin-bottom:0.75rem; text-align:center;">Instant UPI QR Scanner</h4>
          <p style="font-size:0.8rem; color:var(--text-muted); text-align:center; margin-bottom:1.25rem;">Scan using PhonePe, GPay, Paytm, or BHIM apps</p>
          
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem;">
            <!-- UPI Mock QR Code SVG -->
            <div style="background-color:#fff; padding:1.25rem; border:1px solid var(--border-gold); border-radius:var(--radius-sm); width:180px; height:180px; display:flex; align-items:center; justify-content:center;">
              <svg width="140" height="140" viewBox="0 0 100 100" fill="var(--accent-maroon)">
                <!-- Corner anchors -->
                <rect x="0" y="0" width="25" height="25" fill="none" stroke="currentColor" stroke-width="6"/>
                <rect x="5" y="5" width="15" height="15"/>
                <rect x="75" y="0" width="25" height="25" fill="none" stroke="currentColor" stroke-width="6"/>
                <rect x="80" y="5" width="15" height="15"/>
                <rect x="0" y="75" width="25" height="25" fill="none" stroke="currentColor" stroke-width="6"/>
                <rect x="5" y="80" width="15" height="15"/>
                <!-- Matrix noise simulation -->
                <rect x="35" y="10" width="10" height="15"/>
                <rect x="55" y="0" width="10" height="10"/>
                <rect x="35" y="35" width="30" height="30"/>
                <rect x="10" y="35" width="15" height="10"/>
                <rect x="75" y="45" width="15" height="15"/>
                <rect x="45" y="75" width="20" height="10"/>
                <rect x="75" y="75" width="10" height="25"/>
              </svg>
            </div>
            <span style="font-family:var(--font-serif); font-style:italic; font-size:0.85rem; color:var(--text-muted);">Pay to merchant: <strong>zenjal@upi</strong></span>
          </div>
        `;
      } else if (method === 'cod') {
        workspace.innerHTML = `
          <h4 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--accent-maroon); margin-bottom:0.5rem;">Cash On Delivery (COD)</h4>
          <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
            You will pay the full amount of <strong>₹${app.cart.getSubtotal().toLocaleString('en-IN')}</strong> in cash or via local UPI scanner to our delivery executive when your parcel arrives.
          </p>
          <div style="margin-top:1rem; background-color:var(--accent-blush-light); padding:0.75rem; border-radius:3px; font-size:0.8rem; color:var(--accent-maroon); font-weight:500;">
            📦 Available across all major pincodes! Please keep change handy.
          </div>
        `;
      }
    },

    submitOrder() {
      // Simulate small payment gateway delay
      const body = document.getElementById('checkout-wizard-body');
      body.innerHTML = `
        <div style="text-align:center; padding:5rem 0; font-family:var(--font-serif);">
          <div style="font-size:3rem; margin-bottom:1.5rem; animation: logo-float 2s infinite;">🪡</div>
          <h3 style="font-size:1.5rem; color:var(--accent-maroon);">Verifying Payment Gateway Transaction...</h3>
          <p style="font-size:0.9rem; color:var(--text-muted); margin-top:0.5rem;">Securing your boutique transaction. Please do not close this overlay...</p>
        </div>
      `;

      setTimeout(() => {
        app.state.checkoutStep = 3;
        app.cart.closeAbandonedBanner();
        this.renderStep();
      }, 2000);
    },

    clearAndFinish() {
      app.state.cart = [];
      app.saveState();
      app.ui.updateCounters();
      this.closeCheckout();
      window.location.hash = '#/';
    }
  },

  // ---------------------------------------------------------------------------
  // 11. View Renderers Engine
  // ---------------------------------------------------------------------------
  render: {
    home(container) {
      // Setup hero slides
      const heroSlides = [
        { image: 'images/hero_slide_1.jpg', tagline: 'Chanderi & Silk Edits', desc: 'Handloomed details, stitched with patience.' },
        { image: 'images/hero_slide_2.jpg', tagline: 'Royal Varanasi Sarees', desc: 'Bespoke heritage wraps for cultural elegance.' },
        { image: 'images/hero_slide_3.jpg', tagline: 'Wedding & Festive edits', desc: 'Capturing natural light in pastel palettes.' }
      ];

      // Get bestselling featured products
      const featured = app.state.products.slice(0, 4);

      container.innerHTML = `
        <!-- Hero Section -->
        <section class="hero" aria-label="Zenjal Hero Collections">
          <div class="hero-slider-container">
            <div class="hero-slide active" style="background-image: url('${heroSlides[0].image}');"></div>
            <div class="hero-overlay"></div>
          </div>
          <div class="hero-container">
            <div class="hero-content">
              <span class="eyebrow" style="color: var(--primary-gold-light); font-weight: 700;">Where Tradition Meets Grace</span>
              <h1>Crafting <em>Indian Elegance</em> with Soul</h1>
              <p>Explore gorgeous, bespoke festive edits customized to fit your natural form.</p>
              <div style="display:flex; gap:1rem;">
                <a href="#/shop" class="btn btn-gold">Explore Shop</a>
                <a href="#/collections" class="btn btn-secondary" style="border-color:var(--white); color:var(--white);">Our Edits</a>
              </div>
            </div>
          </div>
        </section>

        <!-- Featured Collections Grid -->
        <section class="section-padding container">
          <div class="text-center">
            <span class="eyebrow">Visual Campaigns</span>
            <h2 class="section-title">Shop by Collections</h2>
            <div class="luxury-divider"><span>✦</span></div>
            <p class="section-desc">Handpicked motifs and curated fabrics tailored by Hemlata.</p>
          </div>
          
          <div class="collection-grid">
            <div class="collection-card col-span-3">
              <img src="images/coll_kurta.jpg" alt="Kurta Sets collection" />
              <div class="collection-card-overlay">
                <h3 class="collection-card-title">Kurta Sets</h3>
                <a href="#/shop?category=Kurta+Sets" class="collection-card-link">Explore Sets <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </div>
            </div>
            <div class="collection-card col-span-3">
              <img src="images/coll_saree.jpg" alt="Varanasi Sarees collection" />
              <div class="collection-card-overlay">
                <h3 class="collection-card-title">Sarees</h3>
                <a href="#/shop?category=Sarees" class="collection-card-link">Explore Sarees <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </div>
            </div>
            <div class="collection-card col-span-2">
              <img src="images/coll_lehenga.jpg" alt="Festive Lehengas collection" />
              <div class="collection-card-overlay">
                <h3 class="collection-card-title">Lehengas</h3>
                <a href="#/shop?category=Lehengas" class="collection-card-link">Explore Lehengas <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </div>
            </div>
            <div class="collection-card col-span-2">
              <img src="images/coll_dupatta.jpg" alt="Sheer Dupattas collection" />
              <div class="collection-card-overlay">
                <h3 class="collection-card-title">Dupattas</h3>
                <a href="#/shop?category=Dupattas" class="collection-card-link">Explore Dupattas <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </div>
            </div>
            <div class="collection-card col-span-2">
              <img src="images/coll_festive.jpg" alt="Festive Summer Edit campaign" />
              <div class="collection-card-overlay">
                <h3 class="collection-card-title">Festive Edit</h3>
                <a href="#/shop?tag=Festive+Edit" class="collection-card-link">Explore Edit <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              </div>
            </div>
          </div>
        </section>

        <!-- Featured Products -->
        <section class="section-padding" style="background-color: var(--white); border-top: 1px solid var(--border-gold); border-bottom: 1px solid var(--border-gold);">
          <div class="container">
            <div class="text-center">
              <span class="eyebrow">Handcrafted Essentials</span>
              <h2 class="section-title">The Bestsellers</h2>
              <div class="luxury-divider"><span>✦</span></div>
            </div>
            
            <div class="grid-4" style="margin-top:2rem;">
              ${featured.map(p => {
                const isLiked = app.state.wishlist.includes(p.id);
                return `
                  <div class="product-card">
                    <div class="product-card-img-wrap" onclick="window.location.hash='#/product/${p.id}'" style="cursor:pointer;">
                      <img src="${p.colors[0].images[0]}" alt="${p.name}" class="product-card-img" onerror="app.ui.handleImageError(this, '${p.fabric}', '${p.colors[0].hex}', '${p.badge}')" />
                      ${p.badge ? `<span class="product-card-badge badge badge-new">${p.badge}</span>` : ''}
                    </div>
                    <button class="wishlist-heart-btn ${isLiked ? 'liked' : ''}" onclick="app.wishlist.toggle('${p.id}'); this.classList.toggle('liked');" aria-label="Add to Wishlist">
                      ${isLiked ? '❤️' : '🤍'}
                    </button>
                    <div class="product-card-info">
                      <div>
                        <span style="font-size:0.75rem; color:var(--primary-gold); font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">${p.category}</span>
                        <h3 class="product-card-title" onclick="window.location.hash='#/product/${p.id}'" style="cursor:pointer;">${p.name}</h3>
                        <div class="product-card-rating">
                          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
                          <span class="product-card-rating-num">(${p.reviewsCount})</span>
                        </div>
                      </div>
                      <div class="product-card-bottom">
                        <div class="product-price-block">
                          <span class="price-regular">₹${p.price.toLocaleString('en-IN')}</span>
                          <span class="price-original">₹${p.originalPrice.toLocaleString('en-IN')}</span>
                          <span class="price-gst">incl. of all taxes</span>
                        </div>
                        <a href="#/product/${p.id}" class="product-card-action">View <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- Brand Story Snippet -->
        <section class="section-padding story-snippet">
          <div class="container story-grid">
            <div class="story-img-wrap">
              <img src="images/boutique_store.jpg" alt="Designer Hemlata at Zenjal Boutique" class="story-img" />
              <div class="story-img-frame"></div>
            </div>
            <div>
              <span class="eyebrow">Our Courtyard Journey</span>
              <h2 class="page-title" style="font-size: 2.5rem; margin-bottom:1rem;">Stitched with pure devotion in Siddharthnagar</h2>
              <p class="story-tagline">"Fabric carries energy. We make sure ours reflects grace."</p>
              <p class="story-quote">
                "Welcome to Zenjal—a boutique designed to translate beautiful traditional textiles into comfortable, breathable art fitting your exact shape."
              </p>
              <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.7; margin-bottom:2rem;">
                Founded by Hemlata in Uttar Pradesh, Zenjal integrates years of expert custom tailoring with heritage block prints, pure chanderi weaves, and Varanasi silks. Each purchase connects you directly to local master looms and local tailor communities.
              </p>
              <a href="#/about" class="btn btn-primary">Our Full Journey</a>
            </div>
          </div>
        </section>

        <!-- Dynamic Testimonials Section -->
        <section class="section-padding" style="background-color: var(--bg-ivory-dark);">
          <div class="container">
            <div class="text-center">
              <span class="eyebrow">Parivaar Voices</span>
              <h2 class="section-title">Words from our Community</h2>
              <div class="luxury-divider"><span>✦</span></div>
            </div>
            
            <div class="grid-3" style="margin-top:2rem;">
              <div style="background-color:var(--white); padding:2.5rem; border-radius:var(--radius-md); border:1px solid var(--border-gold); text-align:center;">
                <div class="stars" style="margin-bottom:1rem;">★★★★★</div>
                <p style="font-family:var(--font-serif); font-style:italic; color:var(--text-muted); font-size:1.05rem; line-height:1.6; margin-bottom:1.5rem;">
                  "Hemlataji stitched my sister's wedding lehenga. The zardozi details are so authentic, and she adjusted all fit panels remotely over WhatsApp! Absolutely seamless experience."
                </p>
                <strong style="display:block; font-size:0.9rem; color:var(--text-dark);">Priya S.</strong>
                <span style="font-size:0.75rem; color:var(--primary-gold); font-weight:700; text-transform:uppercase;">Siddharthnagar, UP</span>
              </div>
              <div style="background-color:var(--white); padding:2.5rem; border-radius:var(--radius-md); border:1px solid var(--border-gold); text-align:center;">
                <div class="stars" style="margin-bottom:1rem;">★★★★★</div>
                <p style="font-family:var(--font-serif); font-style:italic; color:var(--text-muted); font-size:1.05rem; line-height:1.6; margin-bottom:1.5rem;">
                  "The marigold Chanderi set drapes so beautifully! It has a premium lining of soft cotton mulmul which is incredibly cool under warm lights. Highly recommend."
                </p>
                <strong style="display:block; font-size:0.9rem; color:var(--text-dark);">Aditi K.</strong>
                <span style="font-size:0.75rem; color:var(--primary-gold); font-weight:700; text-transform:uppercase;">London, NRI diaspora</span>
              </div>
              <div style="background-color:var(--white); padding:2.5rem; border-radius:var(--radius-md); border:1px solid var(--border-gold); text-align:center;">
                <div class="stars" style="margin-bottom:1rem;">★★★★★</div>
                <p style="font-family:var(--font-serif); font-style:italic; color:var(--text-muted); font-size:1.05rem; line-height:1.6; margin-bottom:1.5rem;">
                  "Extremely fast courier delivery to Bangalore. I entered my postcode, ordered COD, and got the Katan silk saree within 4 days. Drapes like a dream!"
                </p>
                <strong style="display:block; font-size:0.9rem; color:var(--text-dark);">Meera D.</strong>
                <span style="font-size:0.75rem; color:var(--primary-gold); font-weight:700; text-transform:uppercase;">Bangalore, Urban Shopper</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Simulated Instagram Feed -->
        <section class="section-padding container">
          <div class="text-center">
            <span class="eyebrow">Social Journal</span>
            <h2 class="section-title">Follow @Zenjal_Boutique</h2>
            <div class="luxury-divider"><span>✦</span></div>
            <p class="section-desc">Tag us wearing your handcrafted edits to get featured in our festive edits.</p>
          </div>
          
          <div class="insta-grid">
            <div class="insta-item">
              <img src="images/insta_1.jpg" alt="Boutique client in Chanderi sets" />
              <div class="insta-overlay">❤️ 412 | 💬 18</div>
            </div>
            <div class="insta-item">
              <img src="images/insta_2.jpg" alt="Varanasi silk sarees folding zoom details" />
              <div class="insta-overlay">❤️ 289 | 💬 9</div>
            </div>
            <div class="insta-item">
              <img src="images/insta_3.jpg" alt="Hands embroidering gota patti borders" />
              <div class="insta-overlay">❤️ 567 | 💬 31</div>
            </div>
            <div class="insta-item">
              <img src="images/insta_4.jpg" alt="Aesthetic setup of Indian boutique studio" />
              <div class="insta-overlay">❤️ 380 | 💬 12</div>
            </div>
            <div class="insta-item">
              <img src="images/insta_5.jpg" alt="Pastel pink wedding lehenga flatlay" />
              <div class="insta-overlay">❤️ 624 | 💬 22</div>
            </div>
          </div>
        </section>
      `;
    },

    shop(container) {
      const activeCat = app.state.filters.category;
      const activeColor = app.state.filters.color;
      const activeSize = app.state.filters.size;
      const activeFabric = app.state.filters.fabric;
      const maxPrice = app.state.filters.price;
      const searchQ = app.state.filters.searchQuery;

      // Filter Logic
      let filtered = app.state.products.filter(p => {
        const matchesCat = activeCat === 'All' || p.category === activeCat;
        const matchesPrice = p.price <= maxPrice;
        
        const matchesColor = activeColor === 'All' || p.colors.some(c => c.name === activeColor);
        const matchesSize = activeSize === 'All' || p.sizes.includes(activeSize) || p.sizes.includes("Free Size") || p.sizes.includes("One Size");
        const matchesFabric = activeFabric === 'All' || p.fabrics.includes(activeFabric) || p.fabric.toLowerCase().includes(activeFabric.toLowerCase());
        
        const matchesSearch = !searchQ || 
          p.name.toLowerCase().includes(searchQ.toLowerCase()) || 
          p.category.toLowerCase().includes(searchQ.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQ.toLowerCase())) ||
          p.shortDescription.toLowerCase().includes(searchQ.toLowerCase());

        return matchesCat && matchesPrice && matchesColor && matchesSize && matchesFabric && matchesSearch;
      });

      // Sorting Logic
      if (app.state.sorting === 'price-low') {
        filtered.sort((a,b) => a.price - b.price);
      } else if (app.state.sorting === 'price-high') {
        filtered.sort((a,b) => b.price - a.price);
      } else if (app.state.sorting === 'rating') {
        filtered.sort((a,b) => b.rating - a.rating);
      }

      // Categories counter map
      const cats = ['All', 'Kurta Sets', 'Sarees', 'Lehengas', 'Dupattas'];
      
      container.innerHTML = `
        <div class="container section-padding">
          <div class="breadcrumbs">
            <a href="#/">Home</a> / <span>Shop Catalogue</span>
          </div>

          <div class="shop-layout">
            <!-- Sidebar Filters Left -->
            <aside class="filters-sidebar">
              <!-- Categories -->
              <div class="filter-section">
                <h4 class="filter-title">Categories</h4>
                <ul class="filter-categories-list">
                  ${cats.map(c => {
                    const count = c === 'All' ? app.state.products.length : app.state.products.filter(p => p.category === c).length;
                    return `
                      <li class="filter-cat-link ${activeCat === c ? 'active' : ''}" onclick="app.render.setShopFilter('category', '${c}')">
                        <span>${c}</span>
                        <span class="filter-cat-count">${count}</span>
                      </li>
                    `;
                  }).join('')}
                </ul>
              </div>

              <!-- Price Filter -->
              <div class="filter-section">
                <h4 class="filter-title">Max Price</h4>
                <div class="price-slider-wrap">
                  <input type="range" min="1500" max="25000" step="500" value="${maxPrice}" class="price-slider" id="price-slider-ctrl" oninput="document.getElementById('price-val-label').innerText = '₹' + Number(this.value).toLocaleString('en-IN');" onchange="app.render.setShopFilter('price', this.value)" />
                  <div class="price-range-inputs">
                    <span>₹1,500</span>
                    <strong id="price-val-label" style="color:var(--accent-maroon);">₹${maxPrice.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <!-- Color Palette Filters -->
              <div class="filter-section">
                <h4 class="filter-title">Colors</h4>
                <div class="color-filters-grid">
                  <button class="color-filter-btn ${activeColor === 'All' ? 'active' : ''}" style="background-color: #e0e0e0;" onclick="app.render.setShopFilter('color', 'All')" title="All Colors"></button>
                  <button class="color-filter-btn ${activeColor === 'Deep Marigold Gold' ? 'active' : ''}" style="background-color: #C8922A;" onclick="app.render.setShopFilter('color', 'Deep Marigold Gold')" title="Deep Marigold Gold"></button>
                  <button class="color-filter-btn ${activeColor === 'Rich Maroon' ? 'active' : ''}" style="background-color: #7B1F2E;" onclick="app.render.setShopFilter('color', 'Rich Maroon')" title="Rich Maroon"></button>
                  <button class="color-filter-btn ${activeColor === 'Ivory White' ? 'active' : ''}" style="background-color: #FAF5EC;" onclick="app.render.setShopFilter('color', 'Ivory White')" title="Ivory White"></button>
                  <button class="color-filter-btn ${activeColor === 'Soft Blush' ? 'active' : ''}" style="background-color: #F2D5C4;" onclick="app.render.setShopFilter('color', 'Soft Blush')" title="Soft Blush"></button>
                </div>
              </div>

              <!-- Sizes list -->
              <div class="filter-section">
                <h4 class="filter-title">Available Sizes</h4>
                <div class="tags-filter-list">
                  <span class="filter-tag ${activeSize === 'All' ? 'active' : ''}" onclick="app.render.setShopFilter('size', 'All')">All</span>
                  <span class="filter-tag ${activeSize === 'XS' ? 'active' : ''}" onclick="app.render.setShopFilter('size', 'XS')">XS</span>
                  <span class="filter-tag ${activeSize === 'S' ? 'active' : ''}" onclick="app.render.setShopFilter('size', 'S')">S</span>
                  <span class="filter-tag ${activeSize === 'M' ? 'active' : ''}" onclick="app.render.setShopFilter('size', 'M')">M</span>
                  <span class="filter-tag ${activeSize === 'L' ? 'active' : ''}" onclick="app.render.setShopFilter('size', 'L')">L</span>
                  <span class="filter-tag ${activeSize === 'XL' ? 'active' : ''}" onclick="app.render.setShopFilter('size', 'XL')">XL</span>
                  <span class="filter-tag ${activeSize === 'XXL' ? 'active' : ''}" onclick="app.render.setShopFilter('size', 'XXL')">XXL</span>
                  <span class="filter-tag ${activeSize === '3XL' ? 'active' : ''}" onclick="app.render.setShopFilter('size', '3XL')">3XL</span>
                </div>
              </div>

              <!-- Fabrics list -->
              <div class="filter-section">
                <h4 class="filter-title">Fabric Weave</h4>
                <div class="tags-filter-list">
                  <span class="filter-tag ${activeFabric === 'All' ? 'active' : ''}" onclick="app.render.setShopFilter('fabric', 'All')">All Fabrics</span>
                  <span class="filter-tag ${activeFabric === 'Chanderi' ? 'active' : ''}" onclick="app.render.setShopFilter('fabric', 'Chanderi')">Chanderi Silk</span>
                  <span class="filter-tag ${activeFabric === 'Katan' ? 'active' : ''}" onclick="app.render.setShopFilter('fabric', 'Katan')">Katan Silk</span>
                  <span class="filter-tag ${activeFabric === 'Georgette' ? 'active' : ''}" onclick="app.render.setShopFilter('fabric', 'Georgette')">Georgette</span>
                  <span class="filter-tag ${activeFabric === 'Organza' ? 'active' : ''}" onclick="app.render.setShopFilter('fabric', 'Organza')">Organza</span>
                  <span class="filter-tag ${activeFabric === 'Cotton' ? 'active' : ''}" onclick="app.render.setShopFilter('fabric', 'Cotton')">Cambric Cotton</span>
                </div>
              </div>

              <!-- Reset btn -->
              <button class="btn btn-secondary btn-block" style="font-size:0.75rem; padding: 0.5rem 1rem;" onclick="app.render.clearShopFilters()">Reset All Filters</button>
            </aside>

            <!-- Product Display Area Right -->
            <div>
              <!-- Shop Header Controls -->
              <div class="shop-header-row">
                <div class="product-count">
                  Showing <strong>${filtered.length}</strong> luxurious styles 
                  ${searchQ ? `matching "<strong>${searchQ}</strong>"` : ''}
                  ${activeCat !== 'All' ? `in <em>${activeCat}</em>` : ''}
                </div>
                <div>
                  <select class="sort-select" onchange="app.render.setShopSort(this.value)">
                    <option value="default" ${app.state.sorting === 'default' ? 'selected' : ''}>Sort: Featured Drops</option>
                    <option value="price-low" ${app.state.sorting === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                    <option value="price-high" ${app.state.sorting === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                    <option value="rating" ${app.state.sorting === 'rating' ? 'selected' : ''}>Customer Rating</option>
                  </select>
                </div>
              </div>

              <!-- Active tags block -->
              ${searchQ ? `
                <div style="margin-bottom: 1.5rem; display:flex; gap:0.5rem; align-items:center;">
                  <span style="font-size:0.8rem; color:var(--text-muted);">Active Search:</span>
                  <span class="filter-tag active" style="font-size:0.7rem; padding: 0.2rem 0.6rem; display:inline-flex; align-items:center; gap:0.25rem;">
                    ${searchQ} <span onclick="app.render.setShopFilter('searchQuery', '')" style="cursor:pointer; font-weight:700;">✕</span>
                  </span>
                </div>
              ` : ''}

              <!-- Shop Grid -->
              ${filtered.length === 0 ? `
                <div style="text-align:center; padding: 5rem 0; font-family:var(--font-serif);">
                  <span style="font-size:3rem; display:block; margin-bottom:1rem;">🪡</span>
                  <h3 style="font-size:1.6rem; color:var(--accent-maroon);">No matching garments in our looms</h3>
                  <p style="color:var(--text-muted); margin-top:0.5rem; max-width:400px; margin-left:auto; margin-right:auto;">Try adjusting your size, color, or price filters to view other customized boutique models.</p>
                  <button class="btn btn-primary" onclick="app.render.clearShopFilters()" style="margin-top:1.5rem;">Show All Garments</button>
                </div>
              ` : `
                <div class="grid-3">
                  ${filtered.map(p => {
                    const isLiked = app.state.wishlist.includes(p.id);
                    return `
                      <div class="product-card">
                        <div class="product-card-img-wrap" onclick="window.location.hash='#/product/${p.id}'" style="cursor:pointer;">
                          <img src="${p.colors[0].images[0]}" alt="${p.name}" class="product-card-img" onerror="app.ui.handleImageError(this, '${p.fabric}', '${p.colors[0].hex}', '${p.badge}')" />
                          ${p.badge ? `<span class="product-card-badge badge badge-new">${p.badge}</span>` : ''}
                        </div>
                        <button class="wishlist-heart-btn ${isLiked ? 'liked' : ''}" onclick="app.wishlist.toggle('${p.id}'); this.classList.toggle('liked');" aria-label="Add to Wishlist">
                          ${isLiked ? '❤️' : '🤍'}
                        </button>
                        <div class="product-card-info">
                          <div>
                            <span style="font-size:0.75rem; color:var(--primary-gold); font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">${p.category}</span>
                            <h3 class="product-card-title" onclick="window.location.hash='#/product/${p.id}'" style="cursor:pointer;">${p.name}</h3>
                            <div class="product-card-rating">
                              <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
                              <span class="product-card-rating-num">(${p.reviewsCount})</span>
                            </div>
                          </div>
                          <div class="product-card-bottom">
                            <div class="product-price-block">
                              <span class="price-regular">₹${p.price.toLocaleString('en-IN')}</span>
                              <span class="price-original">₹${p.originalPrice.toLocaleString('en-IN')}</span>
                              <span class="price-gst">incl. of all taxes</span>
                            </div>
                            <a href="#/product/${p.id}" class="product-card-action">View <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    },

    setShopFilter(key, value) {
      app.state.filters[key] = value;
      app.router();
    },

    clearShopFilters() {
      app.state.filters = {
        category: 'All',
        price: 25000,
        color: 'All',
        size: 'All',
        fabric: 'All',
        searchQuery: ''
      };
      app.router();
    },

    setShopSort(value) {
      app.state.sorting = value;
      app.router();
    },

    productDetail(container, id) {
      const p = app.state.products.find(item => item.id === id);
      if (!p) {
        container.innerHTML = `
          <div class="container text-center section-padding" style="font-family: var(--font-serif);">
            <h2 class="page-title">Garment Not Found</h2>
            <a href="#/shop" class="btn btn-primary">Return to Shop</a>
          </div>
        `;
        return;
      }

      app.seo.update(`${p.name} | Zenjal Boutique Custom Tailoring`, p.shortDescription);

      // Default active selections
      let activeColor = p.colors[0];
      let activeSize = p.sizes[0] === "Free Size" || p.sizes[0] === "One Size" ? p.sizes[0] : 'M';
      let activeFabric = p.fabrics[0];

      // Related Products (same category, excluding current product)
      const related = app.state.products.filter(item => item.category === p.category && item.id !== p.id).slice(0, 3);
      const isLiked = app.state.wishlist.includes(p.id);

      container.innerHTML = `
        <div class="container section-padding">
          <div class="breadcrumbs">
            <a href="#/">Home</a> / <a href="#/shop">Shop</a> / <a href="#/shop?category=${encodeURIComponent(p.category)}">${p.category}</a> / <span>${p.name}</span>
          </div>

          <div class="product-detail-layout">
            <!-- Images Column Left -->
            <div class="product-gallery">
              <div class="product-main-img-wrap">
                <img id="main-product-image" src="${activeColor.images[0]}" alt="${p.name}" class="product-main-img" onerror="app.ui.handleImageError(this, '${p.fabric}', '${activeColor.hex}', '${p.badge}')" />
              </div>
              <div class="product-thumbs" id="product-gallery-thumbs">
                ${activeColor.images.map((img, idx) => `
                  <div class="product-thumb ${idx === 0 ? 'active' : ''}" onclick="app.render.swapProductDetailImage('${img}', this)">
                    <img src="${img}" alt="${p.name} view ${idx+1}" onerror="app.ui.handleImageError(this, '${p.fabric}', '${activeColor.hex}')" />
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Details Options Column Right -->
            <div class="product-details-content">
              <div class="product-badge-row">
                ${p.badge ? `<span class="badge badge-new">${p.badge}</span>` : ''}
                <span class="badge badge-bestseller" style="background-color: var(--accent-blush); color: var(--accent-maroon); margin-left:0.25rem;">GST Inclusive</span>
              </div>
              
              <h1 class="product-title">${p.name}</h1>
              
              <div class="product-rating-row">
                <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
                <span><strong>${p.rating} Stars</strong> (${p.reviewsCount} verified reviews)</span>
              </div>

              <div class="product-price-row">
                <span class="detail-price">₹${p.price.toLocaleString('en-IN')}</span>
                <span class="detail-price-original">₹${p.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <span class="detail-price-gst">Inclusive of all local Indian taxes & GST</span>

              <p class="product-desc">${p.shortDescription}</p>

              <!-- Color swatch selection -->
              <div class="variation-group">
                <span class="variation-label">Artisan Color Palette: <strong id="selected-color-name" style="color:var(--accent-maroon);">${activeColor.name}</strong></span>
                <div class="color-filters-grid">
                  ${p.colors.map(c => `
                    <button class="color-filter-btn ${c.name === activeColor.name ? 'active' : ''}" style="background-color: ${c.hex};" onclick="app.render.setProductDetailColor('${p.id}', '${c.name}', this)" title="${c.name}"></button>
                  `).join('')}
                </div>
              </div>

              <!-- Size selection -->
              <div class="variation-group" style="margin-top:1.5rem;">
                <div class="variation-label">
                  <span>Choose Fit Size: <strong id="selected-size-label" style="color:var(--accent-maroon);">${activeSize}</strong></span>
                  <button class="size-guide-btn" onclick="app.ui.toggleSizeGuide(true)">Size Guide Chart</button>
                </div>
                <div class="size-selector-grid">
                  ${p.sizes.map(sz => `
                    <button class="size-pill ${sz === activeSize ? 'active' : ''}" onclick="app.render.setProductDetailSize('${sz}', this)">${sz}</button>
                  `).join('')}
                </div>
              </div>

              <!-- Fabric selection -->
              <div class="variation-group" style="margin-top:1.5rem;">
                <span class="variation-label">Handloom Fabric Selection: <strong id="selected-fabric-label" style="color:var(--accent-maroon);">${activeFabric}</strong></span>
                <div class="tags-filter-list">
                  ${p.fabrics.map(fb => `
                    <span class="filter-tag ${fb === activeFabric ? 'active' : ''}" onclick="app.render.setProductDetailFabric('${fb}', this)">${fb}</span>
                  `).join('')}
                </div>
              </div>

              <!-- Purchase Actions row -->
              <div class="purchase-row">
                <div class="quantity-selector">
                  <button class="qty-selector-btn" onclick="app.render.adjProductDetailQty(-1)">-</button>
                  <span class="qty-selector-val" id="detail-qty-counter">1</span>
                  <button class="qty-selector-btn" onclick="app.render.adjProductDetailQty(1)">+</button>
                </div>
                <button class="btn btn-primary" style="flex:1; height:48px;" onclick="app.render.triggerAddToCart('${p.id}')">🛒 Add to Bag</button>
              </div>

              <!-- Add to wishlist and WhatsApp consult buttons -->
              <div style="display:flex; gap:1rem; margin-bottom:2.5rem;">
                <button id="details-like-btn" class="btn btn-secondary ${isLiked ? 'liked' : ''}" style="flex:1; padding:0.6rem; font-size:0.8rem;" onclick="app.wishlist.toggle('${p.id}')">
                  ${isLiked ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                </button>
                <a href="https://wa.me/91XXXXXXXXXX?text=Hello%20Hemlata!%20I'd%20like%20to%20customize%20this%20product:%20${encodeURIComponent(p.name)}" target="_blank" rel="noopener" class="btn btn-secondary" style="flex:1; padding:0.6rem; font-size:0.8rem; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
                  <span>💬</span> Customized Sleeve / WhatsApp
                </a>
              </div>

              <!-- Pincode widget -->
              <div class="pincode-widget">
                <span class="pincode-label">📍 Pincode Delivery Checker</span>
                <div class="pincode-input-row">
                  <input type="text" id="detail-pincode-input" class="pincode-input" placeholder="Enter 6-digit Pincode" maxlength="6" />
                  <button class="pincode-btn" onclick="app.delivery.check(document.getElementById('detail-pincode-input').value)">Check</button>
                </div>
                <div id="pincode-result-box"></div>
              </div>

            </div>
          </div>

          <!-- Tabs details segment (Fabric info, care, reviews) -->
          <div class="product-tabs">
            <div class="tabs-nav">
              <button class="tab-trigger active" id="tab-btn-details" onclick="app.render.toggleDetailTab('details')">Fabric & Craft</button>
              <button class="tab-trigger" id="tab-btn-care" onclick="app.render.toggleDetailTab('care')">Care Instructions</button>
              <button class="tab-trigger" id="tab-btn-reviews" onclick="app.render.toggleDetailTab('reviews')">Reviews (${p.reviews.length})</button>
            </div>
            
            <div class="tab-content" id="product-tab-body">
              <!-- Fabric details -->
              <div id="tab-pane-details">
                <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--accent-maroon); margin-bottom:0.75rem;">Premium Loom Construction</h4>
                <p style="margin-bottom:1rem;">${p.fabric}</p>
                <p>Designed with pure, natural Indian yarns selected by hand. The breathability and organic drape make Zenjal garments comfortable for warm tropical temperatures, festive pujas, and grand wedding stages.</p>
              </div>
            </div>
          </div>

          <!-- Related products segment -->
          ${related.length > 0 ? `
            <div style="margin-top:5rem; border-top:1px solid var(--border-gold); padding-top:3.5rem;">
              <h3 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--accent-maroon); text-align:center; margin-bottom:2.5rem;">Bespoke Pairings</h3>
              <div class="grid-3">
                ${related.map(r => `
                  <div class="product-card">
                    <div class="product-card-img-wrap" onclick="window.location.hash='#/product/${r.id}'" style="cursor:pointer;">
                      <img src="${r.colors[0].images[0]}" alt="${r.name}" class="product-card-img" onerror="app.ui.handleImageError(this, '${r.fabric}', '${r.colors[0].hex}', '${r.badge}')" />
                    </div>
                    <div class="product-card-info" style="padding: 1.25rem;">
                      <h4 class="product-card-title" onclick="window.location.hash='#/product/${r.id}'" style="font-size:1.15rem; cursor:pointer;">${r.name}</h4>
                      <div class="product-card-bottom" style="margin-top: 1rem;">
                        <span style="font-family:var(--font-serif); font-size:1.15rem; font-weight:700; color:var(--accent-maroon);">₹${r.price.toLocaleString('en-IN')}</span>
                        <a href="#/product/${r.id}" class="product-card-action" style="font-size:0.75rem;">View</a>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

        </div>
      `;

      // Track active selection scopes
      this.activeProductSelections = {
        productId: p.id,
        color: activeColor.name,
        size: activeSize,
        fabric: activeFabric,
        quantity: 1
      };
    },

    swapProductDetailImage(src, element) {
      document.getElementById('main-product-image').src = src;
      const thumbs = document.querySelectorAll('#product-gallery-thumbs .product-thumb');
      thumbs.forEach(t => t.classList.remove('active'));
      element.classList.add('active');
    },

    setProductDetailColor(productId, colorName, element) {
      const p = app.state.products.find(item => item.id === productId);
      if (!p) return;

      const colorObj = p.colors.find(c => c.name === colorName);
      if (!colorObj) return;

      // Swap selected hex button borders
      const colorBtns = element.parentElement.querySelectorAll('.color-filter-btn');
      colorBtns.forEach(b => b.classList.remove('active'));
      element.classList.add('active');

      document.getElementById('selected-color-name').innerText = colorName;

      // Swap main product image + reload thumbnail grid
      document.getElementById('main-product-image').src = colorObj.images[0];
      
      const thumbBox = document.getElementById('product-gallery-thumbs');
      thumbBox.innerHTML = colorObj.images.map((img, idx) => `
        <div class="product-thumb ${idx === 0 ? 'active' : ''}" onclick="app.render.swapProductDetailImage('${img}', this)">
          <img src="${img}" alt="${p.name}" onerror="app.ui.handleImageError(this, '${p.fabric}', '${colorObj.hex}')" />
        </div>
      `).join('');

      this.activeProductSelections.color = colorName;
    },

    setProductDetailSize(size, element) {
      const sizeBtns = element.parentElement.querySelectorAll('.size-pill');
      sizeBtns.forEach(b => b.classList.remove('active'));
      element.classList.add('active');

      document.getElementById('selected-size-label').innerText = size;
      this.activeProductSelections.size = size;
    },

    setProductDetailFabric(fabric, element) {
      const tags = element.parentElement.querySelectorAll('.filter-tag');
      tags.forEach(b => b.classList.remove('active'));
      element.classList.add('active');

      document.getElementById('selected-fabric-label').innerText = fabric;
      this.activeProductSelections.fabric = fabric;
    },

    adjProductDetailQty(change) {
      let current = this.activeProductSelections.quantity;
      current += change;
      if (current <= 0) current = 1;
      
      this.activeProductSelections.quantity = current;
      document.getElementById('detail-qty-counter').innerText = current;
    },

    triggerAddToCart(productId) {
      const sel = this.activeProductSelections;
      app.cart.add(productId, sel.size, sel.color, sel.fabric, sel.quantity);
    },

    toggleDetailTab(tabName) {
      const p = app.state.products.find(item => item.id === this.activeProductSelections.productId);
      if (!p) return;

      const triggers = document.querySelectorAll('.tabs-nav .tab-trigger');
      triggers.forEach(t => t.classList.remove('active'));
      document.getElementById(`tab-btn-${tabName}`).classList.add('active');

      const body = document.getElementById('product-tab-body');
      
      if (tabName === 'details') {
        body.innerHTML = `
          <div>
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--accent-maroon); margin-bottom:0.75rem;">Premium Loom Construction</h4>
            <p style="margin-bottom:1rem;">${p.fabric}</p>
            <p>Designed with pure, natural Indian yarns selected by hand. The breathability and organic drape make Zenjal garments comfortable for warm tropical temperatures, festive pujas, and grand wedding stages.</p>
          </div>
        `;
      } else if (tabName === 'care') {
        body.innerHTML = `
          <div>
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--accent-maroon); margin-bottom:0.75rem;">Textile Preservation Directives</h4>
            <p style="margin-bottom:1rem;">${p.care}</p>
            <p style="font-size:0.85rem; font-style:italic; color:var(--text-muted);">* Each item is handloom finished. Minor variations in block printing and weaves are organic marks of real handicraft.</p>
          </div>
        `;
      } else if (tabName === 'reviews') {
        body.innerHTML = `
          <div class="reviews-section">
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--accent-maroon);">Verifiable Customer Reviews (${p.reviews.length})</h4>
            
            <div id="reviews-list-container" style="display:flex; flex-direction:column; gap:1.25rem; margin-bottom: 2rem;">
              ${p.reviews.length === 0 ? '<p style="font-style:italic; color:var(--text-muted);">No reviews written yet. Be the first to grace this garment!</p>' : p.reviews.map(r => `
                <div class="review-card">
                  <div class="review-card-header">
                    <strong class="review-author">${r.author}</strong>
                    <span class="review-date">${r.date}</span>
                  </div>
                  <div class="stars" style="margin-bottom:0.5rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                  <p class="review-body">${r.comment}</p>
                </div>
              `).join('')}
            </div>

            <!-- Dynamic review submit block -->
            <div class="add-review-panel">
              <h4 class="panel-title">Write A Review</h4>
              <div class="form-group">
                <label class="form-label" style="font-size:0.75rem;">Reviewer Name</label>
                <input type="text" id="rev-name" class="form-input" placeholder="e.g. Aditi S." required />
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size:0.75rem;">Garment Star Rating</label>
                <div class="star-select-row" id="star-selector-bar">
                  <span class="star-select-item" onclick="app.render.setReviewFormStars(1)" data-star="1">★</span>
                  <span class="star-select-item" onclick="app.render.setReviewFormStars(2)" data-star="2">★</span>
                  <span class="star-select-item" onclick="app.render.setReviewFormStars(3)" data-star="3">★</span>
                  <span class="star-select-item" onclick="app.render.setReviewFormStars(4)" data-star="4">★</span>
                  <span class="star-select-item" onclick="app.render.setReviewFormStars(5)" data-star="5">★</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size:0.75rem;">Review Comments</label>
                <textarea id="rev-body" class="form-input" rows="3" placeholder="Tell us how the fabric drapes and fits..." required></textarea>
              </div>
              <button class="btn btn-primary" onclick="app.render.submitProductReview('${p.id}')" style="padding:0.5rem 1.5rem; font-size:0.75rem;">Submit Review</button>
            </div>

          </div>
        `;
        this.activeReviewStars = 5;
        this.setReviewFormStars(5);
      }
    },

    setReviewFormStars(score) {
      this.activeReviewStars = score;
      const stars = document.querySelectorAll('#star-selector-bar .star-select-item');
      stars.forEach((s, idx) => {
        if (idx < score) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
    },

    submitProductReview(productId) {
      const name = document.getElementById('rev-name').value.trim();
      const comment = document.getElementById('rev-body').value.trim();

      if (!name || !comment) {
        alert("Please fill in both name and comment fields.");
        return;
      }

      const p = app.state.products.find(item => item.id === productId);
      if (!p) return;

      const dateToday = new Date().toISOString().split('T')[0];

      p.reviews.push({
        author: name,
        rating: this.activeReviewStars,
        date: dateToday,
        comment: comment
      });

      // Recalculate average rating
      const sum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
      p.rating = Number((sum / p.reviews.length).toFixed(1));
      p.reviewsCount = p.reviews.length;

      app.saveState();
      alert("Dhanyawaad! Your verification review is submitted.");
      this.toggleDetailTab('reviews');
    },

    about(container) {
      container.innerHTML = `
        <!-- About Hero Section -->
        <section class="about-hero" style="background-image: url('images/about_hero.jpg');">
          <div class="about-hero-overlay"></div>
          <div class="about-hero-content">
            <span class="eyebrow" style="color:var(--primary-gold-light);">Our Heritage</span>
            <h1 class="page-title" style="color:var(--white);">The Zenjal Story</h1>
            <p style="font-family:var(--font-serif); font-style:italic; font-size:1.2rem; color:var(--accent-blush);">Woven with intention, stitched with love.</p>
          </div>
        </section>

        <!-- Sourcing History -->
        <section class="section-padding container">
          <div class="about-story-row">
            <div>
              <span class="eyebrow">The Artisan Courtyard</span>
              <h2 class="section-title">Handwoven craft, local weavers</h2>
              <div class="luxury-divider" style="justify-content:flex-start;"><span>✦</span></div>
              <p style="color:var(--text-muted); line-height:1.7; margin-bottom:1.25rem;">
                Zenjal is a boutique Indian fashion house founded in the heart of <strong>Siddharthnagar, Uttar Pradesh</strong>. Rooted in Hemlata's deep respect for heritage textiles, the boutique aims to bridge beautiful, traditional Indian weaves with contemporary tailored silhouettes.
              </p>
              <p style="color:var(--text-muted); line-height:1.7; margin-bottom:1.25rem;">
                Our primary sourcing network connects directly to artisan families in Varanasi, Madhya Pradesh (Chanderi weavers), and local UP handicraft clusters. By eliminating intermediaries, we ensure that a greater portion of each purchase goes directly back to local craftsmen who keep these handloom traditions alive.
              </p>
              <blockquote style="font-family:var(--font-serif); font-style:italic; font-size:1.2rem; color:var(--accent-maroon); padding-left:1.5rem; border-left:3.2px solid var(--primary-gold); margin: 1.5rem 0;">
                "Boutique fashion shouldn't just feel luxury; it should stand for artisan welfare, organic fiber respect, and localized tailoring precision."
              </blockquote>
              <p style="color:var(--text-muted); line-height:1.7;">
                From hand-pressed block printing to delicate Zardozi needlework, each piece goes through meticulous quality checking by Hemlata and our tailoring squad before shipping internationally to our diaspora.
              </p>
            </div>
            <div>
              <img src="images/weaving_loom.jpg" alt="Artisan handloom weaving chanderi silks" style="width:100%; border-radius:var(--radius-md); box-shadow:var(--shadow-warm); border:1px solid var(--border-gold);" />
            </div>
          </div>
        </section>

        <!-- Brand Values Segment -->
        <section class="section-padding about-values-section">
          <div class="container">
            <div class="text-center">
              <span class="eyebrow">Our Pillars</span>
              <h2 class="section-title">Values of Zenjal</h2>
              <div class="luxury-divider"><span>✦</span></div>
            </div>
            
            <div class="grid-3" style="margin-top:2.5rem;">
              <div class="value-card">
                <div class="value-card-icon">🪡</div>
                <h3 class="value-card-title">Bespoke Custom Fits</h3>
                <p class="value-card-desc">We reject standard mannequin sizing. Through our interactive sizing guide and custom notes, every dress is modified to flow around your natural curves.</p>
              </div>
              <div class="value-card">
                <div class="value-card-icon">🌱</div>
                <h3 class="value-card-title">Artisan Direct Welfare</h3>
                <p class="value-card-desc">Sourced straight from handloom looms. We maintain zero middle-men dependencies, securing honest, livable wages for traditional weavers.</p>
              </div>
              <div class="value-card">
                <div class="value-card-icon">🇮🇳</div>
                <h3 class="value-card-title">Woven Heritage Pride</h3>
                <p class="value-card-desc">Each piece is proudly handblock dyed and stitched in India. Keeping the historic textile culture of Uttar Pradesh and Varanasi alive.</p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    collections(container) {
      container.innerHTML = `
        <div class="container section-padding">
          <div class="text-center" style="margin-bottom:4rem;">
            <span class="eyebrow">Handloom Lookbooks</span>
            <h2 class="page-title">Traditional Collections</h2>
            <div class="luxury-divider"><span>✦</span></div>
            <p class="section-desc">Hand-finished designs categorised under five timeless visual campaigns.</p>
          </div>

          <div class="collections-edit-grid">
            <div class="edit-card">
              <div class="edit-card-img-wrap">
                <img src="images/coll_kurta.jpg" alt="Chanderi Kurta Sets Edit" />
              </div>
              <div class="edit-card-info">
                <div>
                  <h3 class="edit-card-title">The Chanderi Sets</h3>
                  <p class="edit-card-desc">Breezy, translucent Chanderi silk sets paired with scalloped sheer organza dupattas, embellished with delicate gold borders.</p>
                </div>
                <a href="#/shop?category=Kurta+Sets" class="btn btn-primary" style="padding:0.5rem 1.5rem; font-size:0.75rem;">Explore Sets</a>
              </div>
            </div>
            
            <div class="edit-card">
              <div class="edit-card-img-wrap">
                <img src="images/coll_saree.jpg" alt="Varanasi Katan Silk Sarees Edit" />
              </div>
              <div class="edit-card-info">
                <div>
                  <h3 class="edit-card-title">Varanasi Katan Silks</h3>
                  <p class="edit-card-desc">Handcrafted in Varanasi, featuring traditional floral bootas and grand gold zari patterns, carrying standard heritage royalty.</p>
                </div>
                <a href="#/shop?category=Sarees" class="btn btn-primary" style="padding:0.5rem 1.5rem; font-size:0.75rem;">Explore Sarees</a>
              </div>
            </div>

            <div class="edit-card">
              <div class="edit-card-img-wrap">
                <img src="images/coll_lehenga.jpg" alt="Bespoke Festive Lehengas Edit" />
              </div>
              <div class="edit-card-info">
                <div>
                  <h3 class="edit-card-title">Pastel Wedding Edit</h3>
                  <p class="edit-card-desc">Heavy mirror-work viscose georgette and micro-velvet lehengas styled in blush rose, champagne ivory, and rich maroon.</p>
                </div>
                <a href="#/shop?category=Lehengas" class="btn btn-primary" style="padding:0.5rem 1.5rem; font-size:0.75rem;">Explore Lehengas</a>
              </div>
            </div>

            <div class="edit-card">
              <div class="edit-card-img-wrap">
                <img src="images/coll_dupatta.jpg" alt="Gota Patti Organza Dupattas Edit" />
              </div>
              <div class="edit-card-info">
                <div>
                  <h3 class="edit-card-title">Gota Patti Classics</h3>
                  <p class="edit-card-desc">Sheer silk organza and premium chiffon dupattas finished with hand-painted borders and intricate scalloped gota designs.</p>
                </div>
                <a href="#/shop?category=Dupattas" class="btn btn-primary" style="padding:0.5rem 1.5rem; font-size:0.75rem;">Explore Dupattas</a>
              </div>
            </div>

            <div class="edit-card" style="grid-column: span 2;">
              <div class="edit-card-img-wrap" style="aspect-ratio: 16/9;">
                <img src="images/coll_festive.jpg" alt="Zenjal Festive Edit Campaign" style="object-position: center 30%;" />
              </div>
              <div class="edit-card-info" style="flex-direction:row; justify-content:space-between; align-items:center; text-align:left;">
                <div style="max-width:400px;">
                  <h3 class="edit-card-title" style="margin-bottom:0.25rem;">Festive Summer Edit 2026</h3>
                  <p class="edit-card-desc" style="margin-bottom:0;">Our complete curated wedding drops. Lightweight, luxury clothing that breathes during warm daylight and glows at night.</p>
                </div>
                <a href="#/shop?tag=Festive+Edit" class="btn btn-gold" style="padding:0.75rem 2rem; font-size:0.8rem;">Explore Campaign</a>
              </div>
            </div>
          </div>

        </div>
      `;
    },

    contact(container) {
      container.innerHTML = `
        <div class="container section-padding">
          <div class="text-center" style="margin-bottom:4rem;">
            <span class="eyebrow">Connect With Us</span>
            <h2 class="page-title">Store & Custom Consultations</h2>
            <div class="luxury-divider"><span>✦</span></div>
          </div>

          <div class="contact-layout">
            <!-- Contact details left -->
            <div class="contact-info-block">
              <div>
                <h3 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--accent-maroon); margin-bottom:1rem;">Zenjal Boutique Studio</h3>
                <p style="color:var(--text-muted); line-height:1.6;">Walk in for a custom sizing checkup, or book a digital consultation with Hemlata. We are delighted to assist your wedding styling boards.</p>
              </div>

              <div class="contact-row">
                <div class="contact-icon">📍</div>
                <div class="contact-texts">
                  <h4>Physical Studio</h4>
                  <p>Zenjal Boutique Studio, Siddharthnagar, Uttar Pradesh – 272207, India</p>
                </div>
              </div>

              <div class="contact-row">
                <div class="contact-icon">📞</div>
                <div class="contact-texts">
                  <h4>Phone / Support</h4>
                  <p>+91 98765 43210 (Mon – Sat, 10 AM – 7 PM IST)</p>
                </div>
              </div>

              <div class="contact-row">
                <div class="contact-icon">✉️</div>
                <div class="contact-texts">
                  <h4>Email Assistance</h4>
                  <p>namaste@zenjal.com / alterations@zenjal.com</p>
                </div>
              </div>

              <div>
                <a href="https://wa.me/91XXXXXXXXXX?text=Namaste%20Zenjal!%20I'd%20like%20to%20inquire%20about%20a%20garment%20customization." target="_blank" rel="noopener" class="whatsapp-contact-btn">
                  <span>💬</span> WhatsApp Direct Message
                </a>
              </div>

              <!-- Map placeholder -->
              <div class="map-visual-placeholder">
                <div class="map-pulse-dot"></div>
                <div style="position:absolute; bottom:1rem; left:1rem; right:1rem; background-color:rgba(255,255,255,0.9); padding:0.75rem; border-radius:3px; font-size:0.8rem; border:1px solid var(--border-gold);">
                  <strong>Zenjal Boutique Studio</strong><br/>
                  Siddharthnagar, UP 272207
                </div>
              </div>

            </div>

            <!-- Inquire Form Right -->
            <div class="contact-form-panel">
              <h3 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--accent-maroon); margin-bottom:1.5rem; text-align:center;">Send A Message</h3>
              <form onsubmit="event.preventDefault(); alert('Dhanyawaad! Hemlata and our consulting team have received your request. We will WhatsApp/Email you within 12 hours.'); this.reset();">
                <div class="form-group" style="margin-bottom:1.25rem;">
                  <label class="form-label">Your Name *</label>
                  <input type="text" class="form-input" placeholder="e.g. Aditi Sharma" required />
                </div>
                <div class="form-group" style="margin-bottom:1.25rem;">
                  <label class="form-label">Phone Contact (with WhatsApp active) *</label>
                  <input type="tel" class="form-input" placeholder="e.g. +91 98765 43210" required />
                </div>
                <div class="form-group" style="margin-bottom:1.25rem;">
                  <label class="form-label">Email Address *</label>
                  <input type="email" class="form-input" placeholder="e.g. aditi@gmail.com" required />
                </div>
                <div class="form-group" style="margin-bottom:1.5rem;">
                  <label class="form-label">Detail Inquiry (Event date, sizing, fabrics) *</label>
                  <textarea class="form-input" rows="4" placeholder="Let us know how we can tailor your garment with grace..." required style="resize:none;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Send Consultation Request</button>
              </form>
            </div>
          </div>

        </div>
      `;
    },

    blog(container) {
      container.innerHTML = `
        <div class="container section-padding">
          <div class="text-center" style="margin-bottom:4rem;">
            <span class="eyebrow">Courtyard Journal</span>
            <h2 class="page-title">Zenjal Styling Lookbooks</h2>
            <div class="luxury-divider"><span>✦</span></div>
            <p class="section-desc">Styling tips, textile care directives and lookbooks written directly by Hemlata.</p>
          </div>

          <div class="blog-listings-grid">
            ${app.state.blogPosts.map(post => `
              <div class="blog-post-card">
                <div class="blog-post-img-wrap" onclick="window.location.hash='#/blog/${post.slug}'" style="cursor:pointer;">
                  <img src="${post.image}" alt="${post.title}" />
                </div>
                <div class="blog-post-info">
                  <div class="blog-post-meta">
                    <span>📅 ${post.date}</span>
                    <span>✍️ By ${post.author}</span>
                  </div>
                  <h3 class="blog-post-title" onclick="window.location.hash='#/blog/${post.slug}'" style="cursor:pointer;">${post.title}</h3>
                  <p class="blog-post-excerpt">${post.excerpt}</p>
                  <a href="#/blog/${post.slug}" class="blog-post-link">Read Lookbook</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    blogArticle(container, slug) {
      const post = app.state.blogPosts.find(b => b.slug === slug);
      if (!post) {
        container.innerHTML = `
          <div class="container text-center section-padding" style="font-family: var(--font-serif);">
            <h2 class="page-title">Lookbook Lost</h2>
            <a href="#/blog" class="btn btn-primary">Return to Lookbooks</a>
          </div>
        `;
        return;
      }

      app.seo.update(`${post.title} | Zenjal Boutique`, post.excerpt);

      container.innerHTML = `
        <div class="container section-padding">
          <div class="breadcrumbs">
            <a href="#/">Home</a> / <a href="#/blog">Lookbooks</a> / <span>${post.title}</span>
          </div>

          <article class="article-reading-pane">
            <header class="article-header">
              <span class="eyebrow">Lookbook Journal</span>
              <h1 class="page-title" style="font-size: clamp(2rem, 4vw, 2.6rem); line-height: 1.25; margin-bottom: 1rem;">${post.title}</h1>
              <div class="blog-post-meta" style="justify-content:center; font-size:0.85rem;">
                <span>📅 ${post.date}</span>
                <span>✍️ Written by ${post.author}</span>
              </div>
            </header>

            <div style="margin-bottom: 2.5rem; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-gold);">
              <img src="${post.image}" alt="${post.title}" style="width:100%; aspect-ratio:16/9; object-fit:cover;" />
            </div>

            <div class="article-body">
              ${post.content}
            </div>

            <div style="margin-top:3.5rem; border-top:1px solid var(--border-gold); padding-top:2rem; display:flex; justify-content:space-between; align-items:center;">
              <a href="#/blog" class="btn btn-secondary" style="padding:0.5rem 1.5rem; font-size:0.75rem;">← All Lookbooks</a>
              <span style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">Share grace: <strong>#ZenjalBoutique</strong></span>
            </div>
          </article>
        </div>
      `;
    },

    customize(container) {
      container.innerHTML = `
        <div class="container section-padding">
          <div class="text-center" style="margin-bottom:4rem;">
            <span class="eyebrow">Bespoke Design Studio</span>
            <h2 class="page-title">Interactive Custom Tailoring</h2>
            <div class="luxury-divider"><span>✦</span></div>
            <p class="section-desc">Design your own outfit with Hemlata. Specify custom necklines, sleeves, fabrics, and your exact measurements below.</p>
          </div>

          <div class="shop-layout" style="grid-template-columns: 1.1fr 0.9fr; gap: 4rem;">
            <!-- Customizer Controls Left -->
            <div class="contact-form-panel" style="padding: 2.5rem; background-color: var(--white); box-shadow: var(--shadow-warm);">
              <h3 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--accent-maroon); margin-bottom:1.5rem; text-align:center;">Custom Options</h3>
              
              <!-- 1. Garment Type -->
              <div class="variation-group" style="margin-bottom:2rem;">
                <span class="variation-label">Step 1: Select Garment Base</span>
                <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:0.75rem;">
                  <button class="btn btn-secondary active" id="gc-kurta" onclick="app.render.setCustomGarment('Kurta Set', 4899, this)" style="padding:0.75rem; font-size:0.78rem;">Kurta Set (+₹4,899)</button>
                  <button class="btn btn-secondary" id="gc-blouse" onclick="app.render.setCustomGarment('Saree Blouse', 2499, this)" style="padding:0.75rem; font-size:0.78rem;">Saree Blouse (+₹2,499)</button>
                  <button class="btn btn-secondary" id="gc-lehenga" onclick="app.render.setCustomGarment('Lehenga Choli', 16500, this)" style="padding:0.75rem; font-size:0.78rem;">Lehenga Choli (+₹16,500)</button>
                  <button class="btn btn-secondary" id="gc-anarkali" onclick="app.render.setCustomGarment('Bespoke Anarkali', 5899, this)" style="padding:0.75rem; font-size:0.78rem;">Bespoke Anarkali (+₹5,899)</button>
                </div>
              </div>

              <!-- 2. Colors -->
              <div class="variation-group" style="margin-bottom:2rem;">
                <span class="variation-label">Step 2: Choose Loom Color</span>
                <div class="color-filters-grid">
                  <button class="color-filter-btn active" style="background-color: #C8922A;" onclick="app.render.setCustomColor('Deep Marigold Gold', '#C8922A', this)" title="Marigold"></button>
                  <button class="color-filter-btn" style="background-color: #7B1F2E;" onclick="app.render.setCustomColor('Rich Maroon', '#7B1F2E', this)" title="Maroon"></button>
                  <button class="color-filter-btn" style="background-color: #FAF5EC;" onclick="app.render.setCustomColor('Ivory White', '#FAF5EC', this)" title="Ivory"></button>
                  <button class="color-filter-btn" style="background-color: #F2D5C4;" onclick="app.render.setCustomColor('Soft Blush', '#F2D5C4', this)" title="Blush"></button>
                </div>
              </div>

              <!-- 3. Neckline & Sleeve -->
              <div class="grid-2" style="margin-bottom:2rem; gap:1.25rem;">
                <div class="form-group">
                  <label class="form-label" style="font-size:0.75rem;">Step 3: Neckline Styling</label>
                  <select class="sort-select" id="custom-neckline" style="width:100%;" onchange="app.render.setCustomOption('neckline', this.value)">
                    <option value="Mandarin Collar">Mandarin Collar</option>
                    <option value="Elegant Boat Neck">Elegant Boat Neck</option>
                    <option value="Heritage Sweetheart">Heritage Sweetheart</option>
                    <option value="Classic V-Neck">Classic V-Neck</option>
                    <option value="Bespoke Round Collar">Bespoke Round Collar</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" style="font-size:0.75rem;">Step 4: Sleeve Length</label>
                  <select class="sort-select" id="custom-sleeves" style="width:100%;" onchange="app.render.setCustomOption('sleeves', this.value)">
                    <option value="3/4 Length Sleeves">3/4 Length Sleeves</option>
                    <option value="Regal Full Sleeves">Regal Full Sleeves</option>
                    <option value="Sheer Puff Sleeves">Sheer Puff Sleeves</option>
                    <option value="Sleeveless elegance">Sleeveless Elegance</option>
                  </select>
                </div>
              </div>

              <!-- 4. Body measurements -->
              <div class="variation-group" style="margin-bottom:1.5rem;">
                <span class="variation-label">Step 5: Enter Sizing Measurements (Inches)</span>
                <div class="grid-3" style="gap:1rem;">
                  <div class="form-group">
                    <label class="form-label" style="font-size:0.7rem; color:var(--text-muted);">Bust *</label>
                    <input type="number" id="ms-bust" class="form-input" placeholder="e.g. 36" required style="padding:0.4rem;" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" style="font-size:0.7rem; color:var(--text-muted);">Waist *</label>
                    <input type="number" id="ms-waist" class="form-input" placeholder="e.g. 30" required style="padding:0.4rem;" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" style="font-size:0.7rem; color:var(--text-muted);">Hip *</label>
                    <input type="number" id="ms-hip" class="form-input" placeholder="e.g. 40" required style="padding:0.4rem;" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" style="font-size:0.7rem; color:var(--text-muted);">Shoulder *</label>
                    <input type="number" id="ms-shoulder" class="form-input" placeholder="e.g. 14" style="padding:0.4rem;" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" style="font-size:0.7rem; color:var(--text-muted);">Armhole *</label>
                    <input type="number" id="ms-armhole" class="form-input" placeholder="e.g. 16" style="padding:0.4rem;" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" style="font-size:0.7rem; color:var(--text-muted);">Height (ft) *</label>
                    <input type="text" id="ms-height" class="form-input" placeholder="e.g. 5.4" style="padding:0.4rem;" />
                  </div>
                </div>
              </div>

              <!-- 5. Embroidery/Notes -->
              <div class="form-group" style="margin-bottom:2rem;">
                <label class="form-label" style="font-size:0.75rem;">Step 6: Artisan Embroidery & Notes</label>
                <textarea id="co-custom-notes" class="form-input" rows="2" placeholder="e.g. add light gota lines on neck borders..." style="resize:none; font-size:0.85rem;"></textarea>
              </div>

              <button class="btn btn-primary btn-block" onclick="app.render.addCustomToBag()" style="height:48px;">🛒 Add Custom Outfit to Bag</button>
            </div>

            <!-- Preview Card Right -->
            <div style="position:sticky; top:120px; height:fit-content; display:flex; flex-direction:column; gap:1.5rem;">
              <div class="product-card" style="background-color: var(--white); border:1px solid var(--primary-gold);">
                <div class="product-card-img-wrap" style="aspect-ratio:3/4;">
                  <img id="custom-preview-fabric" src="" alt="Custom garment preview" class="product-card-img" />
                  <span class="product-card-badge badge badge-limited" style="background-color: var(--accent-maroon); color: var(--bg-ivory);">Bespoke tailored</span>
                </div>
                <div class="product-card-info" style="padding: 1.75rem;">
                  <div>
                    <span style="font-size:0.75rem; color:var(--primary-gold); font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Zenjal Tailoring Service</span>
                    <h3 class="product-card-title" id="custom-preview-title" style="font-size:1.6rem; color:var(--accent-maroon);">Customized Kurta Set</h3>
                    
                    <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.6; margin-top:0.75rem; border-top:1px dashed var(--border-gold); padding-top:0.75rem;">
                      <div>Fabric Color: <strong id="pv-color">Deep Marigold Gold</strong></div>
                      <div>Neckline Design: <strong id="pv-neckline">Mandarin Collar</strong></div>
                      <div>Sleeve Design: <strong id="pv-sleeves">3/4 Length Sleeves</strong></div>
                      <div style="font-size:0.78rem; font-style:italic; color:var(--primary-gold-dark); margin-top:0.4rem;">💡 Tailored to your exact Bust, Waist, & Hips!</div>
                    </div>
                  </div>
                  
                  <div class="product-card-bottom" style="margin-top:1.5rem; border-top:1px dashed var(--border-gold); padding-top:1rem;">
                    <div class="product-price-block">
                      <span class="price-regular" id="custom-preview-price">₹4,899</span>
                      <span style="font-size:0.68rem; color:var(--text-muted);">Inclusive of 12% GST & Surcharges</span>
                    </div>
                    <a href="https://wa.me/91XXXXXXXXXX?text=Hello%20Hemlata!%20I'd%20like%20to%20review%20my%20Bespoke%20Fitting%20card." target="_blank" rel="noopener" class="product-card-action" style="font-size:0.72rem;">Review with Hemlata</a>
                  </div>
                </div>
              </div>
              
              <div style="background-color: var(--white); border:1px solid var(--border-gold); padding:1.25rem; border-radius:var(--radius-sm); font-size:0.82rem; line-height:1.5; color:var(--text-muted);">
                <strong>🌿 Handcraft Promise</strong><br/>
                Every bespoke tailored item goes through direct verification by master designer **Hemlata** on WhatsApp. Once placed, we confirm creasing offsets and sizing parameters before launching looms.
              </div>
            </div>

          </div>
        </div>
      `;

      // Set initial values
      this.activeCustomGarment = {
        name: 'Customized Kurta Set',
        price: 4899,
        color: 'Deep Marigold Gold',
        hex: '#C8922A',
        neckline: 'Mandarin Collar',
        sleeves: '3/4 Length Sleeves',
        fabric: 'Bespoke Chanderi & Cambric Cotton'
      };

      // Set initial image preview
      this.updateCustomPreviewImage();
    },

    setCustomGarment(type, price, element) {
      const btns = element.parentElement.querySelectorAll('button');
      btns.forEach(b => b.classList.remove('active'));
      element.classList.add('active');

      this.activeCustomGarment.name = `Customized ${type}`;
      this.activeCustomGarment.price = price;
      
      // Update fabrics base descriptive based on type
      if (type === 'Saree Blouse') this.activeCustomGarment.fabric = 'Varanasi Katan Silk / Velvet';
      else if (type === 'Lehenga Choli') this.activeCustomGarment.fabric = 'Premium Georgette / Velvet';
      else this.activeCustomGarment.fabric = 'Bespoke Chanderi & Cambric Cotton';

      document.getElementById('custom-preview-title').innerText = this.activeCustomGarment.name;
      document.getElementById('custom-preview-price').innerText = `₹${price.toLocaleString('en-IN')}`;

      this.updateCustomPreviewImage();
    },

    setCustomColor(colorName, colorHex, element) {
      const btns = element.parentElement.querySelectorAll('.color-filter-btn');
      btns.forEach(b => b.classList.remove('active'));
      element.classList.add('active');

      this.activeCustomGarment.color = colorName;
      this.activeCustomGarment.hex = colorHex;
      
      document.getElementById('pv-color').innerText = colorName;
      this.updateCustomPreviewImage();
    },

    setCustomOption(key, value) {
      this.activeCustomGarment[key] = value;
      document.getElementById(`pv-${key}`).innerText = value;
    },

    updateCustomPreviewImage() {
      const img = document.getElementById('custom-preview-fabric');
      if (img) {
        // Procedurally weave the customized texture instantly!
        img.src = app.ui.generateTextileDataUrl(this.activeCustomGarment.fabric, this.activeCustomGarment.hex, 'Limited Edition');
      }
    },

    addCustomToBag() {
      const bust = document.getElementById('ms-bust').value;
      const waist = document.getElementById('ms-waist').value;
      const hip = document.getElementById('ms-hip').value;
      const notes = document.getElementById('co-custom-notes').value.trim();

      if (!bust || !waist || !hip) {
        alert("Please enter at least Bust, Waist, and Hip measurements for a customized fit.");
        return;
      }

      const sel = this.activeCustomGarment;
      
      // Add customized item to shopping cart bag!
      app.state.cart.push({
        id: `bespoke-${Date.now()}`,
        name: sel.name,
        price: sel.price,
        image: app.ui.generateTextileDataUrl(sel.fabric, sel.hex, 'Limited Edition'),
        size: `Custom (B:${bust}" W:${waist}" H:${hip}")`,
        color: sel.color,
        fabric: `${sel.fabric} (${sel.neckline}, ${sel.sleeves})`,
        quantity: 1
      });

      app.saveState();
      app.ui.updateCounters();
      app.ui.toggleCart(true); // slides open cart showing custom item!
      
      // Clear inputs
      document.getElementById('ms-bust').value = '';
      document.getElementById('ms-waist').value = '';
      document.getElementById('ms-hip').value = '';
      if(document.getElementById('ms-shoulder')) document.getElementById('ms-shoulder').value = '';
      if(document.getElementById('ms-armhole')) document.getElementById('ms-armhole').value = '';
      if(document.getElementById('ms-height')) document.getElementById('ms-height').value = '';
      document.getElementById('co-custom-notes').value = '';
    }
  }

};

// ---------------------------------------------------------------------------
// 12. Run Application Initializer on Script Load
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
