"use client";

import { Transaction } from "@/types/type";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
    FiSearch,
    FiShoppingBag
} from "react-icons/fi";
import TransactionCard from "./TransactionCard";

const TransactionsPage = ({ transactions }: { transactions: Transaction[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPaid, setFilterPaid] = useState<boolean | null>(null);
  
  const filteredTransactions = transactions?.filter((transaction) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.orderItems.some(item => 
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Filter by payment status
    const matchesPaymentStatus = 
      filterPaid === null || transaction.isPaid === filterPaid;
    
    return matchesSearch && matchesPaymentStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">My Transactions</h1>
        <p className="text-neutral-500">View and manage all your purchase history</p>
      </motion.div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-rose-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search by product name, payment method or ID..."
              className="pl-10 pr-4 py-2 border border-neutral-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-600">Status:</span>
            <button
              onClick={() => setFilterPaid(null)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filterPaid === null
                  ? "bg-rose-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterPaid(true)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filterPaid === true
                  ? "bg-rose-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setFilterPaid(false)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filterPaid === false
                  ? "bg-rose-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Unpaid
            </button>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="mb-4 text-sm text-neutral-500">
        Showing {filteredTransactions?.length || 0} of {transactions?.length || 0} transactions
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTransactions?.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <TransactionCard transaction={transaction} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredTransactions?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-neutral-50 p-8 rounded-lg border border-neutral-200 text-center"
          >
            <FiShoppingBag className="mx-auto text-rose-400 mb-2" size={32} />
            <h3 className="text-lg font-medium text-neutral-700 mb-1">No transactions found</h3>
            <p className="text-neutral-500">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;