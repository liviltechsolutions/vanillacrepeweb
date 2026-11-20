const cakes = [
  { id:'tiramisu', name:'Tiramisu Mille Crepe', group:'classic', desc:'Coffee cream with cocoa and espresso.', p8:99, p10:150, pos:'56% 13%', tag:'Coffee & cocoa' },
  { id:'earl-grey', name:'Earl Grey Mille Crepe', group:'classic', desc:'A fragrant tea cream with a delicate finish.', p8:99, p10:150, pos:'74% 13%', tag:'Tea time' },
  { id:'rainbow', name:'Rainbow Mille Crepe', group:'classic', desc:'Colourful layers with Madagascar vanilla.', p8:99, p10:150, pos:'92% 13%', tag:'For the joy of it' },
  { id:'green-tea', name:'Green Tea Mille Crepe', group:'classic', desc:'Rich, smooth matcha with a sweet finish.', p8:99, p10:150, pos:'56% 30%', tag:'Tea time' },
  { id:'vanilla', name:'Vanilla Mille Crepe', group:'classic', desc:'Creamy vanilla buttercream, layer upon layer.', p8:99, p10:150, pos:'74% 30%', tag:'A little classic' },
  { id:'almond-caramel', name:'Almond Caramel Mille Crepe', group:'classic', desc:'Gooey caramel and toasted almond nuts.', p8:99, p10:150, pos:'92% 30%', tag:'Sweet & salty' },
  { id:'chocolate', name:'Chocolate Mille Crepe', group:'classic', desc:'Chocolate crepes with Belgian chocolate cream.', p8:99, p10:150, pos:'56% 48%', tag:'Chocolate lover' },
  { id:'oreo', name:'Oreo Mille Crepe', group:'classic', desc:'A crowd-pleasing cookies and cream favourite.', p8:99, p10:150, pos:'74% 48%', tag:'Crowd pleaser' },
  { id:'pandan', name:'Pandan Mille Crepe', group:'classic', desc:'Aromatic pandan with a touch of gula melaka.', p8:99, p10:150, pos:'92% 48%', tag:'Local favourite' },
  { id:'blueberry', name:'Blueberry Mille Crepe', group:'classic', desc:'Soft cream topped with a bright berry compote.', p8:99, p10:150, pos:'56% 66%', tag:'Fruity favourite' },
  { id:'mango', name:'Mango Mille Crepe', group:'classic', desc:'Tropical mango and a taste of ripe peach.', p8:99, p10:150, pos:'74% 66%', tag:'A little sunshine' },
  { id:'lemon', name:'Lemon Mille Crepe', group:'classic', desc:'Bright lemon with a sweet, tangy centre.', p8:99, p10:150, pos:'92% 66%', tag:'Bright & citrusy' },
  { id:'strawberry', name:'Strawberry Mille Crepe', group:'classic', desc:'Sweet cream with a fresh strawberry finish.', p8:99, p10:150, pos:'56% 84%', tag:'Berry sweet' },
  { id:'bamboo-charcoal', name:'Bamboo Charcoal Mille Crepe', group:'classic', desc:'A striking dark crepe with a smooth cream centre.', p8:99, p10:150, pos:'74% 84%', tag:'A little different' },
  { id:'macadamia-caramel', name:'Macadamia Almond Caramel', group:'classic', desc:'Toasted nuts with a sweet caramel finish.', p8:99, p10:150, pos:'92% 84%', tag:'Nutty & lovely' },
  { id:'kitkat', name:'KitKat Mille Crepe', group:'premium', desc:'Chocolate wafer balls in every indulgent bite.', p8:125, p10:170, pos:'4% 30%', tag:'Chocolate lover' },
  { id:'milo', name:'Milo Mille Crepe', group:'premium', desc:"Everyone's favourite chocolate malt, layered.", p8:125, p10:170, pos:'24% 30%', tag:'Local favourite' },
  { id:'famous-amos', name:'Famous Amos Mille Crepe', group:'premium', desc:'Chocolate chip cookies and a creamy filling.', p8:125, p10:170, pos:'43% 30%', tag:'Cookie crush' },
  { id:'yam', name:'Yam Mille Crepe', group:'premium', desc:'Mild, sweet yam in a soft purple crepe.', p8:125, p10:170, pos:'4% 49%', tag:'A little special' },
  { id:'cappuccino', name:'Cappuccino Mille Crepe', group:'premium', desc:'A comforting blend of rich coffee and cream.', p8:125, p10:170, pos:'24% 49%', tag:'Coffee & cocoa' },
  { id:'lemon-cheese', name:'Lemon Cheese Mille Crepe', group:'premium', desc:'Creamy cheese and lemon, bright and balanced.', p8:125, p10:170, pos:'43% 49%', tag:'Bright & citrusy' },
  { id:'orange', name:'Orange Mille Crepe', group:'premium', desc:'Delicate crepes with a sweet citrus note.', p8:125, p10:170, pos:'4% 68%', tag:'Bright & citrusy' },
  { id:'niko-neko-matcha', name:'Niko Neko Matcha Mille Crepe', group:'premium', desc:'Smooth premium matcha with a gentle sweetness.', p8:125, p10:170, pos:'24% 68%', tag:'A little special' },
  { id:'durian', name:'Durian Mille Crepe', group:'premium', desc:'A rich durian treat for the devoted fan.', p8:168, p10:null, pos:'43% 68%', tag:'Durian favourite' },
  ...['Tiramisu','Vanilla','Mango','Strawberry','Rainbow','Oreo','Chocolate','Green Tea'].map((flavour,i)=>({id:'cup-'+i,name:flavour+' Crepe Cup',group:'cup',desc:'Our much-loved crepe layers, made into a cup.',p8:12.9,p10:null,single:true,pos:'50% 50%',tag:'Little treat'})),
  ...['Chocolate','Matcha','Strawberry'].map((flavour,i)=>({id:'batik-'+i,name:flavour+' Batik Cup',group:'batik',desc:'A soft, creamy batik cup for a little treat.',p8:12.9,p10:null,single:true,pos:'50% 50%',tag:'Little treat',batik:true}))
];

const money = value => 'RM ' + Number(value || 0).toFixed(2);
const $ = selector => document.querySelector(selector);
let cart = readStore('vcRevampCart', []);
let activeFilter = 'all';

function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function imageClass(product) {
  if (product.batik) return 'p-batik';
  if (product.group === 'cup') return 'p-cup';
  return 'p-menu';
}
function drawProducts() {
  const query = ($('#catalog-search')?.value || '').trim().toLowerCase();
  const sort = $('#catalog-sort')?.value || 'featured';
  let visible = cakes.filter(cake => (activeFilter === 'all' || cake.group === activeFilter) && (!query || `${cake.name} ${cake.desc} ${cake.tag}`.toLowerCase().includes(query)));
  if (sort === 'price-low') visible.sort((a,b)=>a.p8-b.p8);
  if (sort === 'price-high') visible.sort((a,b)=>b.p8-a.p8);
  $('#product-grid').innerHTML = visible.length ? visible.map(cake => {
    const sizes = cake.single ? '' : `<small><select class="size-choice" aria-label="Choose size for ${safeText(cake.name)}"><option value="8 inch">8 inch  &middot;  ${money(cake.p8)}</option>${cake.p10 ? `<option value="10 inch">10 inch  &middot;  ${money(cake.p10)}</option>` : ''}</select></small>`;
    return `<article class="product-card"><div class="product-image ${imageClass(cake)}"><div class="product-photo" style="background-position:${cake.pos}"></div><span class="product-badge">${safeText(cake.tag)}</span><button class="quick-add" data-add="${cake.id}" aria-label="Add ${safeText(cake.name)} to bag">+</button></div><div class="product-info"><div><h3>${safeText(cake.name)}</h3><p>${safeText(cake.desc)}</p></div><div class="product-price">${money(cake.p8)}${cake.single ? '<small>single cup</small>' : sizes}</div></div></article>`;
  }).join('') : '<div class="no-products">No cakes found. Try another flavour or category.</div>';
  document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => {
    const size = button.closest('.product-card').querySelector('.size-choice')?.value || 'single cup';
    addToCart(button.dataset.add, size);
  }));
  $('#catalog-count').textContent = `${visible.length} ${visible.length === 1 ? 'treat' : 'treats'}`;
}
function addToCart(id, size) {
  const cake = cakes.find(item => item.id === id);
  if (!cake) return;
  const price = size === '10 inch' ? cake.p10 : cake.p8;
  const existing = cart.find(item => item.id === id && item.size === size);
  if (existing) existing.qty += 1;
  else cart.push({id, name:cake.name, size, price, qty:1, img:imageClass(cake), pos:cake.pos});
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
  $('#cart-items').innerHTML = cart.length ? cart.map((item,index)=>`<div class="cart-line"><div class="cart-thumb ${item.img}" style="background-position:${item.pos||'50% 40%'}"></div><div><h3>${safeText(item.name)}</h3><small>${safeText(item.size)}  &middot;  ${money(item.price)}</small><div class="quantity"><button data-qty="-1" data-index="${index}" aria-label="Decrease quantity">-</button><span>${item.qty}</span><button data-qty="1" data-index="${index}" aria-label="Increase quantity">+</button></div></div><div><div class="line-price">${money(item.price*item.qty)}</div><button class="remove-line" data-remove="${index}">Remove</button></div></div>`).join('') : '<div class="cart-empty"><span>&hearts;</span>Your bag is waiting for<br>a little something lovely.</div>';
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
  return $('#delivery-region')?.value === 'other' ? 30 : 15;
}
function checkoutMarkup() {
  const subtotal=cartSubtotal(),fee=getDeliveryFee();
  const deliveryOptions = `<div class="field full"><label for="delivery-method">How would you like your cake? *</label><select id="delivery-method" name="deliveryMethod" required><option value="delivery">Deliver to an address</option><option value="pickup">Pick up from our kitchen</option></select></div><div class="field full" id="region-field"><label for="delivery-region">Delivery area *</label><select id="delivery-region" name="deliveryRegion" required><option value="kl">Kuala Lumpur / Selangor  &middot;  ${money(15)}</option><option value="other">Other areas in Peninsular Malaysia  &middot;  ${money(30)}</option></select><small class="field-hint">Delivery fees shown are sample rates and need confirmation before launch.</small></div><div class="field full" id="address-field"><label for="address">Street address *</label><textarea id="address" name="address" required autocomplete="street-address" placeholder="House / unit, street, postcode, city"></textarea></div>`;
  return `<div class="checkout-title"><div class="kicker"><span class="kicker-line"></span> YOUR CAKE IS ALMOST ON ITS WAY</div><h2>Make it <em>yours.</em></h2><p>Choose how to receive your order, then tell us where to send it. All fields marked * are required.</p></div><div class="steps"><div class="step active"><span>1</span> Your details</div><div class="step active"><span>2</span> Delivery</div><div class="step active"><span>3</span> Payment</div></div><div class="checkout-grid"><form class="checkout-form" id="order-form"><h3 class="form-section-title">Who is receiving the cake?</h3><div class="field"><label for="name">Full name *</label><input id="name" name="name" required autocomplete="name" placeholder="Your name"></div><div class="field"><label for="phone">Phone number *</label><input id="phone" name="phone" type="tel" required autocomplete="tel" pattern="[+0-9 ()-]{8,20}" placeholder="+60 12 345 6789"></div><div class="field full"><label for="email">Email address *</label><input id="email" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></div>${deliveryOptions}<div class="field"><label for="date">Preferred date *</label><input id="date" name="date" type="date" required min="${minDeliveryDate()}"></div><div class="field"><label for="slot">Preferred time *</label><select id="slot" name="slot" required><option value="">Choose a time</option><option>10:00 am - 1:00 pm</option><option>1:00 pm - 4:00 pm</option><option>4:00 pm - 7:00 pm</option></select></div><div class="field full"><label for="note">Gift message (optional)</label><input id="note" name="note" maxlength="100" placeholder="Happy birthday, with love..."></div><div class="field full"><label for="remarks">Delivery notes (optional)</label><input id="remarks" name="remarks" maxlength="160" placeholder="Gate code, landmark, or anything helpful"></div><h3 class="form-section-title">Payment method</h3><div class="field full payment-options"><label class="payment-option"><input type="radio" name="payment" value="fiuu" checked> Online banking, cards and e-wallets <span>Powered by Fiuu</span></label><label class="payment-option"><input type="radio" name="payment" value="fpx"> FPX online banking <span>Powered by Fiuu</span></label></div></form><aside class="order-summary"><h3>Your little order</h3><div class="summary-products">${cart.map(item=>`<div class="summary-line"><span>${safeText(item.name)}  &middot;  ${safeText(item.size)}  &middot;  ${item.qty}</span><b>${money(item.price*item.qty)}</b></div>`).join('')}</div><div class="summary-line"><span>Items (${cartCount()})</span><span>${money(subtotal)}</span></div><div class="summary-line" id="delivery-summary"><span>Delivery</span><span>${fee===0?'Free':money(fee)}</span></div><div class="summary-line total"><span>Total</span><span id="checkout-total">${money(subtotal+fee)}</span></div><button type="submit" form="order-form" class="button button-dark pay-button">Place order <span>&rarr;</span></button><div class="fiuu-note">Fiuu payment is not connected in this preview. Payment cannot be completed here. Card details are never entered on this site.</div></aside></div><div class="demo-note">Checkout preview: this browser saves a local order only. It does not send orders to the kitchen or charge a payment method.</div>`;
}
function minDeliveryDate() { const date=new Date();date.setDate(date.getDate()+2);const local=new Date(date.getTime()-date.getTimezoneOffset()*60000);return local.toISOString().slice(0,10); }
function showCheckout() {
  closeCart();$('#checkout-content').innerHTML=checkoutMarkup();$('#checkout-modal').classList.add('show');$('#checkout-modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  $('#order-form').addEventListener('submit',submitOrder);
  $('#delivery-method').addEventListener('change',updateDeliveryFields);
  $('#delivery-region').addEventListener('change',updateCheckoutTotal);
}
function updateDeliveryFields() {
  const pickup=$('#delivery-method').value==='pickup';
  $('#region-field').hidden=pickup;$('#address-field').hidden=pickup;$('#address').required=!pickup;$('#delivery-region').required=!pickup;
  if(pickup) $('#address').value='';
  $('#delivery-summary').innerHTML=`<span>${pickup?'Kitchen pickup':'Delivery'}</span><span>${pickup?'Free':money(getDeliveryFee())}</span>`;
  updateCheckoutTotal();
}
function updateCheckoutTotal() { $('#delivery-summary').querySelector('span:last-child').textContent=getDeliveryFee()===0?'Free':money(getDeliveryFee());$('#checkout-total').textContent=money(cartSubtotal()+getDeliveryFee()); }
async function submitOrder(event) {
  event.preventDefault();
  if(!event.currentTarget.reportValidity())return;
  const form=new FormData(event.currentTarget),orderId='VC-'+Date.now().toString(36).toUpperCase();
  const order={id:orderId,createdAt:new Date().toISOString(),customer:{name:form.get('name'),phone:form.get('phone'),email:form.get('email')},fulfilment:{method:form.get('deliveryMethod'),region:form.get('deliveryRegion'),address:form.get('address'),date:form.get('date'),slot:form.get('slot'),note:form.get('note'),remarks:form.get('remarks')},items:cart.map(({id,name,size,price,qty})=>({id,name,size,price,qty})),subtotal:cartSubtotal(),deliveryFee:getDeliveryFee(),total:cartSubtotal()+getDeliveryFee(),paymentMethod:form.get('payment'),paymentStatus:'not-connected'};
  const savedOrders=readStore('vcRevampOrders',[]);savedOrders.unshift(order);localStorage.setItem('vcRevampOrders',JSON.stringify(savedOrders));
  $('#checkout-content').innerHTML=`<div class="order-success"><div class="success-mark">&check;</div><h2>Thanks, <em>${safeText(order.customer.name.split(' ')[0])}.</em></h2><p>Your preview order <b>${safeText(order.id)}</b> has been saved in this browser. No payment was taken and the kitchen has not received the order.</p><div class="order-confirmation"><div><span>Order total</span><b>${money(order.total)}</b></div><div><span>${order.fulfilment.method==='pickup'?'Pickup date':'Delivery date'}</span><b>${safeText(order.fulfilment.date)}</b></div><div><span>Payment status</span><b>Not connected</b></div></div><p class="next-step-note">To accept real orders, connect a secure order database and Fiuu hosted checkout credentials.</p><button class="button button-dark" id="done-button">Back to the shop <span>&rarr;</span></button></div>`;
  cart=[];saveCart();$('#done-button').onclick=()=>{$('#checkout-modal').classList.remove('show');$('#checkout-modal').setAttribute('aria-hidden','true');document.body.style.overflow=''};
}

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.filter.active')?.classList.remove('active');button.classList.add('active');activeFilter=button.dataset.filter;drawProducts()}));
$('#catalog-search').addEventListener('input',drawProducts);$('#catalog-sort').addEventListener('change',drawProducts);
$('.bag-button').addEventListener('click',openCart);$('.close-drawer').addEventListener('click',closeCart);$('#scrim').addEventListener('click',closeCart);$('#checkout-button').addEventListener('click',showCheckout);
$('.checkout-close').addEventListener('click',()=>{$('#checkout-modal').classList.remove('show');$('#checkout-modal').setAttribute('aria-hidden','true');document.body.style.overflow=''});
$('#checkout-modal').addEventListener('click',event=>{if(event.target.id==='checkout-modal'){$('#checkout-modal').classList.remove('show');document.body.style.overflow=''}});
$('.menu-toggle').addEventListener('click',()=>$('.nav').classList.toggle('open'));document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>$('.nav').classList.remove('open')));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();$('#checkout-modal').classList.remove('show');document.body.style.overflow=''}});
drawProducts();drawCart();
