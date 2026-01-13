'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { resourceListingAPI } from '@/lib/api';
import ProfileDropdown from '@/components/ProfileDropdown';

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user]);

  const fetchMyListings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await resourceListingAPI.getMyListings();
      setListings(response.data || []);
    } catch (err) {
      console.error('Failed to fetch my listings:', err);
      setError('Failed to load your resource listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    setDeleting(true);
    setError('');
    try {
      await resourceListingAPI.delete(listingId);
      setDeleteConfirm(null);
      // Refresh the list
      await fetchMyListings();
    } catch (err) {
      console.error('Failed to delete listing:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to delete listing';
      setError(errorMsg);
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await resourceListingAPI.updateStatus(listingId, newStatus);
      // Refresh the list
      await fetchMyListings();
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update listing status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                BenchList
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/employees" className="text-gray-700 hover:text-primary-600 font-medium">
                Employees
              </Link>
              <Link href="/employees" className="text-gray-700 hover:text-primary-600 font-medium">
                Employees
              </Link>
              <Link href="/listings" className="text-primary-600 font-medium">
                Listings
              </Link>
              <Link href="/resource-tracking" className="text-gray-700 hover:text-primary-600 font-medium">
                Resource Tracking
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                Dashboard
              </Link>
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Resource Listings</h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your posted resource listings
            </p>
          </div>
          <Link href="/post-resources" className="btn btn-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post New Listing
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading your listings...</div>
          </div>
        ) : listings.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">You haven&apos;t posted any resource listings yet.</p>
            <Link href="/post-resources" className="btn btn-primary">
              Post Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {listing.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {listing.company_name}
                    </p>
                    {listing.created_by_name && (
                      <p className="text-xs text-gray-500 mt-1">
                        Posted by: {listing.created_by_name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {/* Status dropdown */}
                    <select
                      value={listing.status}
                      onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="closed">Closed</option>
                    </select>

                    {/* View button */}
                    <button
                      onClick={() => router.push(`/listings/${listing.id}`)}
                      className="btn btn-secondary btn-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setDeleteConfirm(listing)}
                      className="btn btn-sm px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {listing.description && (
                  <p className="text-sm text-gray-700 mb-4">
                    {listing.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Resources</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {listing.total_resources} {listing.total_resources === 1 ? 'Employee' : 'Employees'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(listing.start_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Expected End</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(listing.expected_end_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Posted</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(listing.created_at)}
                    </p>
                  </div>
                </div>

                {listing.skills_summary && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Skills Available</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.skills_summary.split(',').slice(0, 8).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                      {listing.skills_summary.split(',').length > 8 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{listing.skills_summary.split(',').length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Listing</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-900">{deleteConfirm.title}</p>
              <p className="text-xs text-gray-600 mt-1">
                {deleteConfirm.total_resources} {deleteConfirm.total_resources === 1 ? 'employee' : 'employees'}
              </p>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete this resource listing? This will permanently remove it from the system.
              {deleteConfirm.status === 'active' && (
                <span className="block mt-2 text-orange-600 font-medium">
                  Warning: This listing is currently active and may have pending requests.
                </span>
              )}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="btn px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
