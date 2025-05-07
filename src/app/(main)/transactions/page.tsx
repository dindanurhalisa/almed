'use client';
import TransactionsPage from "@/components/TransactionPage";
import { Transaction } from "@/types/type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TransactionListPage = () => {
    const [transactions, setTransactions] = useState<Transaction[] | undefined>([]);

    const router = useRouter();

    const fetchTransactions = async (userId: string): Promise<Transaction[] | undefined> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}transactions?userId=${userId}`);
            const data: Transaction[] = await res.json();
            return data;
        } catch (error) {
            console.log("🚀 ~ fetchProduct ~ error:", error);
        }
    };
    useEffect(() => {
        // Get user from cookie
        const userCookie = document.cookie
            .split("; ")
            .find(row => row.startsWith("user="));

        if (!userCookie) {
            router.push('/login');
            return;
        }

        const userData = userCookie.split("=")[1];
        (async () => {
            const userObject = JSON.parse(decodeURIComponent(userData));
            const transactions = await fetchTransactions(userObject.id);
            setTransactions(transactions || []);
        })();
    }, []);
    return <TransactionsPage transactions={transactions || []} />;
};

export default TransactionListPage;
