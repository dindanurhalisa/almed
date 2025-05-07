'use client';

import { formatToRupiah } from '@/utils/helper/formatCurrency';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BiCheck, BiPhoneIncoming } from 'react-icons/bi';

type CheckoutModalProps = {
  show: boolean;
  total: number;
};

type OrderItem = {
  productId: string;
  quantity: number;
};

const method = [
  {
    id: 1,
    name: 'Cash On Delivery',
    value: 'COD',
    description: 'Pembayaran dilakukan saat barang diterima',
  },
  {
    id: 2,
    name: 'Whatsapp',
    value: 'WHATSAPP',
    description: 'Pembayaran dilakukan melalui Whatsapp',
  },
];

const CheckoutModal = ({ show, total }: CheckoutModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    postCode: '',
    paymentProofUrl: ''
  });
  const [sendedWhatsapp, setSendedWhatsapp] = useState(false);
  const router = useRouter();

  // Get user from cookie
  const userCookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("user="));

  if (!userCookie) {
    router.push('/login');
    return;
  }

  const userObject = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));

  const close = () => {
    router.push('/cart');
    router.refresh();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedMethod) {
      toast.error('Pilih metode pembayaran terlebih dahulu');
      return;
    }

    try {
      setLoading(true);

      // Get cart items from localStorage
      const cartItems = localStorage.getItem('cart');
      if (!cartItems) {
        toast.error('Keranjang kosong');
        return;
      }

      const parsedCartItems = JSON.parse(cartItems);

      // Format order items for API
      const orderItems: OrderItem[] = parsedCartItems.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity
      }));

      // Get payment method value
      const paymentMethod = method.find(m => m.id === selectedMethod)?.value;

      // Make sure we're using the correct API URL format
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const formattedApiUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;

      const response = await fetch(`${formattedApiUrl}transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          postCode: formData.postCode,
          userId: userObject.id,
          totalPay: total,
          paymentMethod,
          paymentProofUrl: formData.paymentProofUrl,
          orderItems
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat transaksi');
      }

      const data = await response.json();

      // Clear cart after successful checkout
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));

      toast.success('Transaksi berhasil dibuat');

      // Redirect to success page or order detail
      router.push('/transactions');
      router.refresh();
    } catch (error) {
      console.error('Checkout error:', error);

      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        toast.error(`Error: ${error.message}`);
      } else if (error instanceof Response) {
        // Handle Response error
        console.error('Response status:', error.status);
        console.error('Response statusText:', error.statusText);
        toast.error(`API Error: ${error.statusText}`);
      } else {
        console.error('Unknown error type:', typeof error);
        toast.error('Terjadi kesalahan saat checkout');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-max" style={{ display: show ? '' : 'none' }}>
      <div className="pointer-events-none fixed left-0 top-0 h-screen w-screen bg-black/20"></div>
      <div
        className={`absolute left-1/2 ${selectedMethod !== null ? 'top-1/2' : 'top-64'} z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-md bg-white px-12 py-6 shadow-lg max-h-[80vh] overflow-y-auto`}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-lg font-medium">Pilih Metode Pembayaran</h1>
          <div className="flex gap-4 mb-3">
            {method.map((item, key) => (
              <div
                key={key}
                onClick={() => setSelectedMethod(item.id)}
                className={`flex h-36 w-48 cursor-pointer items-center justify-center rounded-md text-center transition-all  ${selectedMethod === item.id ? 'bg-blue-50 ring-2 ring-blue-300' : 'ring-1 ring-slate-300 hover:bg-slate-100'}`}
              >
                {item.name}
              </div>
            ))}
          </div>
          {selectedMethod && selectedMethod === 1 ? (
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">Nama Penerima</div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nama Penerima"
                className="rounded-md border border-slate-300 p-2"
                required
              />
              <div className="text-lg font-medium">No Telepon</div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nomor Telepon"
                className="rounded-md border border-slate-300 p-2"
                required
              />
              <div className="text-lg font-medium">Alamat Pengiriman</div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="h-24 w-full rounded-md border border-slate-300 p-2"
                placeholder="Alamat Pengiriman"
                required
              ></textarea>
              <div className="text-lg font-medium">Kode Pos</div>
              <input
                type="text"
                name="postCode"
                value={formData.postCode}
                onChange={handleInputChange}
                placeholder="Kode Pos"
                className="rounded-md border border-slate-300 p-2"
                required
              />
            </div>
          ) : (
            selectedMethod === 2 && (
              <div className="flex flex-col gap-2">
                <div className="text-lg font-medium">Nama Penerima</div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama Penerima"
                  className="rounded-md border border-slate-300 p-2"
                  required
                />
                <div className="text-lg font-medium">No Telepon</div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nomor Telepon"
                  className="rounded-md border border-slate-300 p-2"
                  required
                />
                <div className="text-lg font-medium">Alamat Pengiriman</div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="h-24 w-full rounded-md border border-slate-300 p-2"
                  placeholder="Alamat Pengiriman"
                  required
                ></textarea>
                <div className="text-lg font-medium">Kode Pos</div>
                <input
                  type="text"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleInputChange}
                  placeholder="Kode Pos"
                  className="rounded-md border border-slate-300 p-2"
                  required
                />
                <div className="text-lg font-medium">Total</div>
                <input
                  type="text"
                  name="totalPay"
                  value={total ? formatToRupiah(total) : ''}
                  readOnly
                  disabled
                  className="rounded-md border border-slate-300 p-2 bg-slate-100 font-bold"
                />
                {/* send payment proof to this Whatsapp, CTA to whatsapp */}
                <div className="text-lg font-medium">Bukti Pembayaran</div>
                {/* display qr code qris photo, the photo is from public folder */}
                <img src="/qris/qris.jpeg" alt="qris" className="w-72 h-72 mx-auto" />
                <p className='text-sm text-neutral-500'>Kirim bukti pembayaran ke nomor ini : +6282146510812</p>
                <button
                  type="button"
                  className="rounded-md bg-green-600 px-4 py-2 text-white flex items-center gap-2 justify-center hover:bg-green-700 transition-all"
                  onClick={() => {
                    window.open('https://wa.me/6282146510812', '_blank')
                    setSendedWhatsapp(true);
                  }}
                  disabled={loading}
                >
                  <BiPhoneIncoming className="h-5 w-5" />
                  Kirim Pesan ke Whatsapp
                  {sendedWhatsapp && <span className="ml-2 bg-white flex items-center gap-1 rounded-full px-2 py-1">
                    <BiCheck className="h-5 w-5 bg-white text-green-600 pr-1" />
                    <span className="text-green-600 text-xs">Sudah</span>
                  </span>}
                </button>
                <p className='text-sm text-neutral-500'>Setelah mengirim bukti pembayaran, tekan tombol <span className="font-bold">Checkout</span> untuk melanjutkan.</p>
              </div>
            )
          )}
          <div className="flex justify-between mt-3">
            <button
              type="button"
              className="rounded-md border border-rose-500 px-4 py-2 text-rose-500"
              onClick={close}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-md bg-slate-800 px-4 py-2 text-white disabled:bg-slate-400"
              disabled={loading || !selectedMethod || (selectedMethod === 2 && !sendedWhatsapp)}
            >
              {loading ? 'Memproses...' : 'Checkout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
