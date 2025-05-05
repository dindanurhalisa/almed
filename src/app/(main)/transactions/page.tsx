import TransactionsPage from "@/components/TransactionPage";
import { Transaction } from "@/types/type";
import { auth } from '@clerk/nextjs/server'
const fetchTransactions = async (userId: string): Promise<Transaction[] | undefined> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}transactions?userId=${userId}`, {
            next: {
                revalidate: 60,
            },
        });
        const data: Transaction[] = await res.json();
        return data;
    } catch (error) {
        console.log("🚀 ~ fetchProduct ~ error:", error);
    }
};

const TransactionListPage = async () => {
    const { userId } = await auth();
    if (!userId) {
        return <TransactionsPage transactions={[]} />;
    }
    const transactions = await fetchTransactions(userId);
    return <TransactionsPage transactions={transactions || []} />;
};

export default TransactionListPage;