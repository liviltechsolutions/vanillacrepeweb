(() => {
  const cakes = window.VC_PRODUCTS || [];
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const money = value => 'RM ' + Number(value || 0).toFixed(2);
  const cake = cakes.find(item => item.id === new URLSearchParams(location.search).get('id'));
  const root = document.querySelector('#product-detail');
  const readCart = () => { try { return JSON.parse(localStorage.getItem('vcRevampCart')) || []; } catch { return []; } };
  const drawCount = () => { const cart = readCart(); document.querySelector('#bag-count').textContent = cart.reduce((total, item) => total + Number(item.qty || 0), 0); };
  const toast = message => { const node=document.querySelector('#detail-toast');node.textContent=message;node.classList.add('show');setTimeout(()=>node.classList.remove('show'),2400); };
  if (!cake) {
    root.innerHTML = '<div class="detail-loading"><h1>Cake not found</h1><p>It may no longer be available in the shop.</p><a class="button button-dark" href="shop.html">Return to the shop <span>&rarr;</span></a></div>';
    drawCount(); return;
  }
  const group = cake.group === 'premium' ? 'Premium mille crepe cake' : cake.group === 'batik' ? 'Batik crepe' : 'Classic mille crepe cake';
  const variants = [...cake.variants].sort((a,b) => a.price-b.price);
  const stocked = variants.filter(variant => variant.inStock);
  const defaultVariant = stocked[0] || variants[0];
  document.title = `${cake.name} | Vanilla Crepe`;
  document.querySelector('#detail-category').textContent = group;
  root.innerHTML = `<div class="detail-image-wrap"><img class="detail-image" src="${safe(cake.image)}" alt="${safe(cake.name)}"><span class="detail-image-note">HANDCRAFTED IN MALAYSIA</span></div><div class="detail-copy"><div class="kicker"><span class="kicker-line"></span>${safe(group.toUpperCase())}</div><h1>${safe(cake.name)}</h1><p class="detail-desc">${safe(cake.desc)} Explore the available portions below. Slice, 8 inch and 10 inch options are shown when currently listed for this flavour.</p><div class="detail-price" id="detail-price">${money(defaultVariant.price)}</div><label class="detail-label" for="detail-variant">Choose your portion</label><select class="detail-select" id="detail-variant">${variants.map(variant=>`<option value="${safe(variant.id)}" ${variant.id===defaultVariant.id?'selected':''} ${variant.inStock?'':'disabled'}>${safe(variant.label)} · ${money(variant.price)}${variant.inStock?'':' · Sold out'}</option>`).join('')}</select><p class="portion-hint">Choose Slice to add individual slices, or select a whole cake size where available.</p><label class="detail-label" for="detail-quantity">Quantity</label><div class="detail-quantity"><button type="button" id="quantity-minus" aria-label="Decrease quantity">−</button><input id="detail-quantity" type="number" min="1" max="99" value="1" inputmode="numeric" aria-label="Quantity to add"><button type="button" id="quantity-plus" aria-label="Increase quantity">+</button></div><button class="button button-dark detail-add" id="detail-add" ${stocked.length?'':'disabled'}>Add to bag <span>&rarr;</span></button><div class="detail-benefits"><span>♡ Made for sharing</span><span>⌂ KL &amp; Selangor delivery</span></div><a class="detail-delivery-link" href="delivery.html">See delivery information &rarr;</a></div>`;
  const variantSelect = document.querySelector('#detail-variant');
  const quantity = document.querySelector('#detail-quantity');
  const price = document.querySelector('#detail-price');
  const addButton = document.querySelector('#detail-add');
  variantSelect.addEventListener('change', () => { const variant=variants.find(item=>item.id===variantSelect.value);price.textContent=money(variant.price);addButton.disabled=!variant.inStock; });
  document.querySelector('#quantity-minus').addEventListener('click',()=>quantity.value=Math.max(1,(Number(quantity.value)||1)-1));
  document.querySelector('#quantity-plus').addEventListener('click',()=>quantity.value=Math.min(99,(Number(quantity.value)||1)+1));
  addButton.addEventListener('click',()=>{
    const variant=variants.find(item=>item.id===variantSelect.value);
    if(!variant?.inStock){toast('This portion is currently unavailable.');return;}
    const count=Math.min(99,Math.max(1,parseInt(quantity.value,10)||1));
    const cart=readCart();const current=cart.find(item=>item.id===cake.id&&item.variantId===variant.id);
    if(current)current.qty=Math.min(99,Number(current.qty||0)+count);
    else cart.push({id:cake.id,variantId:variant.id,name:cake.name,size:variant.label,price:variant.price,qty:count,image:cake.image});
    localStorage.setItem('vcRevampCart',JSON.stringify(cart));drawCount();toast(`${count} × ${cake.name} (${variant.label}) added to your bag.`);
  });
  drawCount();
})();
