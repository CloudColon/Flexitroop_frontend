'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { resourceRequestAPI, messageAPI } from '@/lib/api';
import ProfileDropdown from '@/components/ProfileDropdown';
import Loading from '@/components/Loading';
import ChatOverlay from '@/components/ChatOverlay';

export default function ResourceOwnerRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(true); // Open by default on desktop

  // Force resource owner role
  const isRequester = false;
  const isResourceOwner = true;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && params.id) {
      fetchRequest();
    }
  }, [user, params.id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await resourceRequestAPI.getById(params.id);
      console.log('🔍 [RESOURCE OWNER VIEW] Resource Request Data:', response.data);
      setRequest(response.data);
    } catch (err) {
      console.error('Failed to fetch request:', err);
      setError('Failed to load resource request');
    } finally {
      setLoading(false);
    }
  };



  const handleRespondToRequest = async (responseStatus) => {
    const action = responseStatus === 'approved' ? 'approve' : 'reject';
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;

    try {
      await resourceRequestAPI.respond(params.id, { status: responseStatus });
      alert(`Request ${responseStatus}!`);
      fetchRequest();
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      alert(err.response?.data?.error || `Failed to ${action} request`);
    }
  };

  const handleApproveNDA = async () => {
    if (!confirm('Approve the NDA and share employee details with the requester?')) return;

    try {
      await resourceRequestAPI.approveNDA(params.id);
      alert('NDA approved! Employee details are now visible to the requester.');
      fetchRequest();
    } catch (err) {
      console.error('Failed to approve NDA:', err);
      alert(err.response?.data?.error || 'Failed to approve NDA');
    }
  };

  const handleRejectNDA = async () => {
    const reason = prompt('Please provide a reason for rejecting this NDA:');
    if (!reason) return;

    try {
      await resourceRequestAPI.rejectNDA(params.id, reason);
      alert('NDA rejected');
      fetchRequest();
    } catch (err) {
      console.error('Failed to reject NDA:', err);
      alert(err.response?.data?.error || 'Failed to reject NDA');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'nda_pending':
        return 'bg-blue-100 text-blue-800';
      case 'nda_signed':
        return 'bg-purple-100 text-purple-800';
      case 'screening':
        return 'bg-indigo-100 text-indigo-800';
      case 'allocated':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Request not found'}</p>
          <Link href="/resource-tracking" className="text-primary-600 hover:underline">
            Back to Requests
          </Link>
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
                <span className="text-3xl font-bold text-blue-600">Flexitroop</span>
                <span className="text-4xl font-bold text-blue-600  py-3 rounded-lg rotate-2 -ml-2">⌝</span>
              </Link>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                🏢 RESOURCE OWNER VIEW
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                Dashboard
              </Link>
              <Link href="/resource-tracking" className="text-primary-600 font-medium">
                Requests
              </Link>
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${isChatOpen ? 'lg:mr-[400px] lg:max-w-none' : ''}`}>
        <div className="mb-6">
          <Link href="/resource-tracking" className="text-primary-600 hover:underline mb-4 inline-block">
            &larr; Back to Requests
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{request.resource_listing_title}</h1>
          <p className="text-sm text-gray-500 mt-1">Request ID: {params.id}</p>
        </div>

        {/* Role Info Banner */}
        <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-bold text-green-900">You are viewing this as: RESOURCE OWNER</h4>
              <p className="text-sm text-green-700">
                Resource Company: <strong>{request.resource_company_name}</strong> (ID: {request.resource_company})
              </p>
            </div>
          </div>
        </div>

        {/* Request Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Requesting Company:</span>
              <span className="ml-2 text-sm font-medium">{request.requesting_company_name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Total Resources:</span>
              <span className="ml-2 text-sm font-medium">{request.total_resources}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Requested:</span>
              <span className="ml-2 text-sm font-medium">{formatDate(request.requested_at)}</span>
            </div>
            {request.responded_at && (
              <div>
                <span className="text-sm text-gray-500">Responded:</span>
                <span className="ml-2 text-sm font-medium">{formatDate(request.responded_at)}</span>
              </div>
            )}
          </div>

          {request.message && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-500 mb-1">Request Message:</p>
              <p className="text-sm text-gray-900">{request.message}</p>
            </div>
          )}
        </div>

        {/* Requester Contact Information */}
        {(request.requested_by_name || request.requested_by_email) && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📞 Requester Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Company:</span>
                <span className="ml-2 text-sm font-medium">{request.requesting_company_name}</span>
              </div>
              {request.requested_by_name && (
                <div>
                  <span className="text-sm text-gray-500">Contact Person:</span>
                  <span className="ml-2 text-sm font-medium">{request.requested_by_name}</span>
                </div>
              )}
              {request.requested_by_email && (
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <a href={`mailto:${request.requested_by_email}`} className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                    {request.requested_by_email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approve/Reject Request - Show when status is 'pending' */}
        {request.status === 'pending' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✋ Approve or Reject Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              {request.requesting_company_name} has requested {request.total_resources} resources from your listing.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => handleRespondToRequest('approved')}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Approve Request
              </button>
              <button
                onClick={() => handleRespondToRequest('rejected')}
                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reject Request
              </button>
            </div>
          </div>
        )}

        {/* NDA Template - Always show if available */}
        {request.nda_template && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 NDA Template</h3>
            <p className="text-sm text-gray-600 mb-4">Your NDA template for this listing</p>
            <a
              href={request.nda_template}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Download NDA Template
            </a>
          </div>
        )}

        {/* Waiting for NDA Upload - Show when status is 'approved' */}
        {request.status === 'approved' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">⏳ Awaiting NDA Upload</h3>
            <p className="text-sm text-blue-700">
              Waiting for {request.requesting_company_name} to download, sign, and upload the NDA document.
            </p>
          </div>
        )}

        {/* NDA Review Section - Show when status is 'nda_pending' */}
        {request.status === 'nda_pending' && request.nda_document && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Review Signed NDA</h3>
            <p className="text-sm text-gray-600 mb-4">
              {request.requesting_company_name} has uploaded their signed NDA. Please review and approve or reject.
            </p>

            <div className="mb-4 p-4 bg-purple-50 rounded-md">
              <p className="text-sm font-medium mb-2">Signed NDA Document:</p>
              <a
                href={request.nda_document}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                View Signed NDA
              </a>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleApproveNDA}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Approve & Share Employee Details
              </button>
              <button
                onClick={handleRejectNDA}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reject NDA
              </button>
            </div>
          </div>
        )}

        {/* NDA Approved Message */}
        {(request.status === 'nda_signed' || request.status === 'screening' || request.status === 'allocated') && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">✅ NDA Approved</h3>
            <p className="text-sm text-green-700">
              Employee details have been shared with {request.requesting_company_name}.
            </p>
            {request.employee_details_shared_at && (
              <p className="text-xs text-green-600 mt-1">
                Shared on: {formatDate(request.employee_details_shared_at)}
              </p>
            )}
          </div>
        )}

        {/* Employee Details - Always show to resource owner */}
        {request.employee_details && request.employee_details.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Your Employees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {request.employee_details.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4">
                  <div className="font-medium text-lg">{employee.full_name}</div>
                  <div className="text-sm text-gray-600">{employee.job_title}</div>
                  <div className="text-sm text-gray-600">{employee.email}</div>
                  <div className="text-sm text-gray-600">
                    {employee.experience_years} years ({employee.experience_level})
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Status: {employee.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Allocated Resources Details */}
        {request.status === 'allocated' && request.allocated_employee_details && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Allocated Resources</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>Allocation Period:</strong> {formatDate(request.allocation_start_date)} to {formatDate(request.allocation_end_date)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Employees Allocated:</strong> {request.allocated_employee_details.length}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {request.allocated_employee_details.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="font-medium">{employee.full_name}</div>
                  <div className="text-sm text-gray-600">{employee.job_title}</div>
                </div>
              ))}
            </div>
            {request.hr_notes && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium mb-1">HR Notes:</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{request.hr_notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Chat Overlay */}
        <ChatOverlay
          resourceRequestId={params.id}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          recipientCompanyName={request.requesting_company_name}
          currentUserCompanyId={user?.managed_companies?.[0]?.id}
        />
      </main>
    </div>
  );
}
