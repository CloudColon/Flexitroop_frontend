'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { employeeAPI, requestAPI, resourceRequestAPI, companyAPI } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import ProfileDropdown from '@/components/ProfileDropdown';

import { Mail, Phone, MapPin, Calendar, Award, Code } from 'lucide-react';

export default function EmployeeDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id;

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [requestData, setRequestData] = useState({
    requesting_company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && employeeId) {
      fetchEmployee();
    }
  }, [user, employeeId]);
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName[0].toUpperCase();
  };

  const fetchEmployee = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await employeeAPI.getById(employeeId);
      setEmployee(response.data);
    } catch (err) {
      console.error('Failed to fetch employee:', err);
      if (err.response?.status === 404) {
        setError('Employee not found.');
      } else {
        setError('Failed to load employee details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAll();
      const companiesList = response.data.results || response.data;
      setCompanies(companiesList);
      // Pre-select first company if available
      if (companiesList.length > 0) {
        setRequestData(prev => ({
          ...prev,
          requesting_company: companiesList[0].id.toString()
        }));
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  const handleToggleListing = async () => {
    setListingLoading(true);
    setError('');

    try {
      const response = await employeeAPI.toggleListing(employeeId);
      setEmployee(response.data.data);
    } catch (err) {
      console.error('Failed to toggle listing:', err);
      setError(err.response?.data?.error || 'Failed to update listing status. Please try again.');
    } finally {
      setListingLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setDeleting(true);
    try {
      await employeeAPI.delete(employeeId);
      router.push('/employees');
    } catch (err) {
      console.error('Failed to delete employee:', err);
      setError('Failed to delete employee. Please try again.');
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Use resourceRequestAPI to create a full request with NDA support
      await resourceRequestAPI.create({
        employee: parseInt(employeeId),
        requesting_company: parseInt(requestData.requesting_company),
        message: requestData.message,
      });

      setShowRequestModal(false);
      // Redirect to resource tracking to see the request
      router.push('/resource-tracking');
    } catch (err) {
      console.error('Failed to create request:', err);
      setError(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'badge-available';
      case 'requested':
        return 'badge-requested';
      case 'allocated':
        return 'badge-allocated';
      default:
        return 'badge-available';
    }
  };

  const getExperienceBadgeClass = (level) => {
    switch (level) {
      case 'junior':
        return 'bg-gray-100 text-gray-800';
      case 'mid':
        return 'bg-blue-100 text-blue-800';
      case 'senior':
        return 'bg-purple-100 text-purple-800';
      case 'lead':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
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
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading employee details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !employee) {
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
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/employees" className="btn btn-primary">
              Back to Employees
            </Link>
          </div>
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
            </div>
            <div className="flex items-center gap-4">
              <Link href="/employees" className="text-primary-600 font-medium">
                Employees
              </Link>
              <Link href="/companies" className="text-gray-700 hover:text-primary-600 font-medium">
                Companies
              </Link>
              <Link href="/requests" className="text-gray-700 hover:text-primary-600 font-medium">
                Requests
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Header */}
        {/* Header Section - Two Column Layout */}
        <div className="mb-8">
          <Link href="/employees" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to Employees
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

            {/* Left Column: Profile Photo */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                {/* Profile Photo Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative">
                    {/* Decorative background */}
                    <div className="h-24 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"></div>

                    {/* Main Profile Photo */}
                    <div className="relative -mt-12 px-6 pb-6">
                      <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                        {getInitials(employee.full_name)}
                      </div>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div className="px-6 pb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {employee.full_name}
                    </h1>
                    <p className="text-primary-600 font-semibold mb-4">
                      {employee.job_title}
                    </p>

                    {/* Status Badge */}
                    <span className={`badge ${getStatusBadgeClass(employee.status)} w-full text-center block`}>
                      {employee.status}
                    </span>

                    {/* Quick Stats */}
                    <div className="mt-6 space-y-3 border-t pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} className="text-primary-600" />
                        <span>{employee.experience_years} years exp.</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award size={16} className="text-primary-600" />
                        <span className={`badge ${getExperienceBadgeClass(employee.experience_level)} text-xs`}>
                          {employee.experience_level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-primary-600" />
                        <span>{employee.company_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Personal & Professional Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              )}

              {/* Personal Information Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <Mail size={20} className="text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                      <a href={`mailto:${employee.email}`} className="text-primary-600 hover:text-primary-700 font-medium">
                        {employee.email}
                      </a>
                    </div>
                  </div>

                  {employee.phone && (
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                      <Phone size={20} className="text-primary-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</p>
                        <a href={`tel:${employee.phone}`} className="text-primary-600 hover:text-primary-700 font-medium">
                          {employee.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <Award size={20} className="text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</p>
                      <p className="text-gray-900 font-medium">{employee.first_name} {employee.last_name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                  Professional Details
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <Code size={20} className="text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Experience Level</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`badge ${getExperienceBadgeClass(employee.experience_level)}`}>
                          {employee.experience_level}
                        </span>
                        <span className="text-gray-600 text-sm">{employee.experience_years} years</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <Award size={20} className="text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Status</p>
                      <span className={`badge ${getStatusBadgeClass(employee.status)} mt-1 inline-block`}>
                        {employee.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin size={20} className="text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</p>
                      <p className="text-gray-900 font-medium">{employee.company_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {employee.skills && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {employee.skills.split(',').map((skill, index) => (
                  <span key={index} className="badge bg-primary-100 text-primary-800">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {employee.resume && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500 mb-2">Resume</label>
              <a
                href={employee.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </a>
            </div>
          )}
        </div>

        {/* Employment Details */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Employment Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Bench Start Date</label>
              <p className="text-gray-900">
                {new Date(employee.bench_start_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {employee.expected_availability_end && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Expected Availability End</label>
                <p className="text-gray-900">
                  {new Date(employee.expected_availability_end).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>

          {employee.notes && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
              <p className="text-gray-700 whitespace-pre-wrap">{employee.notes}</p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
              <p className="text-gray-900">
                {new Date(employee.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-900">
                {new Date(employee.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card">
          <div className="flex flex-wrap gap-4">
            {/* Request Button - Only for non-owners */}
            {!user?.accessible_companies?.some(c => c.id === employee.company || c === employee.company) && employee.status === 'available' && (
              <button
                onClick={() => {
                  setShowRequestModal(true);
                  fetchCompanies();
                }}
                className="btn btn-primary"
              >
                Request Employee
              </button>
            )}

            {/* Owner Actions - Only for owners */}
            {user?.accessible_companies?.some(c => c.id === employee.company || c === employee.company) && (
              <>
                {employee.is_listed && (
                  <Link
                    href="/my-listings"
                    className="btn btn-primary"
                  >
                    Show Listing
                  </Link>
                )}
                <Link href={`/employees/${employee.id}/edit`} className="btn btn-secondary">
                  Update Employee
                </Link>
                <button
                  onClick={handleToggleListing}
                  disabled={listingLoading}
                  className={`btn ${employee.is_listed ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {listingLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : employee.is_listed ? (
                    'Unlist Employee'
                  ) : (
                    'List Employee'
                  )}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`btn ${deleteConfirm ? 'btn-danger' : 'bg-red-100 text-red-700 hover:bg-red-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {deleting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : deleteConfirm ? (
                    'Click Again to Confirm Delete'
                  ) : (
                    'Delete Employee'
                  )}
                </button>
                {deleteConfirm && (
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Request Employee Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Request Employee</h3>

            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="font-medium">{employee.full_name}</p>
              <p className="text-sm text-gray-600">{employee.job_title}</p>
              <p className="text-xs text-gray-500">{employee.company_name}</p>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requesting Company *
                </label>
                <select
                  value={requestData.requesting_company}
                  onChange={(e) => setRequestData({ ...requestData, requesting_company: e.target.value })}
                  className="input w-full"
                  required
                >
                  <option value="">Select a company...</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={requestData.message}
                  onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                  placeholder="Describe your requirements..."
                  className="input w-full"
                  rows="3"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !requestData.requesting_company}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
