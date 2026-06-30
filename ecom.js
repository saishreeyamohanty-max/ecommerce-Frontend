// PRODUCT DATA
const products = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", category: "Electronics", price: 2999, originalPrice: 4999, rating: 4.8, reviews: 312, emoji: "🎧", badge: "sale", tags: ["wireless", "audio", "premium"], desc: "Experience studio-quality sound anywhere. With up to 30 hours of battery life and active noise cancellation, these headphones are your perfect travel companion." },
  { id: 2, name: "Mechanical Gaming Keyboard", category: "Electronics", price: 1799, originalPrice: 2499, rating: 4.6, reviews: 187, emoji: "⌨️", badge: "sale", tags: ["gaming", "rgb", "mechanical"], desc: "Tactile red switches, per-key RGB lighting, and an aluminium frame. Built for gamers who demand performance and style." },
  { id: 3, name: "Ultra-Slim Laptop Stand", category: "Electronics", price: 999, originalPrice: null, rating: 4.5, reviews: 94, emoji: "💻", badge: "new", tags: ["desk", "ergonomic", "aluminium"], desc: "Elevate your laptop to eye level with our minimalist aluminium stand. Foldable, lightweight, and compatible with all laptops up to 17 inches." },
  { id: 4, name: "Smart LED Desk Lamp", category: "Home", price: 1299, originalPrice: 1799, rating: 4.7, reviews: 221, emoji: "💡", badge: "sale", tags: ["home", "smart", "usb"], desc: "Adjustable brightness and colour temperature, USB charging port, and touch controls. Perfect for late-night study sessions." },
  { id: 5, name: "Premium Cotton Hoodie", category: "Fashion", price: 899, originalPrice: 1299, rating: 4.4, reviews: 156, emoji: "👕", badge: "sale", tags: ["cotton", "casual", "unisex"], desc: "100% premium cotton for everyday comfort. Preshrunk, colourfast, and available in multiple shades. A wardrobe essential." },
  { id: 6, name: "Minimalist Leather Wallet", category: "Fashion", price: 699, originalPrice: null, rating: 4.6, reviews: 88, emoji: "👛", badge: "new", tags: ["leather", "slim", "rfid"], desc: "Slim profile, genuine leather, and RFID-blocking technology to keep your cards safe. Fits up to 8 cards and cash effortlessly." },
  { id: 7, name: "Stainless Steel Water Bottle", category: "Sports", price: 599, originalPrice: 899, rating: 4.9, reviews: 403, emoji: "🧴", badge: "sale", tags: ["gym", "eco", "insulated"], desc: "Double-wall vacuum insulation keeps drinks cold for 24 hours and hot for 12. BPA-free, leakproof, and durable." },
  { id: 8, name: "Adjustable Resistance Bands", category: "Sports", price: 449, originalPrice: null, rating: 4.5, reviews: 199, emoji: "🏋️", badge: "new", tags: ["fitness", "home gym", "stretch"], desc: "Set of 5 resistance levels from light to heavy. Made from natural latex. Perfect for home workouts, stretching, and physical therapy." },
  { id: 9, name: "Portable Bluetooth Speaker", category: "Electronics", price: 1599, originalPrice: 2199, rating: 4.7, reviews: 267, emoji: "🔊", badge: "sale", tags: ["bluetooth", "waterproof", "outdoor"], desc: "360-degree sound, IPX7 waterproof rating, and 20-hour battery life. Whether at the beach or in the kitchen, this speaker delivers." },
  { id: 10, name: "Ceramic Pour-Over Coffee Set", category: "Home", price: 1199, originalPrice: null, rating: 4.8, reviews: 74, emoji: "☕", badge: "new", tags: ["coffee", "kitchen", "ceramic"], desc: "Hand-crafted ceramic dripper with matching server. Makes the perfect cup every time. Includes 40 filter papers." },
  { id: 11, name: "Yoga Mat Pro", category: "Sports", price: 799, originalPrice: 1099, rating: 4.6, reviews: 312, emoji: "🧘", badge: "sale", tags: ["yoga", "fitness", "non-slip"], desc: "6mm thick non-slip surface with alignment lines. Eco-friendly TPE material, sweat-resistant, and easy to clean." },
  { id: 12, name: "Vintage Denim Jacket", category: "Fashion", price: 1499, originalPrice: 1999, rating: 4.5, reviews: 143, emoji: "🧥", badge: "sale", tags: ["denim", "fashion", "jacket"], desc: "Classic washed denim with a modern tailored fit. Versatile enough to dress up or down. A timeless addition to your wardrobe." },
];

// STATE
let cart = JSON.parse(localStorage.getItem('shopnest-cart') || '[]');
let lastPage = 'home';
let currentDetailId = null;
let detailQty = 1;
let wishlist = JSON.parse(localStorage.getItem('shopnest-wishlist') || '[]');
let discount = 0;

// PAGE ROUTING
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.textContent.toLowerCase().includes(name) || (name === 'home' && l.textContent === 'Home')) l.classList.add('active');
  });
  if (name !== 'detail') lastPage = name;
  if (name === 'home') renderFeatured();
  if (name === 'products') renderAllProducts();
  if (name === 'cart') renderCart();
  if (name === 'checkout') renderCheckoutSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() { showPage(lastPage); }

// RENDER PRODUCTS
function createProductCard(product) {
  const isWished = wishlist.includes(product.id);
  const badgeHTML = product.badge ? `<span class="product-badge ${product.badge === 'new' ? 'badge-new' : 'badge-sale'}">${product.badge.toUpperCase()}</span>` : '';
  const origHTML = product.originalPrice ? `<span class="original">₹${product.originalPrice.toLocaleString()}</span>` : '';
  return `
    <div class="product-card" onclick="showDetail(${product.id})">
      <div class="product-img">
        ${badgeHTML}
        <button class="wishlist-btn ${isWished ? 'active' : ''}" onclick="toggleWishlist(event, ${product.id})">
          <i class="fa${isWished ? 's' : 'r'} fa-heart"></i>
        </button>
        ${product.emoji}
      </div>
      <div class="product-info">
        <div class="product-cat">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
          ${product.rating} (${product.reviews})
        </div>
        <div class="product-footer">
          <div class="product-price">₹${product.price.toLocaleString()} ${origHTML}</div>
          <button class="add-to-cart" onclick="addToCart(event, ${product.id})"><i class="fas fa-plus"></i></button>
        </div>
      </div>
    </div>`;
}

function renderFeatured() {
  document.getElementById('featuredGrid').innerHTML = products.slice(0, 4).map(createProductCard).join('');
}

function renderAllProducts() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;
  const maxPrice = parseInt(document.getElementById('priceFilter').value);
  let filtered = products.filter(p => {
    return p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search);
  }).filter(p => !category || p.category === category).filter(p => p.price <= maxPrice);
  if (sort === 'low') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'high') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  document.getElementById('productCount').textContent = `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
  document.getElementById('allProductsGrid').innerHTML = filtered.length
    ? filtered.map(createProductCard).join('')
    : '<p style="color:var(--text-muted);padding:2rem">No products found. Try adjusting your filters.</p>';
}

function filterProducts() { renderAllProducts(); }

function filterByCategory(cat) {
  showPage('products');
  document.getElementById('categoryFilter').value = cat;
  filterProducts();
}

function updatePrice(val) { document.getElementById('priceLabel').textContent = parseInt(val).toLocaleString(); }

function resetFilters() {
  document.getElementById('categoryFilter').value = '';
  document.getElementById('sortFilter').value = '';
  document.getElementById('priceFilter').value = 5000;
  document.getElementById('priceLabel').textContent = '5,000';
  document.getElementById('searchInput').value = '';
  renderAllProducts();
}

// PRODUCT DETAIL
function showDetail(id) {
  currentDetailId = id;
  detailQty = 1;
  const p = products.find(x => x.id === id);
  if (!p) return;
  const origHTML = p.originalPrice ? `<span style="text-decoration:line-through;color:var(--text-muted);font-size:1rem;font-weight:400;margin-left:0.5rem">₹${p.originalPrice.toLocaleString()}</span>` : '';
  document.getElementById('detailContent').innerHTML = `
    <div class="detail-img">${p.emoji}</div>
    <div class="detail-info">
      <div class="detail-cat">${p.category}</div>
      <h1 class="detail-name">${p.name}</h1>
      <div class="detail-rating">
        <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
        ${p.rating} · ${p.reviews} reviews
      </div>
      <div class="detail-price">₹${p.price.toLocaleString()} ${origHTML}</div>
      <p class="detail-desc">${p.desc}</p>
      <div class="detail-qty">
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <span class="qty-num" id="detailQtyNum">1</span>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
        <button class="btn-primary" onclick="addToCart(null, ${p.id}, true)">
          <i class="fas fa-bag-shopping"></i> Add to Cart
        </button>
      </div>
      <div class="detail-tags">${p.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
    </div>`;
  showPage('detail');
}

function changeQty(delta) {
  detailQty = Math.max(1, detailQty + delta);
  document.getElementById('detailQtyNum').textContent = detailQty;
}

// CART
function saveCart() { localStorage.setItem('shopnest-cart', JSON.stringify(cart)); updateCartCount(); }

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function addToCart(e, id, fromDetail = false) {
  if (e) e.stopPropagation();
  const p = products.find(x => x.id === id);
  if (!p) return;
  const qty = fromDetail ? detailQty : 1;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty });
  saveCart();
  showToast(`${p.name} added to cart 🛒`, 'success');
}

function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart(); renderCart(); }

function changeCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); renderCart(); }
}

function cartSubtotal() {
  return cart.reduce((s, item) => {
    const p = products.find(x => x.id === item.id);
    return s + p.price * item.qty;
  }, 0);
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><i class="fas fa-bag-shopping"></i><h2>Your cart is empty</h2><p>Looks like you haven't added anything yet.</p><br/><button class="btn-primary" onclick="showPage('products')">Start Shopping</button></div>`;
    summary.innerHTML = '';
    return;
  }
  container.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `<div class="cart-item">
      <div class="cart-item-img">${p.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-cat">${p.category}</div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" onclick="changeCartQty(${p.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeCartQty(${p.id}, 1)">+</button>
          </div>
          <div class="cart-item-price">₹${(p.price * item.qty).toLocaleString()}</div>
          <button class="remove-btn" onclick="removeFromCart(${p.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>`;
  }).join('');
  const subtotal = cartSubtotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const discountAmt = Math.round(subtotal * discount);
  const total = subtotal + shipping - discountAmt;
  summary.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-row"><span>Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} items)</span><span>₹${subtotal.toLocaleString()}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:var(--success)">FREE</span>' : '₹' + shipping}</span></div>
    ${discountAmt > 0 ? `<div class="summary-row" style="color:var(--success)"><span>Discount (${discount*100}%)</span><span>−₹${discountAmt}</span></div>` : ''}
    <div class="coupon-row"><input type="text" placeholder="Coupon code" id="couponInput"/><button class="coupon-btn" onclick="applyCoupon()">Apply</button></div>
    <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString()}</span></div>
    <button class="btn-primary full" style="margin-top:1rem" onclick="showPage('checkout')">Proceed to Checkout</button>
    <button class="btn-outline full" style="margin-top:0.75rem" onclick="showPage('products')">Continue Shopping</button>`;
}

function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const coupons = { 'NEST20': 0.20, 'SAVE10': 0.10, 'FIRST15': 0.15 };
  if (coupons[code]) { discount = coupons[code]; showToast(`Coupon applied! ${code} — ${discount*100}% off 🎉`, 'success'); renderCart(); }
  else showToast('Invalid coupon code', 'error');
}

// CHECKOUT
function renderCheckoutSummary() {
  const subtotal = cartSubtotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const discountAmt = Math.round(subtotal * discount);
  const total = subtotal + shipping - discountAmt;
  document.getElementById('orderSummary').innerHTML = `
    <h3>Your Order (${cart.reduce((s,i)=>s+i.qty,0)} items)</h3>
    ${cart.map(item => { const p = products.find(x => x.id === item.id); return `<div class="order-item"><div class="order-item-img">${p.emoji}</div><div class="order-item-name">${p.name} <span style="color:var(--text-muted)">×${item.qty}</span></div><div class="order-item-price">₹${(p.price * item.qty).toLocaleString()}</div></div>`; }).join('')}
    <div style="border-top:1px solid var(--border);padding-top:1rem;margin-top:0.5rem">
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString()}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
      ${discountAmt > 0 ? `<div class="summary-row" style="color:var(--success)"><span>Discount</span><span>−₹${discountAmt}</span></div>` : ''}
      <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString()}</span></div>
    </div>`;
}

function placeOrder() {
  const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'pin'];
  for (const id of required) {
    if (!document.getElementById(id).value.trim()) { showToast('Please fill in all required fields', 'error'); return; }
  }
  if (cart.length === 0) { showToast('Your cart is empty!', 'error'); return; }
  const orderId = 'NEST' + Date.now().toString().slice(-8);
  document.getElementById('orderId').textContent = `Order ID: ${orderId}`;
  cart = []; saveCart(); discount = 0;
  showPage('success');
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

// WISHLIST
function toggleWishlist(e, id) {
  e.stopPropagation();
  const idx = wishlist.indexOf(id);
  if (idx === -1) { wishlist.push(id); showToast('Added to wishlist ❤️', 'success'); }
  else { wishlist.splice(idx, 1); showToast('Removed from wishlist', ''); }
  localStorage.setItem('shopnest-wishlist', JSON.stringify(wishlist));
  renderFeatured(); renderAllProducts();
}

// TOAST
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = `toast show ${type}`;
  setTimeout(() => t.className = 'toast', 2800);
}

// HELPERS
function scrollToFeatured() { document.getElementById('featured').scrollIntoView({ behavior: 'smooth' }); }

// INIT
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount(); renderFeatured();
  document.addEventListener('change', e => {
    if (e.target.name === 'pay') {
      const cardFields = document.getElementById('cardFields');
      if (cardFields) cardFields.style.display = e.target.value === 'card' ? 'block' : 'none';
    }
  });
});
