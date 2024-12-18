let cart = [];

function getProductImage(productName) {
  const productImages = {
    'Choco Crunchy Cookies': 'images/chococrunchy.png',
    'Red Velvet Cookies': 'images/redvelvet.png',
    'Original Cookies': 'images/original.png',
    'Matcha Cookies': 'images/matchacookie.png',
    'Lotus Biscoff Cookies': 'images/lotusbiscoff.png'
  };
  return productImages[productName] || '';
}

document.querySelectorAll('.plus').forEach(button => {
  button.addEventListener('click', () => {
    let product = button.getAttribute('data-product');
    let price = parseInt(button.getAttribute('data-price'));
    let quantityElement = document.querySelector(`.quantity[data-product="${product}"]`);
    let quantity = parseInt(quantityElement.innerText);
    quantityElement.innerText = quantity + 1;

    let cartItem = cart.find(item => item.product === product);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cart.push({ product, price, quantity: 1 });
    }
    updateCart();
  });
});

document.querySelectorAll('.minus').forEach(button => {
  button.addEventListener('click', () => {
    let product = button.getAttribute('data-product');
    let quantityElement = document.querySelector(`.quantity[data-product="${product}"]`);
    let quantity = parseInt(quantityElement.innerText);
    if (quantity > 0) {
      quantityElement.innerText = quantity - 1;

      let cartItem = cart.find(item => item.product === product);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        cart = cart.filter(item => item.product !== product);
      }
      updateCart();
    }
  });
});

function updateCart() {
  let cartItemsContainer = document.querySelector('.cart-items');
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    let cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div class="cart-item-content">
        <img src="${getProductImage(item.product)}" alt="${item.product}" class="cart-item-image">
        <div class="cart-item-details">
          <span>${item.product} x${item.quantity}</span>
          <span>Rp ${item.price * item.quantity}</span>
        </div>
      </div>
      <button class="hapus" onclick="removeItem('${item.product}')">hapus</button>
    `;
    cartItemsContainer.appendChild(cartItem);
    total += item.price * item.quantity;
  });

  document.querySelector('.total-price').innerText = `Total: Rp ${total}`;
}

function removeItem(product) {
  cart = cart.filter(item => item.product !== product);
  updateCart();
}

function checkout() {
  if (cart.length > 0) {
    let orderSummary = `Pesanan Anda:\n`;
    cart.forEach(item => {
      orderSummary += `${item.product} x${item.quantity} - Rp ${item.price * item.quantity}\n`;
    });
    let totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    orderSummary += `Total: Rp ${totalAmount}\n\nSilakan lanjutkan pembayaran melalui WhatsApp.`;

    let whatsappLink = `https://wa.me/628875295115?text=${encodeURIComponent(orderSummary)}`;
    window.open(whatsappLink, '_blank');

    cart = [];
    document.querySelectorAll('.quantity').forEach(el => el.innerText = '0');
    updateCart();
  } else {
    alert('Keranjang Anda kosong.');
  }
}
