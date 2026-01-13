'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { resourceRequestAPI, messageAPI } from '@/lib/api';
import ProfileDropdown from '@/components/ProfileDropdown';
import Loading from '@/components/Loading';
import ChatOverlay from '@/components/ChatOverlay';

export default function RequesterResourceRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Employee modal state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // NDA state
  const [ndaFile, setNdaFile] = useState(null);
  const [uploadingNDA, setUploadingNDA] = useState(false);

  // Screening state
  const [screeningData, setScreeningData] = useState({
    allocated_employees: [],
    allocation_start_date: '',
    allocation_end_date: '',
    hr_notes: ''
  });

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(true); // Open by default on desktop

  // Force requester role
  const isRequester = true;
  const isResourceOwner = false;

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

  // Auto-select all employees when they become available (after NDA signed)
  useEffect(() => {
    if (request?.employee_details && request.employee_details.length > 0) {
      // Auto-select all employees for screening
      const employeeIds = request.employee_details.map(emp => emp.id);
      setScreeningData(prev => ({
        ...prev,
        allocated_employees: employeeIds
      }));
    }
  }, [request?.employee_details]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await resourceRequestAPI.getById(params.id);
      console.log('🔍 [REQUESTER VIEW] Resource Request Data:', response.data);
      setRequest(response.data);
    } catch (err) {
      console.error('Failed to fetch request:', err);
      setError('Failed to load resource request');
    } finally {
      setLoading(false);
    }
  };



  const handleUploadNDA = async () => {
    if (!ndaFile) {
      alert('Please select an NDA file to upload');
      return;
    }

    try {
      setUploadingNDA(true);
      await resourceRequestAPI.uploadNDA(params.id, ndaFile);
      alert('NDA uploaded successfully');
      setNdaFile(null);
      fetchRequest();
    } catch (err) {
      console.error('Failed to upload NDA:', err);
      alert(err.response?.data?.error || 'Failed to upload NDA');
    } finally {
      setUploadingNDA(false);
    }
  };

  const handleCompleteScreening = async () => {
    if (screeningData.allocated_employees.length === 0) {
      alert('Please select at least one employee');
      return;
    }

    if (!screeningData.allocation_start_date || !screeningData.allocation_end_date) {
      alert('Please set allocation start and end dates');
      return;
    }

    try {
      await resourceRequestAPI.completeScreening(params.id, screeningData);
      alert('Screening completed and employees allocated');
      fetchRequest();
    } catch (err) {
      console.error('Failed to complete screening:', err);
      alert(err.response?.data?.error || 'Failed to complete screening');
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
                BenchList
              </Link>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                📝 REQUESTER VIEW
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
        <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-bold text-blue-900">You are viewing this as: REQUESTER</h4>
              <p className="text-sm text-blue-700">
                Requesting Company: <strong>{request.requesting_company_name}</strong> (ID: {request.requesting_company})
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
              <span className="text-sm text-gray-500">Resource Provider:</span>
              <span className="ml-2 text-sm font-medium">{request.resource_company_name}</span>
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
        </div>

        {/* Resource Owner Contact Information */}
        {(request.resource_owner_name || request.resource_owner_email) && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📞 Resource Owner Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Company:</span>
                <span className="ml-2 text-sm font-medium">{request.resource_company_name}</span>
              </div>
              {request.resource_owner_name && (
                <div>
                  <span className="text-sm text-gray-500">Contact Person:</span>
                  <span className="ml-2 text-sm font-medium">{request.resource_owner_name}</span>
                </div>
              )}
              {request.resource_owner_email && (
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <a href={`mailto:${request.resource_owner_email}`} className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                    {request.resource_owner_email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Waiting for Approval - Show when status is 'pending' */}
        {request.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">⏳ Awaiting Approval</h3>
            <p className="text-sm text-yellow-700">
              Your request has been sent to {request.resource_company_name}. Waiting for them to approve.
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Once approved, you&apos;ll be able to download and upload the NDA document.
            </p>
          </div>
        )}

        {/* NDA Upload Section - Show when status is 'approved' */}
        {request.status === 'approved' && !request.nda_document && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Upload Signed NDA</h3>

            {request.nda_template && (
              <div className="mb-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm font-medium mb-2">Step 1: Download NDA Template</p>
                <a
                  href={request.nda_template}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Download Template
                </a>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Step 2: Upload Signed NDA</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setNdaFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
              {ndaFile && <p className="text-sm text-green-600 mt-2">✓ Selected: {ndaFile.name}</p>}
            </div>

            <button
              onClick={handleUploadNDA}
              disabled={uploadingNDA || !ndaFile}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {uploadingNDA ? 'Uploading...' : 'Upload NDA'}
            </button>
          </div>
        )}

        {/* NDA Pending Message */}
        {request.status === 'nda_pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">⏳ NDA Under Review</h3>
            <p className="text-sm text-yellow-700">
              Your signed NDA has been uploaded and is awaiting approval from the resource owner.
            </p>
          </div>
        )}

        {/* Employee Details - Show after NDA signed */}
        {(request.status === 'nda_signed' || request.status === 'screening' || request.status === 'allocated') &&
          request.employee_details && request.employee_details.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Available Employees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.employee_details.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowEmployeeModal(true);
                    }}
                    className="block group w-full text-left"
                  >
                    <div className="border rounded-lg p-4 transition-all hover:shadow-md hover:border-primary-300 cursor-pointer bg-white group-hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                            {employee.full_name}
                          </div>
                          <div className="text-sm text-gray-600">{employee.job_title}</div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {employee.email}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {employee.experience_years} years • {employee.experience_level}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Screening Section - Show when NDA signed */}
        {request.status === 'nda_signed' && request.employee_details && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Complete HR Screening</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Employees</label>
              {request.employee_details.map((employee) => (
                <label key={employee.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={screeningData.allocated_employees.includes(employee.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setScreeningData(prev => ({
                          ...prev,
                          allocated_employees: [...prev.allocated_employees, employee.id]
                        }));
                      } else {
                        setScreeningData(prev => ({
                          ...prev,
                          allocated_employees: prev.allocated_employees.filter(id => id !== employee.id)
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <span>{employee.full_name} - {employee.job_title}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={screeningData.allocation_start_date}
                  onChange={(e) => setScreeningData(prev => ({ ...prev, allocation_start_date: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={screeningData.allocation_end_date}
                  onChange={(e) => setScreeningData(prev => ({ ...prev, allocation_end_date: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">HR Notes</label>
              <textarea
                value={screeningData.hr_notes}
                onChange={(e) => setScreeningData(prev => ({ ...prev, hr_notes: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                rows="4"
              />
            </div>

            <button
              onClick={handleCompleteScreening}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Complete Screening & Allocate
            </button>
          </div>
        )}

        {/* Chat Overlay */}
        <ChatOverlay
          resourceRequestId={params.id}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          recipientCompanyName={request.resource_company_name}
          currentUserCompanyId={user?.managed_companies?.[0]?.id}
        />

        {/* Employee Details Modal */}
        {showEmployeeModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Employee Details</h3>
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">First Name</label>
                      <p className="text-gray-900 font-medium">{selectedEmployee.first_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Last Name</label>
                      <p className="text-gray-900 font-medium">{selectedEmployee.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <a href={`mailto:${selectedEmployee.email}`} className="text-primary-600 hover:underline">
                        {selectedEmployee.email}
                      </a>
                    </div>
                    {selectedEmployee.phone && (
                      <div>
                        <label className="text-sm text-gray-500">Phone</label>
                        <a href={`tel:${selectedEmployee.phone}`} className="text-primary-600 hover:underline">
                          {selectedEmployee.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Professional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Job Title</label>
                      <p className="text-gray-900 font-medium">{selectedEmployee.job_title}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Company</label>
                      <p className="text-gray-900">{selectedEmployee.company_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Experience</label>
                      <p className="text-gray-900">{selectedEmployee.experience_years} years</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Experience Level</label>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {selectedEmployee.experience_level}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedEmployee.status === 'available' ? 'bg-green-100 text-green-800' :
                        selectedEmployee.status === 'allocated' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        } capitalize`}>
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>

                  {selectedEmployee.skills && (
                    <div className="mt-4">
                      <label className="text-sm text-gray-500">Skills</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedEmployee.skills.split(',').map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Employment Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Employment Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Bench Start Date</label>
                      <p className="text-gray-900">
                        {selectedEmployee.bench_start_date ? new Date(selectedEmployee.bench_start_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    {selectedEmployee.expected_availability_end && (
                      <div>
                        <label className="text-sm text-gray-500">Expected Availability End</label>
                        <p className="text-gray-900">
                          {new Date(selectedEmployee.expected_availability_end).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                {selectedEmployee.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedEmployee.notes}</p>
                  </div>
                )}

                {selectedEmployee.resume && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Resume</h4>
                    <a
                      href={selectedEmployee.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Resume
                    </a>
                  </div>
                )}

                {/* Metadata */}
                {(selectedEmployee.created_at || selectedEmployee.updated_at) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Record Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedEmployee.created_at && (
                        <div>
                          <label className="text-sm text-gray-500">Created At</label>
                          <p className="text-gray-900">
                            {new Date(selectedEmployee.created_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedEmployee.updated_at && (
                        <div>
                          <label className="text-sm text-gray-500">Last Updated</label>
                          <p className="text-gray-900">
                            {new Date(selectedEmployee.updated_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t px-6 py-4 bg-gray-50">
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="btn btn-secondary w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
