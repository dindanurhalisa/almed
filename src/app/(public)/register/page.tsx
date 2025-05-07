'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });
            if (!response.ok) {
                const errorObject = await response.json();
                throw new Error(errorObject.message);
            }
            const data = await response.json();
            console.log(data);
            router.push('/login');
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Register</h1>
          </div>
          
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                className="w-full px-3 py-2 rounded-md outline-none ring-2 ring-slate-200 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3 py-2 rounded-md outline-none ring-2 ring-slate-200 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-2 rounded-md outline-none ring-2 ring-slate-200 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
      
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-4 py-2 text-white bg-rose-500 rounded-md hover:bg-rose-600 outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>
          
          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="font-medium text-rose-600 hover:text-rose-500">
              Sign in
            </Link>
          </div>
        </div>
      );
};

export default RegisterPage;
