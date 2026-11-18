const cakes=[
 {id:'vanilla',name:'Vanilla Mille Crêpe',kind:'classic',tag:'A little classic',desc:'Soft vanilla cream, layer upon delicate layer.',p8:99,p10:150,img:'p-vanilla'},
 {id:'milo',name:'Milo Mille Crêpe',kind:'premium',tag:'Local favourite',desc:'Chocolate malt in a cloud of smooth cream.',p8:125,p10:170,img:'p-milo'},
 {id:'matcha',name:'Niko Neko Matcha',kind:'premium',tag:'A little special',desc:'Deep, mellow matcha with a sweet finish.',p8:125,p10:170,img:'p-matcha'},
 {id:'tiramisu',name:'Tiramisu Mille Crêpe',kind:'classic',tag:'Coffee & cocoa',desc:'A lovely pick-me-up with espresso and cocoa.',p8:99,p10:150,img:'p-tiramisu'},
 {id:'oreo',name:'Oreo Mille Crêpe',kind:'classic',tag:'Crowd pleaser',desc:'Chocolate cookies folded into silky cream.',p8:99,p10:150,img:'p-oreo'},
 {id:'rainbow',name:'Rainbow Mille Crêpe',kind:'classic',tag:'For the joy of it',desc:'Colourful layers, a gentle Madagascar vanilla.',p8:99,p10:150,img:'p-rainbow'},
 {id:'cup',name:'Vanilla Crêpe Cup',kind:'little',tag:'A little treat',desc:'All the lovely layers, in a cup to go.',p8:12.9,p10:12.9,img:'p-cup',single:true},
 {id:'batik',name:'Chocolate Batik Cup',kind:'little',tag:'Local favourite',desc:'Chocolate batik with a soft, creamy finish.',p8:12.9,p10:12.9,img:'p-batik',single:true}
];
let cart=JSON.parse(localStorage.getItem('vcRevampCart')||'[]');
const money=n=>'RM '+Number(n).toFixed(2);
const $=s=>document.querySelector(s);
function drawProducts(filter='all'){
 const visible=cakes.filter(c=>filter==='all'||c.kind===filter);
 $('#product-grid').innerHTML=visible.map(c=>`<article class="product-card"><div class="product-image ${c.img}"><div class="product-photo"></div><span class="product-badge">${c.tag}</span><button class="quick-add" data-add="${c.id}" aria-label="Add ${c.name} to bag">+</button></div><div class="product-info"><div><h3>${c.name}</h3><p>${c.desc}</p></div><div class="product-price">${money(c.p8)}${c.single?'<small>single cup</small>':`<small><select class="size-choice" aria-label="Choose cake size for ${c.name}"><option value="8 inch">8 inch</option><option value="10 inch">10 inch · ${money(c.p10)}</option></select></small>`}</div></div></article>`).join('');
 document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>{const size=btn.closest('.product-card').querySelector('.size-choice')?.value||'single cup';add(btn.dataset.add,size)}));
}
function saveCart(){localStorage.setItem('vcRevampCart',JSON.stringify(cart));drawCart()}
function add(id,size='8 inch'){
 const cake=cakes.find(c=>c.id===id);if(!cake)return;
 if(cake.single)size='single cup';
 const price=size==='10 inch'?cake.p10:cake.p8;
 const existing=cart.find(i=>i.id===id&&i.size===size);
 if(existing)existing.qty++;else cart.push({id,name:cake.name,size,price,qty:1,img:cake.img});
 saveCart();toast(`${cake.name} added to your bag`);
}
function drawCart(){
 const count=cart.reduce((n,i)=>n+i.qty,0),sub=cart.reduce((n,i)=>n+i.price*i.qty,0);
 $('#bag-count').textContent=count;$('#drawer-count').textContent=`(${count})`;
 $('#subtotal').textContent=money(sub);
 $('#cart-items').innerHTML=cart.length?cart.map((i,n)=>`<div class="cart-line"><div class="cart-thumb" style="background-position:${i.img==='p-milo'?'0% 41%':'100% 24%'}"></div><div><h3>${i.name}</h3><small>${i.size} · ${money(i.price)}</small><div class="quantity"><button data-qty="-1" data-index="${n}" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-qty="1" data-index="${n}" aria-label="Increase quantity">+</button></div></div><div><div class="line-price">${money(i.price*i.qty)}</div><button class="remove-line" data-remove="${n}">Remove</button></div></div>`).join(''):`<div class="cart-empty"><span>♡</span>Your bag is waiting for<br>a little something lovely.</div>`;
 document.querySelectorAll('[data-qty]').forEach(b=>b.onclick=()=>{const i=cart[+b.dataset.index];i.qty+=+b.dataset.qty;if(i.qty<1)cart.splice(+b.dataset.index,1);saveCart()});
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.remove,1);saveCart()});
 $('#checkout-button').disabled=!cart.length;$('#checkout-button').style.opacity=cart.length?'1':'.55';
}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
function openCart(){$('#cart-drawer').classList.add('open');$('#scrim').classList.add('show');document.body.style.overflow='hidden'}
function closeCart(){$('#cart-drawer').classList.remove('open');$('#scrim').classList.remove('show');document.body.style.overflow=''}
function checkoutMarkup(){
 const sub=cart.reduce((n,i)=>n+i.price*i.qty,0);
 return `<div class="checkout-title"><div class="kicker"><span class="kicker-line"></span> A FEW DETAILS, THEN THE GOOD PART</div><h2>Make it <em>yours.</em></h2><p>Tell us where to send your little box of joy. Fields marked * are required.</p></div><div class="steps"><div class="step active"><span>1</span> Delivery details</div><div class="step active"><span>2</span> Payment</div><div class="step"><span>3</span> Confirmation</div></div><div class="checkout-grid"><form class="checkout-form" id="order-form"><h3 class="form-section-title">Who’s receiving the cake?</h3><div class="field"><label for="name">Full name *</label><input id="name" name="name" required autocomplete="name" placeholder="Your name"></div><div class="field"><label for="phone">Phone number *</label><input id="phone" name="phone" required autocomplete="tel" placeholder="+60 12 345 6789"></div><div class="field full"><label for="email">Email address *</label><input id="email" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></div><div class="field full"><label for="address">Delivery address *</label><textarea id="address" name="address" required autocomplete="street-address" placeholder="House / unit, street, postcode, city"></textarea></div><div class="field"><label for="date">Delivery date *</label><input id="date" name="date" type="date" required min="${new Date(Date.now()+86400000).toISOString().slice(0,10)}"></div><div class="field"><label for="slot">Preferred time *</label><select id="slot" name="slot" required><option value="">Choose a time</option><option>10:00 am – 1:00 pm</option><option>1:00 pm – 4:00 pm</option><option>4:00 pm – 7:00 pm</option></select></div><div class="field full"><label for="note">A little note for the box (optional)</label><input id="note" name="note" maxlength="100" placeholder="Happy birthday, with love…"></div><div class="field full"><label for="remarks">Delivery notes (optional)</label><input id="remarks" name="remarks" placeholder="Gate code, landmark, or anything helpful"></div><h3 class="form-section-title">Choose your payment</h3><div class="field full payment-options"><label class="payment-option"><input type="radio" name="payment" value="fiuu" checked> Online banking, cards & e-wallets <span>Secure via Fiuu</span></label><label class="payment-option"><input type="radio" name="payment" value="fpx"> FPX online banking <span>Secure via Fiuu</span></label></div></form><aside class="order-summary"><h3>Your little order</h3><div class="summary-products">${cart.map(i=>`<div class="summary-line"><span>${i.name} · ${i.size} × ${i.qty}</span><b>${money(i.price*i.qty)}</b></div>`).join('')}</div><div class="summary-line"><span>Delivery</span><span>Calculated after address</span></div><div class="summary-line total"><span>Subtotal</span><span>${money(sub)}</span></div><button type="submit" form="order-form" class="button button-dark pay-button">Continue to Fiuu <span>→</span></button><div class="fiuu-note">You’ll be securely redirected to Fiuu to complete payment. Your order is confirmed once payment succeeds.</div></aside></div>`;
}
function showCheckout(){closeCart();$('#checkout-content').innerHTML=checkoutMarkup();$('#checkout-modal').classList.add('show');$('#checkout-modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#order-form').addEventListener('submit',submitOrder)}
function submitOrder(e){e.preventDefault();if(!e.currentTarget.reportValidity())return;const form=new FormData(e.currentTarget),order='VC-'+Math.random().toString(36).slice(2,8).toUpperCase();
 $('#checkout-content').innerHTML=`<div class="order-success"><div class="success-mark">✓</div><h2>Lovely choice, <em>${escapeHtml(form.get('name').split(' ')[0])}.</em></h2><p>Your order details are ready. In a live shop, you’d now continue to Fiuu’s secure payment page. This preview doesn’t process payments yet.</p><div class="order-id">PREVIEW ORDER · ${order}</div><button class="button button-dark" id="done-button">Back to the good stuff <span>↗</span></button></div>`;
 cart=[];saveCart();$('#done-button').onclick=()=>{$('#checkout-modal').classList.remove('show');$('#checkout-modal').setAttribute('aria-hidden','true');document.body.style.overflow=''};
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.filter.active')?.classList.remove('active');b.classList.add('active');drawProducts(b.dataset.filter)}));
$('.bag-button').addEventListener('click',openCart);$('.close-drawer').addEventListener('click',closeCart);$('#scrim').addEventListener('click',closeCart);$('#checkout-button').addEventListener('click',showCheckout);$('.checkout-close').addEventListener('click',()=>{$('#checkout-modal').classList.remove('show');$('#checkout-modal').setAttribute('aria-hidden','true');document.body.style.overflow=''});
$('#checkout-modal').addEventListener('click',e=>{if(e.target.id==='checkout-modal'){$('#checkout-modal').classList.remove('show');document.body.style.overflow=''}});
$('.menu-toggle').addEventListener('click',()=>$('.nav').classList.toggle('open'));document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>$('.nav').classList.remove('open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();$('#checkout-modal').classList.remove('show');document.body.style.overflow=''}});
drawProducts();drawCart();
