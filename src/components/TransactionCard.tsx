"use client";

import { useState } from "react";
import { Transaction } from "@/types/type";
import { FiCalendar, FiCheck, FiChevronDown, FiClock, FiCreditCard, FiDollarSign, FiImage, FiMail, FiMapPin, FiPackage, FiPhone, FiUser, FiX } from "react-icons/fi";
import formatDate from "@/utils/helper/date";
import { formatToRupiah } from "@/utils/helper/formatCurrency";
import { AnimatePresence, motion } from "framer-motion";

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    // Find the first product image to display in the card header
    const firstProductImage = transaction.orderItems && 
      transaction.orderItems.length > 0 && 
      transaction.orderItems[0].product.images && 
      transaction.orderItems[0].product.images.length > 0 
        ? transaction.orderItems[0].product.images[0].url 
        : null;
  
    // Count total items across all order items
    const totalItems = transaction.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 border border-rose-100 hover:shadow-lg transition-shadow">
        {/* Card Header */}
        <div 
          className={`flex justify-between items-center p-4 cursor-pointer ${isExpanded ? "bg-gradient-to-r from-rose-50 to-rose-100" : ""}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-3">
            {firstProductImage ? (
              <div className="w-12 h-12 rounded-md overflow-hidden bg-white border border-rose-100">
                <img 
                  src={firstProductImage} 
                  alt="Product" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="p-3 bg-rose-600 text-white rounded-full">
                <FiPackage size={18} />
              </div>
            )}
            <div>
              <h3 className="font-medium text-neutral-800">Order #{transaction.id.substring(0, 8)}</h3>
              <div className="flex items-center text-sm text-neutral-500">
                <FiCalendar size={12} className="mr-1" />
                {formatDate(transaction.createdAt)}
                <span className="mx-2">•</span>
                <span>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              transaction.isPaid 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {transaction.isPaid ? "Paid" : "Unpaid"}
            </span>
            <span className="font-semibold text-neutral-800">{formatToRupiah(transaction.totalAmount)}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiChevronDown className="text-neutral-500" />
            </motion.div>
          </div>
        </div>
  
        {/* Card Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-rose-100"
            >
              <div className="p-4 bg-neutral-50">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-neutral-700 mb-3">Customer Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-neutral-600">
                        <FiUser className="mr-2 text-rose-500" /> {transaction.name}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <FiPhone className="mr-2 text-rose-500" /> {transaction.phone}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <FiMapPin className="mr-2 text-rose-500" /> {transaction.address}, {transaction.postCode}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-neutral-700 mb-3">Payment Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-neutral-600">
                        <FiCreditCard className="mr-2 text-rose-500" /> Method: {transaction.paymentMethod}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <FiDollarSign className="mr-2 text-rose-500" /> Amount: {formatToRupiah(transaction.totalAmount)}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <FiClock className="mr-2 text-rose-500" /> Updated: {formatDate(transaction.updatedAt)}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        {transaction.isPaid ? (
                          <FiCheck className="mr-2 text-green-500" />
                        ) : (
                          <FiX className="mr-2 text-red-500" />
                        )}
                        Status: {transaction.isPaid ? "Paid" : "Unpaid"}
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Order Items Section */}
                {transaction.orderItems && transaction.orderItems.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-neutral-700 mb-3">Order Items</h4>
                    <div className="bg-white rounded border border-rose-100">
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
                                    <img 
                                      src={item.product.images[0].url} 
                                      alt={item.product.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center text-neutral-400">
                                      <FiImage size={16} />
                                    </div>
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
                  </div>
                )}
                
                {/* Payment Proof Section */}
                {transaction.paymentProofUrl && (
                  <div className="mt-4">
                    <h4 className="font-medium text-neutral-700 mb-2">Payment Proof</h4>
                    <a 
                      href={transaction.paymentProofUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      <FiMail />
                      <span>View Payment Proof</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  export default TransactionCard;