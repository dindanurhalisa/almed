"use client";

import { useState } from "react";
import { Transaction } from "@/types/type";
import {
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiImage,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiUser,
  FiX,
  FiPrinter,
} from "react-icons/fi";
import formatDate from "@/utils/helper/date";
import { formatToRupiah } from "@/utils/helper/formatCurrency";
import { AnimatePresence, motion } from "framer-motion";
import TransactionCardPrint from "./TransactionCardPrint";
import React, { useRef } from "react";

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open a new window with only the card content for printing
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;
    const printWindow = window.open("", "", "width=900,height=650");
    if (!printWindow) return;

    // Copy all <link rel="stylesheet"> and <style> from <head>
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(node => node.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <html>
        <head>
          <title>Transaction #${transaction.id.substring(0, 8)}</title>
          ${styles}
          <style>
            body { background: #fff; margin: 0; padding: 24px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };


  // Find the first product image to display in the card header
  const firstProductImage =
    transaction.orderItems &&
    transaction.orderItems.length > 0 &&
    transaction.orderItems[0].product.images &&
    transaction.orderItems[0].product.images.length > 0
      ? transaction.orderItems[0].product.images[0].url
      : null;

  // Count total items across all order items
  const totalItems = transaction.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div
      className="relative mb-4 overflow-hidden rounded-lg border border-rose-100 bg-white shadow-md transition-shadow hover:shadow-lg"
      ref={printRef}
      style={{ printColorAdjust: 'exact' }}
    >
      {/* Card UI - visible in both screen and print */}
      {/* Print Button */}
        {isExpanded && (
          <button
            className="absolute right-6 top-16 z-10 rounded-full border border-rose-100 bg-white p-2 text-rose-500 shadow transition-colors hover:bg-rose-50 hover:text-rose-700"
            title="Print this transaction"
            onClick={handlePrint}
            style={{ boxShadow: "0 2px 8px rgba(237, 66, 100, 0.07)" }}
          >
            <FiPrinter size={18} />
          </button>
        )}
        {/* Card Header */}
      <div
        className={`flex cursor-pointer items-center justify-between p-4 ${isExpanded ? "bg-gradient-to-r from-rose-50 to-rose-100" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {firstProductImage ? (
            <div className="h-12 w-12 overflow-hidden rounded-md border border-rose-100 bg-white">
              <img
                src={firstProductImage}
                alt="Product"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-full bg-rose-600 p-3 text-white">
              <FiPackage size={18} />
            </div>
          )}
          <div>
            <h3 className="font-medium text-neutral-800">
              Order #{transaction.id.substring(0, 8)}
            </h3>
            <div className="flex items-center text-sm text-neutral-500">
              <FiCalendar size={12} className="mr-1" />
              {formatDate(transaction.createdAt)}
              <span className="mx-2">•</span>
              <span>
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              transaction.isPaid
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {transaction.isPaid ? "Paid" : "Unpaid"}
          </span>
          <span className="font-semibold text-neutral-800">
            {formatToRupiah(transaction.totalAmount)}
          </span>
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
            <div className="bg-neutral-50 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-medium text-neutral-700">
                    Customer Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-neutral-600">
                      <FiUser className="mr-2 text-rose-500" />{" "}
                      {transaction.name}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <FiPhone className="mr-2 text-rose-500" />{" "}
                      {transaction.phone}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <FiMapPin className="mr-2 text-rose-500" />{" "}
                      {transaction.address}, {transaction.postCode}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-medium text-neutral-700">
                    Payment Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-neutral-600">
                      <FiCreditCard className="mr-2 text-rose-500" /> Method:{" "}
                      {transaction.paymentMethod}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <FiDollarSign className="mr-2 text-rose-500" /> Amount:{" "}
                      {formatToRupiah(transaction.totalAmount)}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <FiClock className="mr-2 text-rose-500" /> Updated:{" "}
                      {formatDate(transaction.updatedAt)}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      {transaction.isPaid ? (
                        <FiCheck className="mr-2 text-green-500" />
                      ) : (
                        <FiX className="text-red-500 mr-2" />
                      )}
                      Status: {transaction.isPaid ? "Paid" : "Unpaid"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Section */}
              {transaction.orderItems && transaction.orderItems.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3 font-medium text-neutral-700">
                    Order Items
                  </h4>
                  <div className="rounded border border-rose-100 bg-white">
                    <table className="min-w-full divide-y divide-rose-100">
                      <thead className="bg-rose-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-700">
                            Product
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-700">
                            Quantity
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-700">
                            Price
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-700">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-100">
                        {transaction.orderItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2 text-sm">
                              <div className="flex items-center space-x-3">
                                {item.product.images &&
                                item.product.images.length > 0 ? (
                                  <img
                                    src={item.product.images[0].url}
                                    alt={item.product.name}
                                    className="h-12 w-12 rounded object-cover"
                                  />
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded bg-neutral-100 text-neutral-400">
                                    <FiImage size={16} />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-neutral-800">
                                    {item.product.name}
                                  </div>
                                  <div className="max-w-xs truncate text-xs text-neutral-500">
                                    {item.product.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-sm text-neutral-600">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 text-sm text-neutral-600">
                              {formatToRupiah(item.price)}
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-neutral-800">
                              {formatToRupiah(item.price * item.quantity)}
                            </td>
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
                  <h4 className="mb-2 font-medium text-neutral-700">
                    Payment Proof
                  </h4>
                  <a
                    href={transaction.paymentProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-rose-600 transition-colors hover:text-rose-700"
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
