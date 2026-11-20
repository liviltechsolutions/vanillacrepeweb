const cakes = window.VC_PRODUCTS || [];

const money = value => 'RM ' + Number(value || 0).toFixed(2);
const $ = selector => document.querySelector(selector);
const lowestPrice = cake => Math.min(...cake.variants.filter(variant => variant.inStock).map(variant => variant.price));
let cart = readStore('vcRevampCart', []).filter(item => cakes.some(cake => cake.id === item.id));
let activeFilter = new URLSearchParams(location.search).get('category') || 'all';

function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function drawProducts() {
  const query = ($('#catalog-search')?.value || '').trim().toLowerCase();
  const sort = $('#catalog-sort')?.value || 'featured';
  let visible = cakes.filter(cake => (activeFilter === 'all' || cake.group === activeFilter) && (!query || `${cake.name} ${cake.desc} ${cake.group}`.toLowerCase().includes(query)));
  if (sort === 'price-low') visible.sort((a,b)=>lowestPrice(a)-lowestPrice(b));
  if (sort === 'price-high') visible.sort((a,b)=>lowestPrice(b)-lowestPrice(a));
  $('#product-grid').innerHTML = visible.length ? visible.map(cake => {
    const defaultVariant = cake.variants.filter(variant => variant.inStock).sort((a,b)=>a.price-b.price)[0] || cake.variants[0];
    const allOut = !cake.variants.some(variant => variant.inStock);
    const variants = cake.variants.length > 1 ? `<small><select class="size-choice" aria-label="Choose size for ${safeText(cake.name)}">${[...cake.variants].sort((a,b)=>a.price-b.price).map(variant => `<option value="${safeText(variant.id)}" ${variant.inStock ? '' : 'disabled'} ${variant.id === defaultVariant.id ? 'selected' : ''}>${safeText(variant.label)} &middot; ${money(variant.price)}${variant.inStock ? '' : ' - Sold out'}</option>`).join('')}</select></small>` : `<small>${safeText(defaultVariant.label)}</small>`;
    const category = cake.group === 'premium' ? 'Premium cake' : cake.group === 'batik' ? 'Batik crepe' : 'Classic cake';
    const imagePath = safeText(cake.image);
    const detailUrl = `product.html?id=${encodeURIComponent(cake.id)}`;
    return `<article class="product-card"><div class="product-image"><a class="product-photo" href="${detailUrl}" aria-label="View ${safeText(cake.name)} details"><img src="${imagePath}" alt="${safeText(cake.name)}" loading="lazy"></a><span class="product-badge">${category}</span>${allOut ? '<span class="sold-out-badge">Sold out</span>' : ''}<button class="quick-add" data-add="${cake.id}" aria-label="Quick add ${safeText(cake.name)} to bag" ${allOut ? 'disabled' : ''}>+</button></div><div class="product-info"><div><h3><a class="product-name-link" href="${detailUrl}">${safeText(cake.name)}</a></h3><p>${safeText(cake.desc)}</p><a class="product-details-link" href="${detailUrl}">View details &amp; sizes <span>&rarr;</span></a></div><div class="product-price">${money(defaultVariant.price)}${variants}</div></div></article>`;
  }).join('') : '<div class="no-products">No cakes found. Try another flavour or category.</div>';
  document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => {
    const cake = cakes.find(item => item.id === button.dataset.add);
    const selectedVariant = button.closest('.product-card').querySelector('.size-choice')?.value || cake.variants[0].id;
    addToCart(button.dataset.add, selectedVariant);
  }));
  $('#catalog-count').textContent = `${visible.length} ${visible.length === 1 ? 'treat' : 'treats'}`;
}
function addToCart(id, variantId, quantity = 1) {
  const cake = cakes.find(item => item.id === id);
  if (!cake) return;
  const variant = cake.variants.find(item => item.id === String(variantId)) || cake.variants[0];
  if (!variant?.inStock) { showToast('This cake size is currently unavailable'); return; }
  const size = variant.label;
  const existing = cart.find(item => item.id === id && item.variantId === variant.id);
  if (existing) existing.qty += quantity;
  else cart.push({id, variantId:variant.id, name:cake.name, size, price:variant.price, qty:quantity, image:cake.image});
  saveCart();
  showToast(`${cake.name} added to your bag`);
}
function saveCart() {
  localStorage.setItem('vcRevampCart', JSON.stringify(cart));
  drawCart();
}
function cartSubtotal() { return cart.reduce((sum,item)=>sum+item.price*item.qty,0); }
function cartCount() { return cart.reduce((sum,item)=>sum+item.qty,0); }
function drawCart() {
  $('#bag-count').textContent = cartCount();
  $('#drawer-count').textContent = `(${cartCount()})`;
  $('#subtotal').textContent = money(cartSubtotal());
  $('#cart-items').innerHTML = cart.length ? cart.map((item,index)=>`<div class="cart-line"><div class="cart-thumb"><img src="${safeText(item.image)}" alt="" loading="lazy"></div><div><h3>${safeText(item.name)}</h3><small>${safeText(item.size)} &middot; ${money(item.price)}</small><div class="quantity"><button data-qty="-1" data-index="${index}" aria-label="Decrease quantity">-</button><span>${item.qty}</span><button data-qty="1" data-index="${index}" aria-label="Increase quantity">+</button></div></div><div><div class="line-price">${money(item.price*item.qty)}</div><button class="remove-line" data-remove="${index}">Remove</button></div></div>`).join('') : '<div class="cart-empty"><span>&hearts;</span>Your bag is waiting for<br>a little something lovely.</div>';
  document.querySelectorAll('[data-qty]').forEach(button=>button.onclick=()=>{const item=cart[+button.dataset.index];item.qty+=+button.dataset.qty;if(item.qty<1)cart.splice(+button.dataset.index,1);saveCart()});
  document.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>{cart.splice(+button.dataset.remove,1);saveCart()});
  $('#checkout-button').disabled = !cart.length;
  $('#checkout-button').style.opacity = cart.length ? '1' : '.55';
}
function showToast(message) {
  const element=$('#toast');element.textContent=message;element.classList.add('show');
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>element.classList.remove('show'),2300);
}
function openCart() { $('#cart-drawer').classList.add('open');$('#scrim').classList.add('show');document.body.style.overflow='hidden'; }
function closeCart() { $('#cart-drawer').classList.remove('open');$('#scrim').classList.remove('show');document.body.style.overflow=''; }
function getDeliveryFee() {
  const method = $('#delivery-method')?.value || 'delivery';
  if (method === 'pickup') return 0;
  return 15;
}
function checkoutMarkup() {
  const subtotal=cartSubtotal(),fee=getDeliveryFee();
  const deliveryOptions = `<div class="field full"><label for="delivery-method">How would you like your cake? *</label><select id="delivery-method" name="deliveryMethod" required><option value="delivery">Deliver in Kuala Lumpur / Selangor</option><option value="pickup">Arrange pickup with the team</option></select></div><div class="field full" id="region-field"><label for="delivery-region">Delivery area *</label><select id="delivery-region" name="deliveryRegion" required><option value="kl">Kuala Lumpur / Selangor</option></select><small class="field-hint">Same-day delivery is listed for orders before 12pm, subject to confirmation. The RM15 delivery fee is a sample estimate.</small></div><div class="field full" id="address-field"><label>Delivery address *</label><div class="address-inputs"><input id="address-line1" name="addressLine1" required autocomplete="address-line1" placeholder="House / unit and street"><input id="address-line2" name="addressLine2" autocomplete="address-line2" placeholder="Apartment, suite, floor (optional)"><input id="address-postcode" name="postcode" required autocomplete="postal-code" placeholder="Postcode"><input id="address-city" name="city" required autocomplete="address-level2" placeholder="City"></div></div>`;
  return `<div class="checkout-title"><div class="kicker"><span class="kicker-line"></span> YOUR CAKE IS ALMOST ON ITS WAY</div><h2>Make it <em>yours.</em></h2><p>Choose how to receive your order, then tell us where to send it. All fields marked * are required.</p></div><div class="steps"><div class="step active"><span>1</span> Your details</div><div class="step active"><span>2</span> Delivery</div><div class="step active"><span>3</span> Payment</div></div><div class="checkout-grid"><form class="checkout-form" id="order-form"><h3 class="form-section-title">Who is placing the order?</h3><div class="field"><label for="name">Your full name *</label><input id="name" name="name" required autocomplete="name" placeholder="Your name"></div><div class="field"><label for="phone">Contact number *</label><input id="phone" name="phone" type="tel" required autocomplete="tel" pattern="[+0-9 ()-]{8,20}" placeholder="+60 12 345 6789"></div><div class="field full"><label for="email">Email address *</label><input id="email" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></div><div class="field full"><label for="recipient-name">Recipient name (if different)</label><input id="recipient-name" name="recipientName" autocomplete="off" placeholder="Name of the person receiving the cake"></div>${deliveryOptions}<div class="field"><label for="date">Preferred date *</label><input id="date" name="date" type="date" required min="${minDeliveryDate()}"></div><div class="field"><label for="slot">Preferred time *</label><select id="slot" name="slot" required><option value="">Choose a time</option><option>10:00 am - 1:00 pm</option><option>1:00 pm - 4:00 pm</option><option>4:00 pm - 7:00 pm</option></select></div><div class="field full"><label for="note">Gift message (optional)</label><input id="note" name="note" maxlength="100" placeholder="Happy birthday, with love..."></div><div class="field full"><label for="remarks">Order / delivery remarks (optional)</label><textarea id="remarks" name="remarks" maxlength="300" placeholder="Gate code, landmark, delivery instructions, or anything helpful"></textarea></div><h3 class="form-section-title">Payment method</h3><div class="field full payment-options"><label class="payment-option"><input type="radio" name="payment" value="fiuu" checked> Online banking, cards and e-wallets <span>Powered by Fiuu</span></label><label class="payment-option"><input type="radio" name="payment" value="fpx"> FPX online banking <span>Powered by Fiuu</span></label></div></form><aside class="order-summary"><h3>Your little order</h3><div class="summary-products">${cart.map(item=>`<div class="summary-line"><span>${safeText(item.name)}  &middot;  ${safeText(item.size)}  &middot;  ${item.qty}</span><b>${money(item.price*item.qty)}</b></div>`).join('')}</div><div class="summary-line"><span>Items (${cartCount()})</span><span>${money(subtotal)}</span></div><div class="summary-line" id="delivery-summary"><span>Delivery</span><span>${fee===0?'Free':money(fee)}</span></div><div class="summary-line total"><span>Total</span><span id="checkout-total">${money(subtotal+fee)}</span></div><button type="submit" form="order-form" class="button button-dark pay-button">Place order <span>&rarr;</span></button><div class="fiuu-note">Fiuu payment is not connected in this preview. Payment cannot be completed here. Card details are never entered on this site.</div></aside></div><div class="demo-note">Checkout preview: this browser saves a local order only. It does not send orders to the kitchen or charge a payment method.</div>`;
}
function minDeliveryDate() { const date=new Date();if(date.getHours()>=12)date.setDate(date.getDate()+1);const local=new Date(date.getTime()-date.getTimezoneOffset()*60000);return local.toISOString().slice(0,10); }
function showCheckout() {
  closeCart();$('#checkout-content').innerHTML=checkoutMarkup();$('#checkout-modal').classList.add('show');$('#checkout-modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  $('#order-form').addEventListener('submit',submitOrder);
  $('#delivery-method').addEventListener('change',updateDeliveryFields);
  $('#delivery-region').addEventListener('change',updateCheckoutTotal);
}
function updateDeliveryFields() {
  const pickup=$('#delivery-method').value==='pickup';
  $('#region-field').hidden=pickup;$('#address-field').hidden=pickup;$('#address-line1').required=!pickup;$('#address-postcode').required=!pickup;$('#address-city').required=!pickup;$('#delivery-region').required=!pickup;
  if(pickup) { $('#address-line1').value='';$('#address-line2').value='';$('#address-postcode').value='';$('#address-city').value=''; }
  $('#delivery-summary').innerHTML=`<span>${pickup?'Kitchen pickup':'Delivery'}</span><span>${pickup?'Free':money(getDeliveryFee())}</span>`;
  updateCheckoutTotal();
}
function updateCheckoutTotal() { $('#delivery-summary').querySelector('span:last-child').textContent=getDeliveryFee()===0?'Free':money(getDeliveryFee());$('#checkout-total').textContent=money(cartSubtotal()+getDeliveryFee()); }
async function submitOrder(event) {
  event.preventDefault();
  if(!event.currentTarget.reportValidity())return;
  const form=new FormData(event.currentTarget),orderId='VC-'+Date.now().toString(36).toUpperCase();
  const address=[form.get('addressLine1'),form.get('addressLine2'),form.get('postcode'),form.get('city')].filter(Boolean).join(', ');
  const order={id:orderId,createdAt:new Date().toISOString(),customer:{name:form.get('name'),phone:form.get('phone'),email:form.get('email')},recipient:{name:form.get('recipientName')||form.get('name')},fulfilment:{method:form.get('deliveryMethod'),region:form.get('deliveryRegion'),address,date:form.get('date'),slot:form.get('slot'),note:form.get('note'),remarks:form.get('remarks')},items:cart.map(({id,variantId,name,size,price,qty})=>({id,variantId,name,size,price,qty})),subtotal:cartSubtotal(),deliveryFee:getDeliveryFee(),total:cartSubtotal()+getDeliveryFee(),paymentMethod:form.get('payment'),paymentStatus:'not-connected'};
  const savedOrders=readStore('vcRevampOrders',[]);savedOrders.unshift(order);localStorage.setItem('vcRevampOrders',JSON.stringify(savedOrders));
  $('#checkout-content').innerHTML=`<div class="order-success"><div class="success-mark">&check;</div><h2>Thanks, <em>${safeText(order.customer.name.split(' ')[0])}.</em></h2><p>Your preview order <b>${safeText(order.id)}</b> has been saved in this browser. No payment was taken and the kitchen has not received the order.</p><div class="order-confirmation"><div><span>Order total</span><b>${money(order.total)}</b></div><div><span>${order.fulfilment.method==='pickup'?'Pickup date':'Delivery date'}</span><b>${safeText(order.fulfilment.date)}</b></div><div><span>Payment status</span><b>Not connected</b></div></div><p class="next-step-note">To accept real orders, connect a secure order database and Fiuu hosted checkout credentials.</p><button class="button button-dark" id="done-button">Back to the shop <span>&rarr;</span></button></div>`;
  cart=[];saveCart();$('#done-button').onclick=()=>{$('#checkout-modal').classList.remove('show');$('#checkout-modal').setAttribute('aria-hidden','true');document.body.style.overflow=''};
}

document.querySelectorAll('.filter').forEach(button=>{button.classList.toggle('active',button.dataset.filter===activeFilter);button.addEventListener('click',()=>{document.querySelector('.filter.active')?.classList.remove('active');button.classList.add('active');activeFilter=button.dataset.filter;drawProducts()})});
$('#catalog-search').addEventListener('input',drawProducts);$('#catalog-sort').addEventListener('change',drawProducts);
$('.bag-button').addEventListener('click',openCart);$('.close-drawer').addEventListener('click',closeCart);$('#scrim').addEventListener('click',closeCart);$('#checkout-button').addEventListener('click',showCheckout);
$('.checkout-close').addEventListener('click',()=>{$('#checkout-modal').classList.remove('show');$('#checkout-modal').setAttribute('aria-hidden','true');document.body.style.overflow=''});
$('#checkout-modal').addEventListener('click',event=>{if(event.target.id==='checkout-modal'){$('#checkout-modal').classList.remove('show');document.body.style.overflow=''}});
$('.menu-toggle').addEventListener('click',()=>$('.nav').classList.toggle('open'));document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>$('.nav').classList.remove('open')));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();$('#checkout-modal').classList.remove('show');document.body.style.overflow=''}});
drawProducts();drawCart();
if(new URLSearchParams(location.search).get('bag')==='open')openCart();
