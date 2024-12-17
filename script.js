// Checkout function
function checkout() {
  // Membuat pesan otomatis yang berisi rincian produk yang dibeli
  let message = 'Halo! Saya ingin membeli produk di CrumbCookie.co.\n\n';
  
  // Loop untuk menambahkan produk ke dalam pesan
  cart.forEach(item => {
    message += `${item.product} - Jumlah: ${item.quantity} - Harga: Rp ${item.price * item.quantity}\n`;
  });

  // Tambahkan total harga di akhir pesan
  message += `\nTotal belanja saya adalah Rp ${totalPrice}.`;

  // Encode pesan agar aman digunakan dalam URL
  const encodedMessage = encodeURIComponent(message);
  
  // Nomor WhatsApp Anda
  const whatsappUrl = `https://wa.me/08875295115?text=${encodedMessage}`;
  
  // Mengarahkan ke WhatsApp dengan pesan yang telah disiapkan
  window.location.href = whatsappUrl;
}

