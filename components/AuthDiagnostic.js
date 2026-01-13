'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAccessToken, getRefreshToken } from '@/lib/api';

/**
 * Authentication Diagnostic Component
 * 
 * Place this component on any page to diagnose authentication issues.
 * Only shows in development mode.
 */
export default function AuthDiagnostic() {
    const { user, isAuthenticated, loading } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    const diagnostics = {
        'Authentication State': isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated',
        'Loading State': loading ? '⏳ Loading...' : '✅ Loaded',
        'User Object': user ? '✅ Present' : '❌ Missing',
        'User Email': user?.email || '❌ N/A',
        'User Role': user?.role || '❌ N/A',
        'Access Token': accessToken ? `✅ Present (${accessToken.substring(0, 20)}...)` : '❌ Missing',
        'Refresh Token': refreshToken ? `✅ Present (${refreshToken.substring(0, 20)}...)` : '❌ Missing',
        'Companies': user?.accessible_companies?.length || 0,
        'Company Names': user?.accessible_companies?.map(c => c.name).join(', ') || '❌ None'
    };

    const getStatusColor = () => {
        if (!isAuthenticated || !accessToken) return 'bg-red-500';
        if (!user?.accessible_companies?.length) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const clearAuth = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.reload();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Floating Button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className={`${getStatusColor()} text-white p-3 rounded-full shadow-lg hover:opacity-80 transition-opacity`}
                title="Authentication Diagnostic"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Diagnostic Panel */}
            {isVisible && (
                <div className="absolute bottom-16 right-0 w-96 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b">
                        <h3 className="font-bold text-gray-900">🔍 Auth Diagnostic</h3>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-2 text-sm">
                        {Object.entries(diagnostics).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <span className="font-medium text-gray-700">{key}:</span>
                                <span className="text-gray-900 font-mono text-xs">{value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t space-y-2">
                        <button
                            onClick={clearAuth}
                            className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-medium"
                        >
                            Clear Auth & Reload
                        </button>

                        <button
                            onClick={() => {
                                console.log('=== AUTH DIAGNOSTIC ===');
                                console.log('User:', user);
                                console.log('Access Token:', accessToken);
                                console.log('Refresh Token:', refreshToken);
                                console.log('Is Authenticated:', isAuthenticated);
                                console.log('======================');
                            }}
                            className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm font-medium"
                        >
                            Log to Console
                        </button>
                    </div>

                    <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                        <p className="font-medium mb-1">Common Issues:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>❌ Not Authenticated → Log in</li>
                            <li>❌ Missing Token → Clear auth & log in</li>
                            <li>❌ No Companies → Contact admin</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
