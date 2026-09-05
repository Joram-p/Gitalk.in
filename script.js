let cart = [];

function addToCart(name, price) {

  cart.push({
    name: name,
    price: price
  });

  updateCart();

  alert(name + " Cart में add हो गया!");
}

function updateCart() {

  document.getElementById("cartCount").innerText = cart.length;

  let items = "";
  let total = 0;

  cart.forEach((item, index) => {

    total += item.price;

    items += `
      <div class="cartItem">
        <span>${item.name}</span>
        <span>
          ₹${item.price}
          <button onclick="removeItem(${index})">❌</button>
        </span>
      </div>
    `;
  });

  document.getElementById("cartItems").innerHTML = items;
  document.getElementById("cartTotal").innerText = total;
}

function removeItem(index) {

  cart.splice(index,1);

  updateCart();
}

function showCart() {

  document.getElementById("cartModal").style.display = "block";

  updateCart();
}

function closeCart() {

  document.getElementById("cartModal").style.display = "none";
}

function searchProducts() {

  let search =
    document.getElementById("search").value.toLowerCase();

  let products =
    document.querySelectorAll(".product");

  products.forEach(product => {

    let name =
      product.dataset.name.toLowerCase();

    if(name.includes(search)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }

  });
}

function orderWhatsApp() {

  if(cart.length === 0) {

    alert("पहले Cart में product add करें।");
    return;
  }

  let message = "Hello Gitalk.in, मुझे ये products order करने हैं:%0A%0A";

  let total = 0;

  cart.forEach(item => {

    message +=
      item.name + " - ₹" + item.price + "%0A";

    total += item.price;
  });

  message += "%0ATotal: ₹" + total;

  // अपना WhatsApp नंबर यहाँ डालें
  let phone = "91XXXXXXXXXX";

  window.open(
    "https://wa.me/" + phone + "?text=" + message,
    "_blank"
  );
}
