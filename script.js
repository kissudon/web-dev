// Simple product rendering + cart behaviour
const products = [
  { id: 1, name: "Bananas (1 kg)", price: 40, img: "https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?auto=format&fit=crop&w=800&q=60" },
  { id: 2, name: "Tomatoes (500 g)", price: 30, img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=60" },
  { id: 3, name: "Milk (1 L)", price: 55, img: "https://images.unsplash.com/photo-1582719478172-3c5f2ce0bdfc?auto=format&fit=crop&w=800&q=60" },
  { id: 4, name: "Potato (1 kg)", price: 28, img: "https://images.unsplash.com/photo-1502741126161-b048400d6f6d?auto=format&fit=crop&w=800&q=60" },
  { id: 5, name: "Orange Juice (1 L)", price: 120, img: "https://images.unsplash.com/photo-1625102676483-0ee2d0a1f3a4?auto=format&fit=crop&w=800&q=60" },
  { id: 6, name: "Potato Chips", price: 60, img: "https://images.unsplash.com/photo-1604908177522-2c8a0ef93f6b?auto=format&fit=crop&w=800&q=60" }
];

const state = {
  cart: {} // id -> qty
};

function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

function renderProducts(list){
  const grid = $("#productsGrid");
  grid.innerHTML = "";
  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="${p.name}"></div>
      <h4>${p.name}</h4>
      <div class="meta"><div>₹${p.price}</div><div class="muted">200 g - 1 pc</div></div>
      <div class="actions">
        <button class="add-btn" data-id="${p.id}">Add</button>
        <div class="price">₹${p.price}</div>
      </div>
    `;
    grid.appendChild(card);
  });
  // attach listeners
  $all(".add-btn").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const id = Number(e.currentTarget.dataset.id);
      addToCart(id);
    });
  });
}

function addToCart(id){
  state.cart[id] = (state.cart[id]||0) + 1;
  updateCounts();
  animateAdd();
}

function updateCounts(){
  const total = Object.values(state.cart).reduce((s,n)=>s+n,0);
  $("#cartCount").textContent = total;
  $("#floatingCount").textContent = total;
}

function animateAdd(){
  const btn = document.querySelector(".floating-cart");
  btn.animate([{ transform: "scale(1)" },{ transform: "scale(1.08)" },{ transform: "scale(1)" }],{ duration:250, easing:"ease-out" });
}

function openCart(){
  const lines = Object.entries(state.cart).map(([id,qty])=>{
    const p = products.find(x=>x.id===+id);
    return `${p.name} x ${qty} — ₹${p.price*qty}`;
  });
  const total = Object.entries(state.cart).reduce((s,[id,qty])=>{
    const p=products.find(x=>x.id===+id);
    return s + p.price*qty;
  },0);
  if(lines.length===0){
    alert("Your cart is empty — add something tasty!");
    return;
  }
  alert(lines.join("\n") + `\n\nTotal: ₹${total}`);
}

function setupSearch(){
  const input = $("#search");
  input.addEventListener("input", (e)=>{
    const q = e.target.value.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    renderProducts(filtered);
  });
  $("#searchBtn").addEventListener("click", ()=> {
    const q = input.value.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    renderProducts(filtered);
  });
}

function setupUI(){
  renderProducts(products);
  setupSearch();
  $("#floatingCart").addEventListener("click", openCart);
  $("#cartBtn").addEventListener("click", openCart);
  $(".cta")?.addEventListener("click", ()=>{
    const addr = document.querySelector(".address").value || "your location";
    alert("Thanks — we'll deliver to " + addr + " soon!");
  });
}

// init
document.addEventListener("DOMContentLoaded", setupUI);
