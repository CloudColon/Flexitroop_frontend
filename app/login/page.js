'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error?.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="">
            <div className="text-center mb-8">

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  create a new account
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New to BenchList?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/register"
                  className="w-full btn btn-secondary block text-center"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to home
            </Link>
          </div>
          <div className="mt-4 text-center space-y-1">
            <p className='text-xs text-gray-500'>By using Flexitroop, you agree to our</p>
            <a href="/Term-of-service" className=" text-xs text-primary-600 hover:text-primary-700">Terms of Service</a> <span className='text-center text-xs text-gray-500'>and</span> <a href="/Private-policy" className="text-center text-xs text-primary-600 hover:text-primary-700">Privacy Policy</a>
          </div>
        </div>
      </div>


      {/* Right Side - Branding and Animated Cards */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-12 relative overflow-hidden">
        <div className="max-w-lg text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              <Link href="/" className="text-3xl font-bold text-primary-600">
                <span className="text-3xl font-bold text-blue-600">Flexitroop</span>
                <span className="text-4xl font-bold text-blue-600  py-3 rounded-lg rotate-2 -ml-2">⌝</span>
              </Link>
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              Think Smart! Think Flexitroop!
            </p>
          </div>

          {/* Animated Cards Container */}
          <div className="relative h-96 mb-12">
            {/* Card 1 - 1:many Campaigns */}
            <div className="absolute top-0 left-1/4 transform -translate-x-1/2 bg-white rounded-2xl shadow-lg p-6 w-64 animate-float">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Many resources available</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="transform -rotate-90" width="128" height="128">
                  <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                  <circle cx="64" cy="64" r="56" stroke="#ef4444" strokeWidth="12" fill="none"
                    strokeDasharray="352" strokeDashoffset="88" className="animate-pulse" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Performance</span>
                </div>
              </div>
              <div className="flex items-center justify-center text-green-600 text-sm font-semibold">
                <span className="mr-1">↑</span> 35% more reach
              </div>
            </div>

            {/* Card 2 - 1:1 Campaigns */}
            <div className="absolute top-20 right-1/4 transform translate-x-1/2 bg-white rounded-2xl shadow-xl p-6 w-72 animate-float-delayed z-10">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Many companies available</h3>
              <div className="relative w-36 h-36 mx-auto mb-4">
                <svg className="transform -rotate-90" width="144" height="144">
                  <circle cx="72" cy="72" r="64" stroke="#f3f4f6" strokeWidth="14" fill="none" />
                  <circle cx="72" cy="72" r="64" stroke="#f59e0b" strokeWidth="14" fill="none"
                    strokeDasharray="402" strokeDashoffset="100" className="animate-pulse" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">Bench</span>
                  <span className="text-xs text-gray-500">Performance</span>
                </div>
              </div>
              <div className="flex items-center justify-around text-sm font-semibold">
                <span className="flex items-center text-green-600">
                  <span className="mr-1">↑</span> 40% increase
                </span>
                <span className="flex items-center text-green-600">
                  <span className="mr-1">↑</span> 25% engagement
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Trusted by Leading Companies
            </h2>
            
            {/* Trusted by text */}
            <a className="text-gray-600 mt-2 block">
              We are here to give your <span className="font-bold text-gray-900">resources</span> a new <span className="font-bold text-gray-900">direction</span> and help you find the <span className="font-bold text-gray-900">best opportunities</span>!
            </a>

            {/* Company logos */}
            <div className="grid   max-w-md mx-auto pt-4">
              <div className="">Develop by <span className='text-blue-400 font-semibold'>CloudColon</span></div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-20px) rotate(-2deg); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(2deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 6s ease-in-out infinite;
            animation-delay: 0.5s;
          }
        `}</style>
      </div>
    </div>

  );
}
