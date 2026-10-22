let products = [{name:'', qty:1, price:100}];

function addProduct(){
  products.push({name:'', qty:1, price:0});
  render();
}

function removeProduct(i){
  if(products.length>1){ products.splice(i,1); render(); }
}

function render(){
  const list = document.getElementById('productList');
  list.innerHTML = products.map((p,i)=>`
    <div class="product-item">
      <span class="del" onclick="removeProduct(${i})">✕</span>
      <input placeholder="Product name" value="${p.name}" oninput="products[${i}].name=this.value;calc()">
      <div class="row">
        <input type="number" placeholder="Qty" value="${p.qty}" min="1" oninput="products[${i}].qty=this.value;calc()">
        <input type="number" placeholder="Price ₹" value="${p.price}" min="0" oninput="products[${i}].price=this.value;calc()">
      </div>
    </div>
  `).join('');
  calc();
}

function calc(){
  let sub = 0;
  products.forEach(p=> sub += (parseFloat(p.qty)||0)*(parseFloat(p.price)||0));
  
  const discP = parseFloat(discount.value)||0;
  const gstP = parseFloat(gst.value)||0;
  const ship = parseFloat(shipping.value)||0;

  const disAmt = sub*(discP/100);
  const afterDis = sub - disAmt;
  const gstAmt = afterDis*(gstP/100);
  const grand = afterDis + gstAmt + ship;

  subEl = sub.toFixed(2); 
  document.getElementById('sub').innerText = sub.toFixed(2);
  document.getElementById('dis').innerText = disAmt.toFixed(2);
  document.getElementById('gstAmt').innerText = gstAmt.toFixed(2);
  document.getElementById('shipAmt').innerText = ship.toFixed(2);
  document.getElementById('grand').innerText = grand.toFixed(2);

  // Preview update
  document.getElementById('pCompany').innerText = company.value || 'Your Company';
  document.getElementById('pAddr').innerText = companyAddr.value || 'Company Address';
  document.getElementById('pCustomer').innerText = customer.value || 'Customer Name';
  document.getElementById('pMobile').innerText = mobile.value || 'Mobile';
  document.getElementById('pInvNo').innerText = invNo.value || 'INV001';
  document.getElementById('pDateTime').innerText = (date.value||'') + ' ' + (time.value||'');

  document.getElementById('pProducts').innerHTML = products.map((p,i)=>{
    const t = (p.qty||0)*(p.price||0);
    return `<tr><td>${i+1}</td><td>${p.name||'-'}</td><td>${p.qty}</td><td>₹${p.price}</td><td>₹${t.toFixed(2)}</td></tr>`
  }).join('');

  document.getElementById('pSub').innerText = '₹'+sub.toFixed(2);
  document.getElementById('pDis').innerText = '-₹'+disAmt.toFixed(2);
  document.getElementById('pGst').innerText = '+₹'+gstAmt.toFixed(2);
  document.getElementById('pShip').innerText = '+₹'+ship.toFixed(2);
  document.getElementById('pGrand').innerText = '₹'+grand.toFixed(2);
}

window.onload = ()=>{
  const now = new Date();
  date.valueAsDate = now;
  time.value = now.toTimeString().slice(0,5);
  invNo.value = 'INV'+Math.floor(1000+Math.random()*9000);
  render();
  ['company','companyAddr','customer','mobile','date','time','invNo','discount','gst','shipping'].forEach(id=>{
    document.getElementById(id).addEventListener('input', calc);
  });
};

function generateInvoice(){
  calc();
  document.getElementById('invoicePreview').scrollIntoView({behavior:'smooth'});
}