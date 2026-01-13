'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { teamMemberAPI } from '@/lib/api';
import ProfileDropdown from '@/components/ProfileDropdown';
import AuthDiagnostic from '@/components/AuthDiagnostic';

export default function TeamPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: 'hr'
    });
    const [submitting, setSubmitting] = useState(false);
    const [tempPassword, setTempPassword] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchTeamMembers();
        }
    }, [user]);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const response = await teamMemberAPI.getAll();
            console.log('Team members response:', response.data);
            // Ensure we always have an array
            const data = response.data;
            if (Array.isArray(data)) {
                setTeamMembers(data);
                console.log(`✅ Loaded ${data.length} team member(s)`);
            } else if (data && Array.isArray(data.results)) {
                // Handle paginated response
                setTeamMembers(data.results);
                console.log(`✅ Loaded ${data.results.length} team member(s)`);
            } else {
                setTeamMembers([]);
                console.warn('⚠️ No team members data received');
            }
        } catch (err) {
            console.error('Failed to fetch team members:', err);
            setError('Failed to load team members');
            setTeamMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await teamMemberAPI.create(formData);
            console.log('✅ Team member created:', response.data);

            // Set success message
            setSuccessMessage(`Team member ${formData.first_name} ${formData.last_name} added successfully!`);

            // Auto-dismiss success message after 5 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);


            setTempPassword(response.data.temporary_password);
            setShowPasswordModal(true);
            setShowAddModal(false);
            setFormData({ first_name: '', last_name: '', email: '', role: 'hr' });

            // Refresh team members list immediately
            await fetchTeamMembers();
        } catch (err) {
            console.error('Failed to create team member:', err);

            // Check for authentication errors
            if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else if (err.response?.status === 400) {
                // Handle specific error messages
                const errorData = err.response?.data;
                if (Array.isArray(errorData)) {
                    setError(errorData[0] || 'Failed to create team member');
                } else if (typeof errorData === 'object') {
                    setError(errorData.email?.[0] || errorData.detail || 'Failed to create team member');
                } else {
                    setError('Failed to create team member. Please ensure you are associated with a company.');
                }
            } else {
                setError('Failed to create team member. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this team member?')) return;

        try {
            await teamMemberAPI.delete(id);
            fetchTeamMembers();
        } catch (err) {
            console.error('Failed to delete team member:', err);
            alert('Failed to remove team member');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Password copied to clipboard!');
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-primary-600">BenchList</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">Dashboard</Link>
                            <Link href="/employees" className="text-gray-700 hover:text-primary-600 font-medium">Employees</Link>
                            <Link href="/listings" className="text-gray-700 hover:text-primary-600 font-medium">Listings</Link>
                            <Link href="/resource-tracking" className="text-gray-700 hover:text-primary-600 font-medium">Resource Tracking</Link>
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                        <p className="mt-2 text-gray-600">Manage your company team members (HR and Admins)</p>
                    </div>
                    <button
                        onClick={() => {
                            // Basic check - backend will validate company association
                            if (!user) {
                                setError('Please log in to add team members.');
                                return;
                            }
                            setShowAddModal(true);
                        }}
                        className="btn btn-primary"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Team Member
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-green-800 text-sm">{successMessage}</p>
                        </div>
                    </div>
                )}

                {/* Team Members List */}
                <div className="card">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading team members...</p>
                        </div>
                    ) : teamMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding your first team member.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="px-6 py-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Total team members: <span className="font-semibold text-gray-900">{teamMembers.length}</span>
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Companies</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {teamMembers.map((member) => (
                                            <tr key={member.id}>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{member.first_name} {member.last_name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{member.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{member.company_names?.join(', ') || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {member.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button
                                                        onClick={() => handleDelete(member.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Team Member Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full">
                            <div className="border-b px-6 py-4 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="input w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                    <input
                                        type="text"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="input w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="input w-full"
                                        required
                                    >
                                        <option value="hr">HR</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" disabled={submitting} className="btn btn-primary">
                                        {submitting ? 'Creating...' : 'Create Team Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Password Display Modal */}
                {showPasswordModal && tempPassword && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full">
                            <div className="border-b px-6 py-4">
                                <h3 className="text-xl font-bold text-gray-900">Team Member Created Successfully</h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <p className="text-sm text-yellow-800 font-medium mb-2">⚠️ Important: Save this password!</p>
                                    <p className="text-sm text-yellow-700">This temporary password will only be shown once. Please copy and share it securely with the team member.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tempPassword}
                                            readOnly
                                            className="input flex-1 font-mono bg-gray-50"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(tempPassword)}
                                            className="btn btn-secondary"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t px-6 py-4">
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setTempPassword('');
                                    }}
                                    className="btn btn-primary w-full"
                                >
                                    I&apos;ve Saved the Password
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Development-only diagnostic tool */}
            <AuthDiagnostic />
        </div>
    );
}
