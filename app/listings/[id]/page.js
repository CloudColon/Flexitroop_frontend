'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { resourceListingAPI, resourceRequestAPI, companyAPI, messageAPI } from '@/lib/api';
import ProfileDropdown from '@/components/ProfileDropdown';
import ConfirmModal from '@/components/ConfirmModal';

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [listing, setListing] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    requesting_company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && params.id) {
      fetchListing();
      fetchCompanies();
      checkExistingRequest();
    }
  }, [user, params.id]);

  const fetchListing = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await resourceListingAPI.getById(params.id);
      setListing(response.data);
    } catch (err) {
      console.error('Failed to fetch listing:', err);
      setError('Failed to load resource listing');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAll();
      setCompanies(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  const checkExistingRequest = async () => {
    try {
      const response = await resourceRequestAPI.getSent();
      const requests = response.data.results || response.data;
      // Check if there's a pending request for this listing
      const pendingRequest = requests.find(
        req => req.resource_listing === parseInt(params.id) && req.status === 'pending'
      );
      if (pendingRequest) {
        setExistingRequest(pendingRequest);
        setHasPendingRequest(true);
        // Fetch messages for this request
        fetchMessages(pendingRequest.id);
      }
    } catch (err) {
      console.error('Failed to check existing requests:', err);
    }
  };

  const fetchMessages = async (requestId) => {
    try {
      const response = await messageAPI.getByRequest(requestId);
      setMessages(response.data || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !existingRequest) return;

    setSendingMessage(true);
    try {
      await messageAPI.create({
        resource_request: existingRequest.id,
        message: newMessage.trim(),
      });
      setNewMessage('');
      // Refresh messages
      await fetchMessages(existingRequest.id);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Create the resource request
      const requestResponse = await resourceRequestAPI.create({
        resource_listing: parseInt(params.id),
        requesting_company: parseInt(requestData.requesting_company),
        message: requestData.message,
      });

      setSuccess(true);
      setShowRequestModal(false);
      setHasPendingRequest(true);
      setExistingRequest(requestResponse.data);
      setTimeout(() => {
        router.push('/resource-tracking');
      }, 2000);
    } catch (err) {
      console.error('Failed to create request:', err);
      setError(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await resourceListingAPI.delete(params.id);
      setSuccess(true); // Reuse success state or add new one
      setDeleteModal(false);
      // Redirect after short delay
      setTimeout(() => {
        router.push('/listings');
      }, 1500);
    } catch (err) {
      console.error('Failed to delete listing:', err);
      const errorData = err.response?.data;
      if (errorData?.active_requests_count) {
        setError(`Cannot delete listing. There are ${errorData.active_requests_count} active requests.`);
      } else {
        setError('Failed to delete listing. Please try again.');
      }
      setDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => router.push('/listings')} className="btn btn-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="#" className="text-2xl font-bold text-primary-600">
                BenchList
              </Link>
            </div>
            <div className="flex items-center gap-4">
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/listings')}
          className="mb-4 text-blue-600 hover:text-blue-700 flex items-center text-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Listings
        </button>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">Operation successful! Redirecting...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {listing && (
          <>
            {/* Header Card */}
            <div className="card mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                    <span className={`badge-${listing.status}`}>{listing.status}</span>
                  </div>
                  <p className="text-lg text-gray-700 font-medium">{listing.company_name}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {/* Show Request button if NOT owner */}
                  {user.companies?.some(c => c.id === listing.company) ? (
                    <button
                      onClick={() => setDeleteModal(true)}
                      className="btn btn-danger"
                      disabled={deleting}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Listing
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="btn btn-primary btn-lg"
                      disabled={listing.status !== 'active' || hasPendingRequest}
                      title={hasPendingRequest ? 'You already have a pending request for this listing' : ''}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Request Resources
                    </button>
                  )}

                  {hasPendingRequest && (
                    <p className="text-sm text-orange-600 mt-2">
                      You already have a pending request for this listing
                    </p>
                  )}
                </div>
              </div>

              {listing.description && (
                <p className="text-gray-700 mt-4">{listing.description}</p>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Resource Information */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Available Resources</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {listing.total_resources} {listing.total_resources === 1 ? 'Employee' : 'Employees'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(listing.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expected End Date</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(listing.expected_end_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-lg font-semibold text-gray-900">{listing.locations || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Company Contact */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Contact</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="text-lg font-semibold text-gray-900">{listing.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg text-blue-600">{listing.company_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-lg font-semibold text-gray-900">{listing.company_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-lg font-semibold text-gray-900">{listing.company_address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Available */}
            {listing.skills_summary && (
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills Available</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.skills_summary.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-md"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Notice - Employee Details Hidden */}
            <div className="card bg-gray-50 mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Employee Details Protected</h2>
                  <p className="text-sm text-gray-600">
                    Detailed employee information is protected and will be visible only after you submit a request,
                    sign the NDA, and receive approval from the resource owner. This ensures privacy and confidentiality
                    for all parties involved.
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Section - Only show if there's an existing request */}
            {existingRequest && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Messages
                  </h2>
                  <span className="text-sm text-gray-500">
                    Request ID: #{existingRequest.id}
                  </span>
                </div>

                {/* Messages List */}
                <div className="mb-4 max-h-96 overflow-y-auto space-y-3 bg-gray-50 rounded-md p-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-4">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-md ${msg.sender === user?.id
                          ? 'bg-blue-100 ml-8'
                          : 'bg-white mr-8 border border-gray-200'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm text-gray-900">
                            {msg.sender_company_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 input resize-none"
                    rows="3"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary self-end"
                    disabled={sendingMessage || !newMessage.trim()}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Request Resources</h3>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              {/* NDA Information Section */}
              {listing.nda_template && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Non-Disclosure Agreement Required</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        This resource listing requires a signed NDA. Please download, review, sign, and upload the NDA document.
                      </p>
                      <a
                        href={listing.nda_template}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download NDA Template
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="requesting_company" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Company *
                </label>
                <select
                  id="requesting_company"
                  required
                  value={requestData.requesting_company}
                  onChange={(e) => setRequestData(prev => ({ ...prev, requesting_company: e.target.value }))}
                  className="input w-full"
                >
                  <option value="">Select your company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={requestData.message}
                  onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe your requirements and why you're interested in these resources..."
                  className="input w-full"
                />
              </div>

              {/* NDA Information Notice */}
              {listing.nda_template && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">NDA Required</p>
                      <p className="text-xs text-blue-700">
                        This listing requires an NDA. After your request is approved, you&apos;ll be able to download the NDA template, sign it, and upload it from the Resource Requests page.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false);
                  }}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmText="Delete Listing"
        isLoading={deleting}
      />
    </div>
  );
}
