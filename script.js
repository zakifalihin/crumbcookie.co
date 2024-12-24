let cart = [];

// Mengambil elemen hamburger dan menu navigasi
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navMenu = document.getElementById('navMenu');

// Menambahkan event listener untuk mengatur interaksi hamburger
hamburgerMenu.addEventListener('click', () => {
    // Toggle kelas 'active' pada menu navigasi
    navMenu.classList.toggle('active');
    
    // Toggle kelas 'open' pada hamburger untuk animasi
    hamburgerMenu.classList.toggle('open');
});

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

  // Perbarui total harga
  document.querySelector('.total-price').innerText = `Total: Rp ${total}`;
  document.getElementById('totalCheckoutPrice').innerText = `Total Harga: Rp ${total}`;
}

function removeItem(product) {
  cart = cart.filter(item => item.product !== product);
  updateCart();
}

// Menampilkan Form Checkout setelah klik Checkout
function showForm() {
  if (cart.length > 0) {
    // Menyembunyikan tombol checkout dan menampilkan form
    document.getElementById('checkoutBtn').style.display = 'none';
    document.getElementById('checkoutForm').style.display = 'block';
  } else {
    alert('Keranjang Anda kosong.');
  }
}

// Memperbarui Form berdasarkan opsi pengiriman
function updateFormFields() {
  const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
  const addressGroup = document.getElementById('addressGroup');
  
  // Menyembunyikan atau menampilkan kolom alamat tergantung pengiriman
  if (deliveryOption === "Ambil Langsung") {
    addressGroup.style.display = 'none';
  } else if (deliveryOption === "Jasa Kurir") {
    addressGroup.style.display = 'block';
  }
}

function validateForm() {
  const userName = document.getElementById('userName').value.trim();
  const userPhone = document.getElementById('userPhone').value.trim();
  const userAddress = document.getElementById('userAddress').value.trim();
  
  console.log(userName, userPhone, userAddress);  // Tambahkan untuk debugging

  // Cek kelengkapan form
  if (!userName || !userPhone || (document.getElementById('deliveryCourier').checked && !userAddress)) {
    alert("Harap lengkapi semua data.");
    return false;
  }

  // Validasi format nomor telepon
  const phonePattern = /^[0-9]{10,12}$/;
  if (!phonePattern.test(userPhone)) {
    alert("Nomor telepon tidak valid. Harap masukkan nomor telepon yang benar.");
    return false;
  }

  return true;
}


// Fungsi untuk mengirimkan form dan mengarahkan ke WhatsApp
function submitForm() {
  // Ambil data form
  const userName = document.getElementById('userName').value.trim();
  const userPhone = document.getElementById('userPhone').value.trim();
  const userAddress = document.getElementById('userAddress') ? document.getElementById('userAddress').value.trim() : '';
  const deliveryOption = document.querySelector('input[name="delivery"]:checked') ? document.querySelector('input[name="delivery"]:checked').value : "Ambil Langsung"; // Default Ambil Langsung

  // Validasi Form
  if (!userName || !userPhone || (deliveryOption === "Jasa Kurir" && !userAddress)) {
    alert("Harap lengkapi semua data.");
    return;
  }

  // Validasi nomor telepon
  const phonePattern = /^[0-9]{10,12}$/;
  if (!phonePattern.test(userPhone)) {
    alert("Nomor telepon tidak valid.");
    return;
  }

  let orderSummary = `Pesanan Anda di CrumbCookie:\n\n`;

// Menambahkan informasi pesanan dengan penomoran dan tanda titik (.)
cart.forEach((item, index) => {
  orderSummary += `${index + 1}. ${item.product} x${item.quantity} - Rp ${item.price * item.quantity}\n`;
});

let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
orderSummary += `\nTotal Harga: Rp ${total}\n\n`;

// Menambahkan detail pengiriman
if (deliveryOption === "Ambil Langsung") {
  orderSummary += `Opsi Pengiriman: Ambil Langsung\n`;
  orderSummary += `Alamat Toko    : https://maps.app.goo.gl/FvktZXtBDFaKo3H78\n\n`;  // Link Google Maps ke alamat toko
} else {
  orderSummary += `Opsi Pengiriman  : Jasa kurir\nAlamat Customer: ${userAddress}\n\n`;
}

// Menambahkan data pelanggan
orderSummary += `Nama    : ${userName}\n`;
orderSummary += `No Telp : ${userPhone}\n\n`;

// Penutupan pesan
orderSummary += `Terima kasih telah berbelanja di CrumbCookie. Kami akan segera mengonfirmasi dan memproses pesanan Anda !!`;

// Membuat link WhatsApp berdasarkan pilihan pengiriman
let whatsappLink = `https://wa.me/628875295115?text=${encodeURIComponent(orderSummary)}`;

// Membuka link WhatsApp
window.open(whatsappLink, '_blank');


  // Reset keranjang dan sembunyikan form
  cart = []; // Reset cart jika perlu
  document.getElementById('checkoutForm').style.display = 'none'; // Menyembunyikan form checkout
}

function cancelForm() {
  // Menyembunyikan form checkout
  document.getElementById('checkoutForm').style.display = 'none';
  
  // Menampilkan kembali tombol checkout
  document.getElementById('checkoutBtn').style.display = 'inline-block';
}
