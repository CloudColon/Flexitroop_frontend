'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import ProfileDropdown from '@/components/ProfileDropdown';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [companies, setCompanies] = useState([]);

    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user?.companies) {
            setCompanies(user.companies);
        }
    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (passwordData.new_password.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authAPI.changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password,
            });

            setSuccess('Password changed successfully!');
            setPasswordData({
                old_password: '',
                new_password: '',
                confirm_password: '',
            });
        } catch (err) {
            console.error('Password change failed:', err);
            if (err.response?.data?.old_password) {
                setError('Current password is incorrect');
            } else if (err.response?.data?.new_password) {
                setError(err.response.data.new_password[0]);
            } else {
                setError('Failed to change password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(passwordData.new_password);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-primary-600">
                                <span className="text-3xl font-bold text-blue-600">Flexitroop</span>
                <span className="text-4xl font-bold text-blue-600  py-3 rounded-lg rotate-2 -ml-2">⌝</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                                Dashboard
                            </Link>
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-800 text-sm">{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* User Information Card */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={user.first_name || ''}
                                    readOnly
                                    className="input bg-gray-50 cursor-not-allowed"
                                    title="Contact your administrator to change your name"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Contact your administrator to change
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={user.last_name || ''}
                                    readOnly
                                    className="input bg-gray-50 cursor-not-allowed"
                                    title="Contact your administrator to change your name"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Contact your administrator to change
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email || ''}
                                    readOnly
                                    className="input bg-gray-50 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Email cannot be changed
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={user.role ? user.role.replace('_', ' ').toUpperCase() : 'N/A'}
                                    readOnly
                                    className="input bg-gray-50 cursor-not-allowed capitalize"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Information Card */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization</h2>
                        {companies && companies.length > 0 ? (
                            <div className="space-y-3">
                                {companies.map((company, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-gray-50 rounded-md border border-gray-200"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{company.name}</h3>
                                                {company.email && (
                                                    <p className="text-sm text-gray-600 mt-1">{company.email}</p>
                                                )}
                                                {company.phone && (
                                                    <p className="text-sm text-gray-600">{company.phone}</p>
                                                )}
                                            </div>
                                            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                                                {user.role === 'company_user' ? 'Admin' : user.role}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No company information available</p>
                        )}
                    </div>

                    {/* Change Password Card */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password *
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.old_password}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, old_password: e.target.value })
                                    }
                                    className="input"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password *
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, new_password: e.target.value })
                                    }
                                    className="input"
                                    required
                                    minLength={8}
                                    disabled={loading}
                                />
                                {passwordData.new_password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-600">Password strength:</span>
                                            <span className={`text-xs font-medium ${passwordStrength.strength <= 2 ? 'text-red-600' :
                                                    passwordStrength.strength <= 3 ? 'text-yellow-600' :
                                                        passwordStrength.strength <= 4 ? 'text-blue-600' : 'text-green-600'
                                                }`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                                                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Must be at least 8 characters. Use a mix of letters, numbers, and symbols.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password *
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirm_password}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, confirm_password: e.target.value })
                                    }
                                    className="input"
                                    required
                                    minLength={8}
                                    disabled={loading}
                                />
                                {passwordData.confirm_password &&
                                    passwordData.new_password !== passwordData.confirm_password && (
                                        <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                                    )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        loading ||
                                        !passwordData.old_password ||
                                        !passwordData.new_password ||
                                        !passwordData.confirm_password ||
                                        passwordData.new_password !== passwordData.confirm_password
                                    }
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    {loading ? 'Changing Password...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Account Information */}
                    <div className="card bg-gray-50">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="font-medium">Account Created:</span>{' '}
                                {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                            </p>
                            <p>
                                <span className="font-medium">Last Updated:</span>{' '}
                                {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
