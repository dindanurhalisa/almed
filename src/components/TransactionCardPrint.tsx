"use client";

import { Transaction } from "@/types/type";
import formatDate from "@/utils/helper/date";
import { formatToRupiah } from "@/utils/helper/formatCurrency";
import { FiUser, FiPhone, FiMapPin, FiCreditCard, FiDollarSign, FiClock, FiCheck, FiX, FiImage } from "react-icons/fi";

// This component is for printing only, no interactivity
const TransactionCardPrint = ({ transaction }: { transaction: Transaction }) => {
  const totalItems = transaction.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-rose-100 p-4 print:p-0">
      <div className="flex items-center mb-4">
        <h2 className="font-bold text-xl mr-4">YAHAHHAHAHAHAHA Order #{transaction.id.substring(0, 8)}</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ml-auto ${transaction.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{transaction.isPaid ? "Paid" : "Unpaid"}</span>
      </div>
      <div className="text-sm text-neutral-500 mb-2">{formatDate(transaction.createdAt)} • {totalItems} {totalItems === 1 ? 'item' : 'items'}</div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-neutral-700 mb-2">Customer Details</h4>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-neutral-600"><FiUser className="mr-2 text-rose-500" /> {transaction.name}</div>
            <div className="flex items-center text-sm text-neutral-600"><FiPhone className="mr-2 text-rose-500" /> {transaction.phone}</div>
            <div className="flex items-center text-sm text-neutral-600"><FiMapPin className="mr-2 text-rose-500" /> {transaction.address}, {transaction.postCode}</div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-neutral-700 mb-2">Payment Details</h4>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-neutral-600"><FiCreditCard className="mr-2 text-rose-500" /> Method: {transaction.paymentMethod}</div>
            <div className="flex items-center text-sm text-neutral-600"><FiDollarSign className="mr-2 text-rose-500" /> Amount: {formatToRupiah(transaction.totalAmount)}</div>
            <div className="flex items-center text-sm text-neutral-600"><FiClock className="mr-2 text-rose-500" /> Updated: {formatDate(transaction.updatedAt)}</div>
            <div className="flex items-center text-sm text-neutral-600">{transaction.isPaid ? (<FiCheck className="mr-2 text-green-500" />) : (<FiX className="mr-2 text-red-500" />)} Status: {transaction.isPaid ? "Paid" : "Unpaid"}</div>
          </div>
        </div>
      </div>
      {transaction.orderItems && transaction.orderItems.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-neutral-700 mb-2">Order Items</h4>
          <table className="min-w-full divide-y divide-rose-100">
            <thead className="bg-rose-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Product</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100">
              {transaction.orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center space-x-3">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center text-neutral-400"><FiImage size={16} /></div>
                      )}
                      <div>
                        <div className="font-medium text-neutral-800">{item.product.name}</div>
                        <div className="text-xs text-neutral-500 truncate max-w-xs">{item.product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-neutral-600">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-neutral-600">{formatToRupiah(item.price)}</td>
                  <td className="px-4 py-2 text-sm font-medium text-neutral-800">{formatToRupiah(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {transaction.paymentProofUrl && (
        <div className="mb-2">
          <h4 className="font-medium text-neutral-700 mb-1">Payment Proof</h4>
          <a href={transaction.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-rose-600 hover:text-rose-700 transition-colors"><span>View Payment Proof</span></a>
        </div>
      )}
    </div>
  );
};

export default TransactionCardPrint;
